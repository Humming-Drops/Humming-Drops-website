import { createSessionToken } from "../src/lib/auth/session.ts";

async function run() {
  console.log("=== TESTING CONTENT MANAGEMENT SYSTEM (CMS) LIVE ===\n");
  const baseUrl = "http://localhost:3000";

  // 1. Test public route for non-existent or unpublished content
  console.log("1. Testing Public CMS Slug Handler (/content/sample-update)...");
  const publicRes = await fetch(baseUrl + "/content/sample-update", { redirect: "manual" });
  console.log(`   Public non-existent /content/sample-update response: HTTP ${publicRes.status} (Expected 404)`);

  // 2. Test unauthenticated access to /admin/content (must redirect to /admin/login)
  console.log("2. Testing Unauthenticated Access Guard on /admin/content...");
  const adminRes = await fetch(baseUrl + "/admin/content", { redirect: "manual" });
  const redirectLoc = adminRes.headers.get("location") || "";
  console.log(`   Unauthenticated /admin/content: HTTP ${adminRes.status} -> ${redirectLoc}`);

  // 3. Test Staff Session Access to CMS Templates API
  console.log("3. Testing Staff Session Access to /api/admin/content/templates...");
  const staffToken = await createSessionToken({
    userId: "00000000-0000-0000-0000-000000000001",
    email: "admin@hummingdrops.dev",
    role: "super_admin",
    fullName: "Super Admin",
  });

  const templatesRes = await fetch(baseUrl + "/api/admin/content/templates", {
    headers: {
      Cookie: `hd_session=${staffToken}`,
    },
  });

  const text = await templatesRes.text();
  console.log(`   /api/admin/content/templates response: HTTP ${templatesRes.status}`);
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error(`   Failed to parse response JSON. Raw text: "${text}"`);
    process.exit(1);
  }
  console.log(`   Found ${data.templates?.length || 0} active CMS templates:`);
  for (const t of (data.templates || [])) {
    console.log(`   - Template: "${t.name}" [slug: ${t.slug}] (${t.schema?.fields?.length || 0} fields)`);
  }

  if (templatesRes.status === 200 && (data.templates?.length || 0) >= 2) {
    console.log("\n✅ CMS TEMPLATES API IS FULLY FUNCTIONAL AND OPERATIONAL!");
  } else {
    console.error("\n❌ CMS TEMPLATES FAILED TO RETURN EXPECTED DATA.");
    process.exit(1);
  }
}

run();
