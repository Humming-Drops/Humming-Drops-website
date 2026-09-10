import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  DeliveryAddressInput,
  DietaryPreferencesInput,
  FulfillmentMode,
  SubscriptionStatus,
} from "@/types/subscription";
import { PlanTier } from "@/types/plans";

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
 * Repository Interface for Subscription Lead Persistence
 *
 * ARCHITECTURAL DESIGN:
 * This interface isolates the persistence mechanism from route handlers.
 * For tomorrow's 40% presentation, the concrete implementation is JsonFileLeadRepository.
 * In Phase 9, this can be swapped for SupabaseLeadRepository (targeting the
 * `user_subscriptions` & `profiles` tables) with zero changes to API routes.
 */
export interface ILeadRepository {
  createLead(data: CreateLeadDTO): Promise<PersistedLeadRecord>;
  getLeadByReference(referenceCode: string): Promise<PersistedLeadRecord | null>;
  getAllLeads(): Promise<PersistedLeadRecord[]>;
}

/**
 * ============================================================================
 * TEMPORARY DEMO PERSISTENCE IMPLEMENTATION (40% Project Presentation)
 * ============================================================================
 * Uses a server-side JSON file store (`data/leads.json`) to provide reliable,
 * zero-network-dependency persistence for local evaluation and demonstration.
 *
 * DO NOT use this in production multi-tenant environments.
 * Production target: Supabase PostgreSQL with Row Level Security (Phase 9).
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
        city: "Bangalore",
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
}

// Singleton repository instance for API routes
export const leadRepository: ILeadRepository = new JsonFileLeadRepository();
