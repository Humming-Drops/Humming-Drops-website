-- RR-007: "Enforce clinical-role permissions for health-data access."
--
-- The legacy `user_role` enum has had a 'nutritionist' value since
-- 0000_baseline_schema, but 0002_rbac_and_cms never created a matching
-- `application_roles` row for it. Without that row, no one holding the
-- legacy 'nutritionist' enum value could ever be granted anything
-- through user_roles/role_permissions -- hasPermission() has no row to
-- find. The only role with health:read today is read_only_auditor,
-- which is backwards for a clinical permission. This adds the role and
-- grants it the intended permission.

INSERT INTO "application_roles" ("slug", "name", "description") VALUES
  ('nutritionist', 'Nutritionist', 'Clinical review of customer health vitals')
ON CONFLICT ("slug") DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT role.id, permission.id
FROM "application_roles" role
JOIN "application_permissions" permission
  ON permission.slug = 'health:read'
WHERE role.slug = 'nutritionist'
ON CONFLICT DO NOTHING;
