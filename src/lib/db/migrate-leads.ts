import fs from "fs";
import path from "path";
import { db, isDatabaseConfigured } from "./index";
import {
  subscriptionPlans,
  users,
  profiles,
  userSubscriptions,
  deliveryAddresses,
  dietaryPreferences,
  subscriptionAuditLogs,
} from "./schema";
import { eq } from "drizzle-orm";
import { CANONICAL_PLANS, type PersistedLeadRecord } from "../lead-storage";

export interface MigrationSummary {
  success: boolean;
  plansSeeded: number;
  leadsMigrated: number;
  leadsSkipped: number;
  message: string;
}

/**
 * Seeds canonical subscription plans into PostgreSQL.
 */
export async function seedSubscriptionPlans(): Promise<number> {
  let seededCount = 0;
  for (const [planId, planData] of Object.entries(CANONICAL_PLANS)) {
    await db
      .insert(subscriptionPlans)
      .values({
        id: planId,
        name: planData.name,
        monthlyPriceINR: planData.monthlyPriceINR,
        perDayPriceINR: planData.perDayPriceINR,
        tagline: planData.tagline,
        features: planData.features,
        isActive: true,
      })
      .onConflictDoNothing();
    seededCount++;
  }
  return seededCount;
}

/**
 * Migrates local JSON leads from data/leads.json into Railway PostgreSQL.
 */
export async function migrateJsonLeadsToPostgres(
  customJsonPath?: string
): Promise<MigrationSummary> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      plansSeeded: 0,
      leadsMigrated: 0,
      leadsSkipped: 0,
      message: "DATABASE_URL is not configured. Migration aborted.",
    };
  }

  const plansSeeded = await seedSubscriptionPlans();

  const jsonPath = customJsonPath || path.join(process.cwd(), "data", "leads.json");
  if (!fs.existsSync(jsonPath)) {
    return {
      success: true,
      plansSeeded,
      leadsMigrated: 0,
      leadsSkipped: 0,
      message: `No JSON file found at ${jsonPath}. Plans successfully seeded.`,
    };
  }

  const raw = fs.readFileSync(jsonPath, "utf8");
  const leads: PersistedLeadRecord[] = JSON.parse(raw || "[]");

  let leadsMigrated = 0;
  let leadsSkipped = 0;

  for (const lead of leads) {
    const existing = await db
      .select({ id: userSubscriptions.id })
      .from(userSubscriptions)
      .where(eq(userSubscriptions.leadReferenceCode, lead.leadReferenceCode))
      .limit(1);

    if (existing.length > 0) {
      leadsSkipped++;
      continue;
    }

    await db.transaction(async (tx) => {
      // 1. Resolve or create user
      let [user] = await tx
        .select()
        .from(users)
        .where(eq(users.phone, lead.customer.phone.trim()))
        .limit(1);

      if (!user) {
        [user] = await tx
          .insert(users)
          .values({
            email: lead.customer.email.trim().toLowerCase(),
            phone: lead.customer.phone.trim(),
            role: "customer",
            isActive: true,
          })
          .onConflictDoNothing()
          .returning();

        if (!user) {
          [user] = await tx
            .select()
            .from(users)
            .where(eq(users.email, lead.customer.email.trim().toLowerCase()))
            .limit(1);
        }

        if (user) {
          await tx
            .insert(profiles)
            .values({
              userId: user.id,
              fullName: lead.customer.fullName.trim(),
              phone: lead.customer.phone.trim(),
              email: lead.customer.email.trim().toLowerCase(),
            })
            .onConflictDoNothing();
        }
      }

      if (!user) {
        throw new Error(`Unable to resolve identity for lead ${lead.leadReferenceCode}`);
      }

      // 2. Insert subscription
      const [sub] = await tx
        .insert(userSubscriptions)
        .values({
          id: lead.id,
          userId: user.id,
          planId: lead.planId,
          status: lead.status || "pending_confirmation",
          fulfillmentMode: lead.fulfillmentMode || "assisted_lead",
          leadReferenceCode: lead.leadReferenceCode,
          hasActivePerks: lead.hasActivePerks || false,
          ipAddress: lead.ipAddress,
          userAgent: lead.userAgent,
          createdAt: lead.createdAt ? new Date(lead.createdAt) : new Date(),
          updatedAt: lead.updatedAt ? new Date(lead.updatedAt) : new Date(),
        })
        .returning();

      // 3. Insert delivery address
      await tx.insert(deliveryAddresses).values({
        userId: user.id,
        subscriptionId: sub.id,
        flatNo: lead.deliveryAddress.flatNo.trim(),
        buildingName: lead.deliveryAddress.buildingName.trim(),
        streetAddress: lead.deliveryAddress.streetAddress.trim(),
        area: lead.deliveryAddress.area.trim(),
        city: lead.deliveryAddress.city?.trim() || "Bangalore",
        pincode: lead.deliveryAddress.pincode.trim(),
        deliveryNotes: lead.deliveryAddress.deliveryNotes?.trim() || undefined,
        isDefault: true,
      });

      // 4. Insert dietary preferences
      await tx.insert(dietaryPreferences).values({
        userId: user.id,
        subscriptionId: sub.id,
        dietaryType: lead.dietaryPreferences.dietaryType,
        allergies: Array.isArray(lead.dietaryPreferences.allergies)
          ? lead.dietaryPreferences.allergies.map((a) => String(a).trim()).filter(Boolean)
          : [],
        notes: lead.dietaryPreferences.notes?.trim() || undefined,
      });

      // 5. Append audit log
      await tx.insert(subscriptionAuditLogs).values({
        subscriptionId: sub.id,
        previousStatus: null,
        newStatus: lead.status || "pending_confirmation",
        triggerReason: "json_migration_script",
        metadata: {
          migratedFrom: jsonPath,
          leadReferenceCode: lead.leadReferenceCode,
        },
      });

      leadsMigrated++;
    });
  }

  return {
    success: true,
    plansSeeded,
    leadsMigrated,
    leadsSkipped,
    message: `Migration complete. Seeded ${plansSeeded} plans, migrated ${leadsMigrated} leads, skipped ${leadsSkipped} duplicate leads.`,
  };
}
