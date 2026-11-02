import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uuid,
  jsonb,
  numeric,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

// ============================================================================
// 1. POSTGRES ENUMS
// ============================================================================

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "registration_submitted",
  "pending_confirmation",
  "confirmed_active",
  "paused",
  "cancelled",
  "expired",
]);

export const fulfillmentModeEnum = pgEnum("fulfillment_mode", [
  "assisted_lead",
  "online_gateway",
]);

export const dietaryTypeEnum = pgEnum("dietary_type", [
  "standard",
  "vegan",
  "pure_fruit",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "razorpay",
  "whatsapp_assisted",
  "manual_offline",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "captured",
  "refunded",
  "failed",
]);

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "admin",
  "operations",
  "nutritionist",
]);

// ============================================================================
// 2. CORE IDENTITY & PROFILES
// ============================================================================

/**
 * Users Table
 * Authentication root for registered customers and operations staff.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    phone: text("phone").notNull().unique(),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").notNull().default("customer"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    uniqueIndex("users_phone_idx").on(table.phone),
  ]
);

/**
 * Customer Profiles Table
 * Detailed PII metadata linked to core identity.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("profiles_user_id_idx").on(table.userId),
  ]
);

// ============================================================================
// 3. CANONICAL SUBSCRIPTION PLANS
// ============================================================================

/**
 * Canonical Subscription Plans Table
 * Source of truth for pricing: Standard (₹3,500/mo) & Premium (₹4,000/mo).
 */
export const subscriptionPlans = pgTable("subscription_plans", {
  id: text("id").primaryKey(), // 'standard' | 'premium'
  name: text("name").notNull(), // 'Standard' | 'Premium'
  monthlyPriceINR: integer("monthly_price_inr").notNull(), // 3500, 4000
  perDayPriceINR: integer("per_day_price_inr").notNull(), // 116, 133
  tagline: text("tagline").notNull(),
  features: jsonb("features").notNull(), // Box inclusions, perks array
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================================
// 4. USER SUBSCRIPTIONS & LEADS
// ============================================================================

/**
 * User Subscriptions Table
 * Holds subscription lifecycle state for both Mode A (gateway) and Mode B (leads).
 */
export const userSubscriptions = pgTable(
  "user_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: text("plan_id")
      .notNull()
      .references(() => subscriptionPlans.id, { onDelete: "restrict" }),
    status: subscriptionStatusEnum("status")
      .notNull()
      .default("pending_confirmation"),
    fulfillmentMode: fulfillmentModeEnum("fulfillment_mode")
      .notNull()
      .default("assisted_lead"),
    leadReferenceCode: text("lead_reference_code").notNull().unique(), // e.g. HD-REG-2026-74291
    hasActivePerks: boolean("has_active_perks").notNull().default(false),
    startDate: date("start_date"),
    renewalDate: date("renewal_date"),
    pauseStart: date("pause_start"),
    pauseEnd: date("pause_end"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("user_subscriptions_user_id_idx").on(table.userId),
    uniqueIndex("user_subscriptions_ref_code_idx").on(table.leadReferenceCode),
    index("user_subscriptions_status_idx").on(table.status),
    index("user_subscriptions_pending_idx")
      .on(table.status)
      .where(sql`status = 'pending_confirmation'`),
  ]
);

// ============================================================================
// 5. DELIVERY ADDRESSES
// ============================================================================

/**
 * Delivery Addresses Table
 * Captures Bangalore delivery locations without rigid corridor lockouts.
 */
export const deliveryAddresses = pgTable(
  "delivery_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => userSubscriptions.id, { onDelete: "cascade" }),
    flatNo: text("flat_no").notNull(),
    buildingName: text("building_name").notNull(),
    streetAddress: text("street_address").notNull(),
    area: text("area").notNull(),
    city: text("city").notNull().default("Bangalore"),
    pincode: text("pincode").notNull(),
    deliveryNotes: text("delivery_notes"),
    isDefault: boolean("is_default").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("delivery_addresses_user_sub_idx").on(table.userId, table.subscriptionId),
    index("delivery_addresses_pincode_idx").on(table.pincode),
  ]
);

// ============================================================================
// 6. DIETARY PREFERENCES
// ============================================================================

/**
 * Dietary Preferences Table
 * Captures dietary constraints, allergies, and custom customer requests.
 */
export const dietaryPreferences = pgTable(
  "dietary_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => userSubscriptions.id, { onDelete: "cascade" }),
    dietaryType: dietaryTypeEnum("dietary_type").notNull().default("standard"),
    allergies: text("allergies").array().notNull().default(sql`'{}'::text[]`),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("dietary_preferences_sub_idx").on(table.subscriptionId),
  ]
);

// ============================================================================
// 7. HEALTH VITALS LOGS (MedCity Smiles Clinic Partnership)
// ============================================================================

/**
 * Health Vitals Table
 * Free monthly health checkup records for active subscribers.
 */
export const healthVitals = pgTable(
  "health_vitals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    checkupDate: date("checkup_date").notNull(),
    bloodSugarFasting: numeric("blood_sugar_fasting", { precision: 5, scale: 2 }),
    bloodSugarPp: numeric("blood_sugar_pp", { precision: 5, scale: 2 }),
    cholesterolTotal: numeric("cholesterol_total", { precision: 5, scale: 2 }),
    bloodPressureSystolic: integer("blood_pressure_systolic"),
    bloodPressureDiastolic: integer("blood_pressure_diastolic"),
    doctorNotes: text("doctor_notes"),
    reportPdfUrl: text("report_pdf_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("health_vitals_user_date_idx").on(table.userId, table.checkupDate),
  ]
);

// ============================================================================
// 8. COMMUNITY WEBINARS & MEMBER SESSIONS
// ============================================================================

export const communitySessions = pgTable("community_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  speakerName: text("speaker_name").notNull(),
  speakerTitle: text("speaker_title").notNull(),
  sessionDatetime: timestamp("session_datetime", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  meetingUrl: text("meeting_url"),
  description: text("description").notNull(),
  isLive: boolean("is_live").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionRegistrations = pgTable(
  "session_registrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => communitySessions.id, { onDelete: "cascade" }),
    registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("user_session_unique_idx").on(table.userId, table.sessionId),
  ]
);

// ============================================================================
// 9. PAYMENTS & TRANSACTION AUDIT
// ============================================================================

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => userSubscriptions.id, { onDelete: "cascade" }),
    paymentMethod: paymentMethodEnum("payment_method").notNull().default("razorpay"),
    gatewayOrderId: text("gateway_order_id"), // Razorpay order_id (null for assisted leads)
    gatewayPaymentId: text("gateway_payment_id"),
    gatewaySignature: text("gateway_signature"),
    amountSubunits: integer("amount_subunits").notNull(), // In paise (₹3500 -> 350000)
    currency: text("currency").notNull().default("INR"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    rawWebhookPayload: jsonb("raw_webhook_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payments_gateway_order_idx").on(table.gatewayOrderId),
    index("payments_sub_idx").on(table.subscriptionId),
  ]
);

// ============================================================================
// 10. SUBSCRIPTION & LEAD AUDIT LOGS
// ============================================================================

export const subscriptionAuditLogs = pgTable(
  "subscription_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => userSubscriptions.id, { onDelete: "cascade" }),
    previousStatus: text("previous_status"),
    newStatus: text("new_status").notNull(),
    changedByUserId: uuid("changed_by_user_id").references(() => users.id, { onDelete: "set null" }),
    triggerReason: text("trigger_reason").notNull(), // e.g., 'assisted_lead_intake_api', 'admin_whatsapp_verified'
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("audit_logs_sub_idx").on(table.subscriptionId),
  ]
);

// ============================================================================
// 11. DRIZZLE RELATIONS GRAPH
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  subscriptions: many(userSubscriptions),
  addresses: many(deliveryAddresses),
  healthVitals: many(healthVitals),
  payments: many(payments),
  sessionRegistrations: many(sessionRegistrations),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one, many }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [userSubscriptions.planId], references: [subscriptionPlans.id] }),
  deliveryAddress: one(deliveryAddresses, { fields: [userSubscriptions.id], references: [deliveryAddresses.subscriptionId] }),
  dietaryPreferences: one(dietaryPreferences, { fields: [userSubscriptions.id], references: [dietaryPreferences.subscriptionId] }),
  payments: many(payments),
  auditLogs: many(subscriptionAuditLogs),
}));

export const deliveryAddressesRelations = relations(deliveryAddresses, ({ one }) => ({
  user: one(users, { fields: [deliveryAddresses.userId], references: [users.id] }),
  subscription: one(userSubscriptions, { fields: [deliveryAddresses.subscriptionId], references: [userSubscriptions.id] }),
}));

export const dietaryPreferencesRelations = relations(dietaryPreferences, ({ one }) => ({
  user: one(users, { fields: [dietaryPreferences.userId], references: [users.id] }),
  subscription: one(userSubscriptions, { fields: [dietaryPreferences.subscriptionId], references: [userSubscriptions.id] }),
}));

export const healthVitalsRelations = relations(healthVitals, ({ one }) => ({
  user: one(users, { fields: [healthVitals.userId], references: [users.id] }),
}));

export const communitySessionsRelations = relations(communitySessions, ({ many }) => ({
  registrations: many(sessionRegistrations),
}));

export const sessionRegistrationsRelations = relations(sessionRegistrations, ({ one }) => ({
  user: one(users, { fields: [sessionRegistrations.userId], references: [users.id] }),
  session: one(communitySessions, { fields: [sessionRegistrations.sessionId], references: [communitySessions.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  subscription: one(userSubscriptions, { fields: [payments.subscriptionId], references: [userSubscriptions.id] }),
}));

export const subscriptionAuditLogsRelations = relations(subscriptionAuditLogs, ({ one }) => ({
  subscription: one(userSubscriptions, { fields: [subscriptionAuditLogs.subscriptionId], references: [userSubscriptions.id] }),
  changedByUser: one(users, { fields: [subscriptionAuditLogs.changedByUserId], references: [users.id] }),
}));
