import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  DeliveryAddressInput,
  DietaryPreferencesInput,
  DietaryType,
  FulfillmentMode,
  SubscriptionStatus,
} from "@/types/subscription";
import type { PlanTier } from "@/types/plans";
import { db, isDatabaseConfigured } from "@/lib/db";
import { assertProductionPersistenceAllowed } from "@/lib/production-persistence-guard";
import {
  users,
  profiles,
  subscriptionPlans,
  userSubscriptions,
  deliveryAddresses,
  dietaryPreferences,
  subscriptionAuditLogs,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Persisted Subscription Lead Record
 * Strict invariant: status is ALWAYS initialized to "pending_confirmation"
 * and hasActivePerks is ALWAYS false.
 */
export interface PersistedLeadRecord {
  id: string;
  leadReferenceCode: string;
  planId: PlanTier;
  planName: string;
  monthlyPriceINR: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  deliveryAddress: DeliveryAddressInput;
  dietaryPreferences: DietaryPreferencesInput;
  status: SubscriptionStatus;
  fulfillmentMode: FulfillmentMode;
  hasActivePerks: boolean;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateLeadDTO {
  clerkUserId?: string;
  leadReferenceCode: string;
  planId: PlanTier;
  planName: string;
  monthlyPriceINR: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  deliveryAddress: DeliveryAddressInput;
  dietaryPreferences: DietaryPreferencesInput;
  fulfillmentMode: FulfillmentMode;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Canonical pricing plans definition for seeding and safety
 */
export const CANONICAL_PLANS: Record<
  PlanTier,
  {
    name: string;
    monthlyPriceINR: number;
    perDayPriceINR: number;
    tagline: string;
    features: string[];
  }
> = {
  standard: {
    name: "Standard",
    monthlyPriceINR: 3500,
    perDayPriceINR: 116,
    tagline: "Doctor-approved daily breakfast for diabetes & heart wellness",
    features: [
      "26 fresh morning breakfast boxes / month",
      "Free monthly doctor health checkup at MedCity Smiles",
      "Weekly live nutritionist and wellness webinars",
      "Flexible pause or vacation options",
    ],
  },
  premium: {
    name: "Premium",
    monthlyPriceINR: 4000,
    perDayPriceINR: 133,
    tagline: "Customized clinical nutrition with 1-on-1 dietitian support",
    features: [
      "Everything in Standard",
      "1-on-1 dedicated dietitian consultations & custom meal tuning",
      "Priority early-morning kitchen dispatch",
      "Exclusive seasonal fruit infusions & doctor notes",
    ],
  },
};

/**
 * Repository Interface for Subscription Lead Persistence
 *
 * ARCHITECTURAL DESIGN:
 * This interface isolates the persistence mechanism from route handlers.
 * Maintains JsonFileLeadRepository during local/offline execution and enables
 * instant cutover to DrizzlePostgresLeadRepository when DATABASE_URL is configured.
 */
export interface ILeadRepository {
  createLead(data: CreateLeadDTO): Promise<PersistedLeadRecord>;
  getLeadByReference(referenceCode: string): Promise<PersistedLeadRecord | null>;
  getAllLeads(): Promise<PersistedLeadRecord[]>;
  updateLead(lead: PersistedLeadRecord): Promise<PersistedLeadRecord>;
}

/**
 * ============================================================================
 * LOCAL JSON PERSISTENCE IMPLEMENTATION
 * ============================================================================
 * Uses a server-side JSON file store (`data/leads.json`) to provide reliable,
 * zero-network-dependency persistence for local offline execution.
 */
export class JsonFileLeadRepository implements ILeadRepository {
  private filePath: string;

  constructor(customPath?: string) {
    const dataDir = path.join(process.cwd(), "data");
    this.filePath = customPath || path.join(dataDir, "leads.json");
    this.ensureStorageExists();
  }

  private ensureStorageExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf8");
    }
  }

  private readLeads(): PersistedLeadRecord[] {
    try {
      this.ensureStorageExists();
      const content = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(content || "[]") as PersistedLeadRecord[];
    } catch {
      return [];
    }
  }

  private writeLeads(leads: PersistedLeadRecord[]): void {
    this.ensureStorageExists();
    fs.writeFileSync(this.filePath, JSON.stringify(leads, null, 2), "utf8");
  }

  async createLead(data: CreateLeadDTO): Promise<PersistedLeadRecord> {
    const leads = this.readLeads();

    const now = new Date().toISOString();
    const newRecord: PersistedLeadRecord = {
      id: crypto.randomUUID(),
      leadReferenceCode: data.leadReferenceCode,
      planId: data.planId,
      planName: data.planName,
      monthlyPriceINR: data.monthlyPriceINR,
      customer: {
        fullName: data.customer.fullName.trim(),
        phone: data.customer.phone.trim(),
        email: data.customer.email.trim().toLowerCase(),
      },
      deliveryAddress: {
        flatNo: data.deliveryAddress.flatNo.trim(),
        buildingName: data.deliveryAddress.buildingName.trim(),
        streetAddress: data.deliveryAddress.streetAddress.trim(),
        area: data.deliveryAddress.area.trim(),
        city: data.deliveryAddress.city?.trim() || "Bangalore",
        pincode: data.deliveryAddress.pincode.trim(),
        deliveryNotes: data.deliveryAddress.deliveryNotes?.trim() || undefined,
      },
      dietaryPreferences: {
        dietaryType: data.dietaryPreferences.dietaryType,
        allergies: Array.isArray(data.dietaryPreferences.allergies)
          ? data.dietaryPreferences.allergies.map((a) => String(a).trim()).filter(Boolean)
          : [],
        notes: data.dietaryPreferences.notes?.trim() || undefined,
      },
      // STRICT INVARIANTS:
      status: "pending_confirmation",
      fulfillmentMode: data.fulfillmentMode,
      hasActivePerks: false,
      createdAt: now,
      updatedAt: now,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    };

    leads.push(newRecord);
    this.writeLeads(leads);
    return newRecord;
  }

  async getLeadByReference(referenceCode: string): Promise<PersistedLeadRecord | null> {
    const leads = this.readLeads();
    const found = leads.find(
      (l) => l.leadReferenceCode.toUpperCase() === referenceCode.trim().toUpperCase()
    );
    return found || null;
  }

  async getAllLeads(): Promise<PersistedLeadRecord[]> {
    return this.readLeads();
  }

  async updateLead(lead: PersistedLeadRecord): Promise<PersistedLeadRecord> {
    const leads = this.readLeads();
    const index = leads.findIndex(
      (l) => l.id === lead.id || l.leadReferenceCode === lead.leadReferenceCode
    );
    if (index !== -1) {
      leads[index] = lead;
      this.writeLeads(leads);
    }
    return lead;
  }
}

/**
 * ============================================================================
 * PRODUCTION DRIZZLE POSTGRESQL PERSISTENCE IMPLEMENTATION
 * ============================================================================
 * Executes multi-table atomic ACID transactions with row-level integrity
 * spanning users, profiles, user_subscriptions, delivery_addresses,
 * dietary_preferences, and subscription_audit_logs.
 */
export class DrizzlePostgresLeadRepository implements ILeadRepository {
  async createLead(data: CreateLeadDTO): Promise<PersistedLeadRecord> {
    return await db.transaction(async (tx) => {
      // 0. Ensure canonical plan row exists to satisfy foreign key constraint
      const canonicalPlan = CANONICAL_PLANS[data.planId] || {
        name: data.planName,
        monthlyPriceINR: data.monthlyPriceINR,
        perDayPriceINR: Math.round(data.monthlyPriceINR / 30),
        tagline: "Doctor-approved daily breakfast subscription",
        features: [],
      };

      await tx
        .insert(subscriptionPlans)
        .values({
          id: data.planId,
          name: canonicalPlan.name,
          monthlyPriceINR: canonicalPlan.monthlyPriceINR,
          perDayPriceINR: canonicalPlan.perDayPriceINR,
          tagline: canonicalPlan.tagline,
          features: canonicalPlan.features,
          isActive: true,
        })
        .onConflictDoNothing();

      // 1. Upsert or find user record by phone/email
      let [user] = await tx
        .select()
        .from(users)
        .where(
          data.clerkUserId
            ? eq(users.clerkUserId, data.clerkUserId)
            : eq(users.phone, data.customer.phone.trim())
        )
        .limit(1);

      if (!user) {
        [user] = await tx
          .insert(users)
          .values({
            clerkUserId: data.clerkUserId,
            email: data.customer.email.trim().toLowerCase(),
            phone: data.customer.phone.trim(),
            role: "customer",
            isActive: true,
          })
          .onConflictDoNothing()
          .returning();

        // If conflict prevented return, fetch by phone or email
        if (!user) {
          [user] = await tx
            .select()
            .from(users)
            .where(eq(users.phone, data.customer.phone.trim()))
            .limit(1);
        }

        if (user) {
          await tx
            .insert(profiles)
            .values({
              userId: user.id,
              fullName: data.customer.fullName.trim(),
              phone: data.customer.phone.trim(),
              email: data.customer.email.trim().toLowerCase(),
            })
            .onConflictDoNothing();
        }
      }

      if (!user) {
        throw new Error("Failed to resolve or create customer user identity.");
      }

      // 2. Insert Lead / Subscription with STRICT INVARIANT: 'pending_confirmation' & hasActivePerks: false
      const [sub] = await tx
        .insert(userSubscriptions)
        .values({
          userId: user.id,
          planId: data.planId,
          status: "pending_confirmation",
          fulfillmentMode: data.fulfillmentMode,
          leadReferenceCode: data.leadReferenceCode,
          hasActivePerks: false,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        })
        .returning();

      // 3. Insert Delivery Address
      const [addr] = await tx
        .insert(deliveryAddresses)
        .values({
          userId: user.id,
          subscriptionId: sub.id,
          flatNo: data.deliveryAddress.flatNo.trim(),
          buildingName: data.deliveryAddress.buildingName.trim(),
          streetAddress: data.deliveryAddress.streetAddress.trim(),
          area: data.deliveryAddress.area.trim(),
          city: data.deliveryAddress.city?.trim() || "Bangalore",
          pincode: data.deliveryAddress.pincode.trim(),
          deliveryNotes: data.deliveryAddress.deliveryNotes?.trim() || undefined,
          isDefault: true,
        })
        .returning();

      // 4. Insert Dietary Preferences
      const [diet] = await tx
        .insert(dietaryPreferences)
        .values({
          userId: user.id,
          subscriptionId: sub.id,
          dietaryType: data.dietaryPreferences.dietaryType,
          allergies: Array.isArray(data.dietaryPreferences.allergies)
            ? data.dietaryPreferences.allergies.map((a) => String(a).trim()).filter(Boolean)
            : [],
          notes: data.dietaryPreferences.notes?.trim() || undefined,
        })
        .returning();

      // 5. Append Immutable Audit Log
      await tx.insert(subscriptionAuditLogs).values({
        subscriptionId: sub.id,
        previousStatus: null,
        newStatus: "pending_confirmation",
        triggerReason: "assisted_lead_intake_api",
        metadata: {
          leadReferenceCode: data.leadReferenceCode,
          mode: data.fulfillmentMode,
        },
      });

      return {
        id: sub.id,
        leadReferenceCode: sub.leadReferenceCode,
        planId: data.planId,
        planName: data.planName,
        monthlyPriceINR: data.monthlyPriceINR,
        customer: {
          fullName: data.customer.fullName.trim(),
          phone: data.customer.phone.trim(),
          email: data.customer.email.trim().toLowerCase(),
        },
        deliveryAddress: {
          flatNo: addr.flatNo,
          buildingName: addr.buildingName,
          streetAddress: addr.streetAddress,
          area: addr.area,
          city: addr.city,
          pincode: addr.pincode,
          deliveryNotes: addr.deliveryNotes || undefined,
        },
        dietaryPreferences: {
          dietaryType: diet.dietaryType as DietaryType,
          allergies: diet.allergies || [],
          notes: diet.notes || undefined,
        },
        status: sub.status as SubscriptionStatus,
        fulfillmentMode: sub.fulfillmentMode as FulfillmentMode,
        hasActivePerks: sub.hasActivePerks,
        createdAt: sub.createdAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
        ipAddress: sub.ipAddress || undefined,
        userAgent: sub.userAgent || undefined,
      };
    });
  }

  async getLeadByReference(referenceCode: string): Promise<PersistedLeadRecord | null> {
    const code = referenceCode.toUpperCase().trim();
    const record = await db.query.userSubscriptions.findFirst({
      where: eq(userSubscriptions.leadReferenceCode, code),
      with: {
        user: { with: { profile: true } },
        deliveryAddress: true,
        dietaryPreferences: true,
        plan: true,
      },
    });

    if (!record || !record.user) {
      return null;
    }

    return {
      id: record.id,
      leadReferenceCode: record.leadReferenceCode,
      planId: record.planId as PlanTier,
      planName: record.plan?.name || (record.planId === "premium" ? "Premium" : "Standard"),
      monthlyPriceINR: record.plan?.monthlyPriceINR || (record.planId === "premium" ? 4000 : 3500),
      customer: {
        fullName: record.user.profile?.fullName || "",
        phone: record.user.phone || record.user.profile?.phone || "",
        email: record.user.email || record.user.profile?.email || "",
      },
      deliveryAddress: {
        flatNo: record.deliveryAddress?.flatNo || "",
        buildingName: record.deliveryAddress?.buildingName || "",
        streetAddress: record.deliveryAddress?.streetAddress || "",
        area: record.deliveryAddress?.area || "",
        city: record.deliveryAddress?.city || "Bangalore",
        pincode: record.deliveryAddress?.pincode || "",
        deliveryNotes: record.deliveryAddress?.deliveryNotes || undefined,
      },
      dietaryPreferences: {
        dietaryType: (record.dietaryPreferences?.dietaryType as DietaryType) || "standard",
        allergies: record.dietaryPreferences?.allergies || [],
        notes: record.dietaryPreferences?.notes || undefined,
      },
      status: record.status as SubscriptionStatus,
      fulfillmentMode: record.fulfillmentMode as FulfillmentMode,
      hasActivePerks: record.hasActivePerks,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      ipAddress: record.ipAddress || undefined,
      userAgent: record.userAgent || undefined,
    };
  }

  async getAllLeads(): Promise<PersistedLeadRecord[]> {
    const records = await db.query.userSubscriptions.findMany({
      orderBy: [desc(userSubscriptions.createdAt)],
      with: {
        user: { with: { profile: true } },
        deliveryAddress: true,
        dietaryPreferences: true,
        plan: true,
      },
    });

    return records.map((record) => ({
      id: record.id,
      leadReferenceCode: record.leadReferenceCode,
      planId: record.planId as PlanTier,
      planName: record.plan?.name || (record.planId === "premium" ? "Premium" : "Standard"),
      monthlyPriceINR: record.plan?.monthlyPriceINR || (record.planId === "premium" ? 4000 : 3500),
      customer: {
        fullName: record.user.profile?.fullName || "",
        phone: record.user.phone || record.user.profile?.phone || "",
        email: record.user.email || record.user.profile?.email || "",
      },
      deliveryAddress: {
        flatNo: record.deliveryAddress?.flatNo || "",
        buildingName: record.deliveryAddress?.buildingName || "",
        streetAddress: record.deliveryAddress?.streetAddress || "",
        area: record.deliveryAddress?.area || "",
        city: record.deliveryAddress?.city || "Bangalore",
        pincode: record.deliveryAddress?.pincode || "",
        deliveryNotes: record.deliveryAddress?.deliveryNotes || undefined,
      },
      dietaryPreferences: {
        dietaryType: (record.dietaryPreferences?.dietaryType as DietaryType) || "standard",
        allergies: record.dietaryPreferences?.allergies || [],
        notes: record.dietaryPreferences?.notes || undefined,
      },
      status: record.status as SubscriptionStatus,
      fulfillmentMode: record.fulfillmentMode as FulfillmentMode,
      hasActivePerks: record.hasActivePerks,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      ipAddress: record.ipAddress || undefined,
      userAgent: record.userAgent || undefined,
    }));
  }

  async updateLead(lead: PersistedLeadRecord): Promise<PersistedLeadRecord> {
    return await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.leadReferenceCode, lead.leadReferenceCode))
        .limit(1);

      if (existing) {
        await tx
          .update(userSubscriptions)
          .set({
            status: lead.status,
            hasActivePerks: lead.hasActivePerks,
            updatedAt: new Date(),
          })
          .where(eq(userSubscriptions.id, existing.id));

        if (existing.status !== lead.status) {
          await tx.insert(subscriptionAuditLogs).values({
            subscriptionId: existing.id,
            previousStatus: existing.status,
            newStatus: lead.status,
            triggerReason: "payment_webhook_or_verification_update",
            metadata: {
              leadReferenceCode: lead.leadReferenceCode,
              hasActivePerks: lead.hasActivePerks,
            },
          });
        }
      }

      return lead;
    });
  }
}

/**
 * ============================================================================
 * HYBRID REPOSITORY DELEGATOR
 * ============================================================================
 * Dynamically dispatches between DrizzlePostgresLeadRepository (when
 * DATABASE_URL is configured) and JsonFileLeadRepository (when running offline).
 */
export class HybridLeadRepository implements ILeadRepository {
  private jsonRepo: JsonFileLeadRepository;
  private postgresRepo: DrizzlePostgresLeadRepository;

  constructor(customJsonPath?: string) {
    this.jsonRepo = new JsonFileLeadRepository(customJsonPath);
    this.postgresRepo = new DrizzlePostgresLeadRepository();
  }

  public getActiveDriverName(): "postgresql_drizzle" | "local_json_fallback" {
    return isDatabaseConfigured() ? "postgresql_drizzle" : "local_json_fallback";
  }

  private getActiveRepository(): ILeadRepository {
    const configured = isDatabaseConfigured();
    assertProductionPersistenceAllowed("lead records", configured, process.env.NODE_ENV);
    return configured ? this.postgresRepo : this.jsonRepo;
  }

  async createLead(data: CreateLeadDTO): Promise<PersistedLeadRecord> {
    return this.getActiveRepository().createLead(data);
  }

  async getLeadByReference(referenceCode: string): Promise<PersistedLeadRecord | null> {
    return this.getActiveRepository().getLeadByReference(referenceCode);
  }

  async getAllLeads(): Promise<PersistedLeadRecord[]> {
    return this.getActiveRepository().getAllLeads();
  }

  async updateLead(lead: PersistedLeadRecord): Promise<PersistedLeadRecord> {
    return this.getActiveRepository().updateLead(lead);
  }
}

// Authoritative singleton repository instance for API routes
export const leadRepository = new HybridLeadRepository();
