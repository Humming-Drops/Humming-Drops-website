import fs from "fs";
import path from "path";
import { desc, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { paymentOrders, paymentTransactions, paymentWebhookEvents } from "@/lib/db/schema";
import { assertProductionPersistenceAllowed } from "@/lib/production-persistence-guard";

export interface WebhookEventRecord {
  id: string;
  provider: "razorpay";
  eventType: string;
  status: "processed" | "failed";
  payload: any;
  processedAt: string;
}

export interface PaymentOrderRecord {
  id: string;
  planId: string;
  amountINR: number;
  amountPaise: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  leadReferenceCode?: string;
  notes?: Record<string, string>;
  createdAt: string;
}

export interface PaymentTransactionRecord {
  id: string;
  orderId: string;
  amountPaise: number;
  status: "authorized" | "captured" | "failed" | "refunded";
  signature?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface IPaymentRepository {
  hasWebhookEvent(eventId: string): Promise<boolean>;
  recordWebhookEvent(event: WebhookEventRecord): Promise<void>;
  createOrder(order: PaymentOrderRecord): Promise<void>;
  getOrder(orderId: string): Promise<PaymentOrderRecord | null>;
  recordTransaction(tx: PaymentTransactionRecord): Promise<void>;
  getTransaction(txId: string): Promise<PaymentTransactionRecord | null>;
  listOrders(): Promise<PaymentOrderRecord[]>;
  listTransactions(): Promise<PaymentTransactionRecord[]>;
}

/**
 * ============================================================================
 * LOCAL JSON PERSISTENCE IMPLEMENTATION
 * ============================================================================
 * Zero-network-dependency persistence for local/offline development only.
 * HybridPaymentRepository refuses to select this in production when
 * PostgreSQL isn't configured -- see assertProductionPersistenceAllowed.
 */
export class JsonFilePaymentRepository implements IPaymentRepository {
  private eventsFilePath: string;
  private paymentsFilePath: string;
  private processedEventIds = new Set<string>();

  constructor() {
    const dataDir = path.join(process.cwd(), "data");
    this.eventsFilePath = path.join(dataDir, "webhook-events.json");
    this.paymentsFilePath = path.join(dataDir, "payments.json");
    this.ensureStorageExists();
    this.loadEventIds();
  }

  private ensureStorageExists(): void {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.eventsFilePath)) {
      fs.writeFileSync(this.eventsFilePath, JSON.stringify([], null, 2), "utf8");
    }
    if (!fs.existsSync(this.paymentsFilePath)) {
      fs.writeFileSync(this.paymentsFilePath, JSON.stringify({ orders: [], transactions: [] }, null, 2), "utf8");
    }
  }

  private loadEventIds(): void {
    try {
      if (fs.existsSync(this.eventsFilePath)) {
        const raw = fs.readFileSync(this.eventsFilePath, "utf8");
        const events = JSON.parse(raw || "[]") as WebhookEventRecord[];
        for (const ev of events) {
          if (ev.id) this.processedEventIds.add(ev.id);
        }
      }
    } catch {
      // Fallback to empty in-memory set
    }
  }

  async hasWebhookEvent(eventId: string): Promise<boolean> {
    return this.processedEventIds.has(eventId);
  }

  async recordWebhookEvent(event: WebhookEventRecord): Promise<void> {
    this.ensureStorageExists();
    this.processedEventIds.add(event.id);

    try {
      const raw = fs.readFileSync(this.eventsFilePath, "utf8");
      const events = JSON.parse(raw || "[]") as WebhookEventRecord[];
      events.push(event);
      fs.writeFileSync(this.eventsFilePath, JSON.stringify(events, null, 2), "utf8");
    } catch (err) {
      console.error("[PAYMENT STORAGE] Failed to write webhook event:", err);
    }
  }

  async createOrder(order: PaymentOrderRecord): Promise<void> {
    this.ensureStorageExists();
    try {
      const raw = fs.readFileSync(this.paymentsFilePath, "utf8");
      const data = JSON.parse(raw || '{"orders":[],"transactions":[]}') as {
        orders: PaymentOrderRecord[];
        transactions: PaymentTransactionRecord[];
      };
      data.orders.push(order);
      fs.writeFileSync(this.paymentsFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.error("[PAYMENT STORAGE] Failed to record order:", err);
    }
  }

  async getOrder(orderId: string): Promise<PaymentOrderRecord | null> {
    try {
      const raw = fs.readFileSync(this.paymentsFilePath, "utf8");
      const data = JSON.parse(raw || '{"orders":[],"transactions":[]}') as {
        orders: PaymentOrderRecord[];
      };
      return data.orders.find((o) => o.id === orderId) || null;
    } catch {
      return null;
    }
  }

  async recordTransaction(tx: PaymentTransactionRecord): Promise<void> {
    this.ensureStorageExists();
    try {
      const raw = fs.readFileSync(this.paymentsFilePath, "utf8");
      const data = JSON.parse(raw || '{"orders":[],"transactions":[]}') as {
        orders: PaymentOrderRecord[];
        transactions: PaymentTransactionRecord[];
      };
      const existingIdx = data.transactions.findIndex((t) => t.id === tx.id);
      if (existingIdx !== -1) {
        data.transactions[existingIdx] = tx;
      } else {
        data.transactions.push(tx);
      }
      fs.writeFileSync(this.paymentsFilePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
      console.error("[PAYMENT STORAGE] Failed to record transaction:", err);
    }
  }

  async getTransaction(txId: string): Promise<PaymentTransactionRecord | null> {
    try {
      const raw = fs.readFileSync(this.paymentsFilePath, "utf8");
      const data = JSON.parse(raw || '{"orders":[],"transactions":[]}') as {
        transactions: PaymentTransactionRecord[];
      };
      return data.transactions.find((t) => t.id === txId) || null;
    } catch {
      return null;
    }
  }

  async listOrders(): Promise<PaymentOrderRecord[]> {
    try {
      const raw = fs.readFileSync(this.paymentsFilePath, "utf8");
      const data = JSON.parse(raw || '{"orders":[],"transactions":[]}') as {
        orders: PaymentOrderRecord[];
      };
      return [...data.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      return [];
    }
  }

  async listTransactions(): Promise<PaymentTransactionRecord[]> {
    try {
      const raw = fs.readFileSync(this.paymentsFilePath, "utf8");
      const data = JSON.parse(raw || '{"orders":[],"transactions":[]}') as {
        transactions: PaymentTransactionRecord[];
      };
      return [...data.transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      return [];
    }
  }
}

/**
 * ============================================================================
 * PRODUCTION DRIZZLE POSTGRESQL PERSISTENCE IMPLEMENTATION
 * ============================================================================
 */
export class DrizzlePostgresPaymentRepository implements IPaymentRepository {
  async hasWebhookEvent(eventId: string): Promise<boolean> {
    const [row] = await db
      .select({ id: paymentWebhookEvents.id })
      .from(paymentWebhookEvents)
      .where(eq(paymentWebhookEvents.id, eventId))
      .limit(1);
    return Boolean(row);
  }

  async recordWebhookEvent(event: WebhookEventRecord): Promise<void> {
    await db
      .insert(paymentWebhookEvents)
      .values({
        id: event.id,
        provider: event.provider,
        eventType: event.eventType,
        status: event.status,
        payload: event.payload,
      })
      .onConflictDoNothing();
  }

  async createOrder(order: PaymentOrderRecord): Promise<void> {
    await db.insert(paymentOrders).values({
      id: order.id,
      planId: order.planId,
      amountInr: order.amountINR,
      amountPaise: order.amountPaise,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      leadReferenceCode: order.leadReferenceCode,
      notes: order.notes,
    });
  }

  async getOrder(orderId: string): Promise<PaymentOrderRecord | null> {
    const [row] = await db.select().from(paymentOrders).where(eq(paymentOrders.id, orderId)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      planId: row.planId,
      amountINR: row.amountInr,
      amountPaise: row.amountPaise,
      currency: row.currency,
      receipt: row.receipt,
      status: row.status,
      leadReferenceCode: row.leadReferenceCode ?? undefined,
      notes: (row.notes as Record<string, string> | null) ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async recordTransaction(tx: PaymentTransactionRecord): Promise<void> {
    await db
      .insert(paymentTransactions)
      .values({
        id: tx.id,
        orderId: tx.orderId,
        amountPaise: tx.amountPaise,
        status: tx.status,
        signature: tx.signature,
        verifiedAt: tx.verifiedAt ? new Date(tx.verifiedAt) : undefined,
      })
      .onConflictDoUpdate({
        target: paymentTransactions.id,
        set: {
          status: tx.status,
          signature: tx.signature,
          verifiedAt: tx.verifiedAt ? new Date(tx.verifiedAt) : undefined,
        },
      });
  }

  async getTransaction(txId: string): Promise<PaymentTransactionRecord | null> {
    const [row] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, txId))
      .limit(1);
    if (!row) return null;
    return {
      id: row.id,
      orderId: row.orderId,
      amountPaise: row.amountPaise,
      status: row.status,
      signature: row.signature ?? undefined,
      verifiedAt: row.verifiedAt ? row.verifiedAt.toISOString() : undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async listOrders(): Promise<PaymentOrderRecord[]> {
    const rows = await db.select().from(paymentOrders).orderBy(desc(paymentOrders.createdAt));
    return rows.map((row) => ({
      id: row.id,
      planId: row.planId,
      amountINR: row.amountInr,
      amountPaise: row.amountPaise,
      currency: row.currency,
      receipt: row.receipt,
      status: row.status,
      leadReferenceCode: row.leadReferenceCode ?? undefined,
      notes: (row.notes as Record<string, string> | null) ?? undefined,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async listTransactions(): Promise<PaymentTransactionRecord[]> {
    const rows = await db.select().from(paymentTransactions).orderBy(desc(paymentTransactions.createdAt));
    return rows.map((row) => ({
      id: row.id,
      orderId: row.orderId,
      amountPaise: row.amountPaise,
      status: row.status,
      signature: row.signature ?? undefined,
      verifiedAt: row.verifiedAt ? row.verifiedAt.toISOString() : undefined,
      createdAt: row.createdAt.toISOString(),
    }));
  }
}

/**
 * ============================================================================
 * HYBRID REPOSITORY DELEGATOR
 * ============================================================================
 * Dispatches to Postgres when DATABASE_URL is configured. When it isn't,
 * local JSON is only acceptable outside production -- see
 * assertProductionPersistenceAllowed, which throws rather than silently
 * writing payment/webhook records to an ephemeral production filesystem.
 */
export class HybridPaymentRepository implements IPaymentRepository {
  private jsonRepo: JsonFilePaymentRepository;
  private postgresRepo: DrizzlePostgresPaymentRepository;

  constructor() {
    this.jsonRepo = new JsonFilePaymentRepository();
    this.postgresRepo = new DrizzlePostgresPaymentRepository();
  }

  public getActiveDriverName(): "postgresql_drizzle" | "local_json_fallback" {
    return isDatabaseConfigured() ? "postgresql_drizzle" : "local_json_fallback";
  }

  private getActiveRepository(): IPaymentRepository {
    const configured = isDatabaseConfigured();
    assertProductionPersistenceAllowed("payment and webhook records", configured, process.env.NODE_ENV);
    return configured ? this.postgresRepo : this.jsonRepo;
  }

  async hasWebhookEvent(eventId: string): Promise<boolean> {
    return this.getActiveRepository().hasWebhookEvent(eventId);
  }

  async recordWebhookEvent(event: WebhookEventRecord): Promise<void> {
    return this.getActiveRepository().recordWebhookEvent(event);
  }

  async createOrder(order: PaymentOrderRecord): Promise<void> {
    return this.getActiveRepository().createOrder(order);
  }

  async getOrder(orderId: string): Promise<PaymentOrderRecord | null> {
    return this.getActiveRepository().getOrder(orderId);
  }

  async recordTransaction(tx: PaymentTransactionRecord): Promise<void> {
    return this.getActiveRepository().recordTransaction(tx);
  }

  async getTransaction(txId: string): Promise<PaymentTransactionRecord | null> {
    return this.getActiveRepository().getTransaction(txId);
  }

  async listOrders(): Promise<PaymentOrderRecord[]> {
    return this.getActiveRepository().listOrders();
  }

  async listTransactions(): Promise<PaymentTransactionRecord[]> {
    return this.getActiveRepository().listTransactions();
  }
}

// Authoritative singleton repository instance for API routes
export const paymentRepository: IPaymentRepository = new HybridPaymentRepository();
