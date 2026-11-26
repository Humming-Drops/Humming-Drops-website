-- Data only. 1) Staff granted a role before this fix still have users.role = 'customer'.
UPDATE "users" u SET "role" = (
  SELECT r."slug"::user_role FROM "user_roles" ur JOIN "application_roles" r ON r."id" = ur."role_id"
  WHERE ur."user_id" = u."id" AND r."slug" <> 'customer'
  ORDER BY array_position(ARRAY['super_admin','business_admin','operations_manager','finance_manager','content_manager','nutritionist','read_only_auditor'], r."slug"::text) LIMIT 1
), "updated_at" = now()
WHERE u."role" = 'customer' AND EXISTS (
  SELECT 1 FROM "user_roles" ur JOIN "application_roles" r ON r."id" = ur."role_id"
  WHERE ur."user_id" = u."id" AND r."slug" <> 'customer'
);
--> statement-breakpoint
-- 2) Replace invented seed claims in plan rows with brochure wording.
UPDATE "subscription_plans" SET "tagline" = 'Fresh fruits, vegetables, salad and sprouts every day, with holistic health monitoring', "features" = '["4 Varieties of Fruits - Every Day","2 Varieties of Vegetables - Every Day","Fresh Mix Salad - Every Day","Fresh Sprouts - Every Day","Dry Fruits - 3 Days a Week","Free Membership to MedCity Smiles Community","Free Monthly Health Checkup (Blood Sugar, Cholesterol, Blood Pressure)"]'::jsonb WHERE "id" = 'standard';
--> statement-breakpoint
UPDATE "subscription_plans" SET "tagline" = 'Everything in Standard plus curated juices & MedCity Labs discounts', "features" = '["Everything in Standard","Dry Fruits - Every Day","Exclusive MedCity Labs Benefits (Discounts on selected health packages)","Special Healthy Juice Drops curated by Humming Drops & CARE by Berrybeats (on selected dates)"]'::jsonb WHERE "id" = 'premium';
