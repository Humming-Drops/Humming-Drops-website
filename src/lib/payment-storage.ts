import fs from "fs";
import path from "path";

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
  hasWebhookEvent(eventId: string): boolean;
  recordWebhookEvent(event: WebhookEventRecord): Promise<void>;
  createOrder(order: PaymentOrderRecord): Promise<void>;
  getOrder(orderId: string): Promise<PaymentOrderRecord | null>;
  recordTransaction(tx: PaymentTransactionRecord): Promise<void>;
  getTransaction(txId: string): Promise<PaymentTransactionRecord | null>;
  listOrders(): Promise<PaymentOrderRecord[]>;
  listTransactions(): Promise<PaymentTransactionRecord[]>;
}

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

  hasWebhookEvent(eventId: string): boolean {
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

export const paymentRepository: IPaymentRepository = new JsonFilePaymentRepository();
