import assert from "node:assert/strict";

async function run() {
  console.log("=== VERIFYING HIDDEN ADMIN & REDIRECT PRESERVATION ===\n");

  const baseUrl = "http://localhost:3000";

  const testCases = [
    {
      name: "Unauthenticated /admin redirects to /admin/login with redirect_url",
      path: "/admin",
      expectedStatus: 307,
      expectedLocationStartsWith: "/admin/login?redirect_url=%2Fadmin",
    },
    {
      name: "Unauthenticated /admin/leads preserves sub-page in redirect_url",
      path: "/admin/leads",
      expectedStatus: 307,
      expectedLocationStartsWith: "/admin/login?redirect_url=%2Fadmin%2Fleads",
    },
    {
      name: "Unauthenticated /admin/subscriptions?status=active preserves query params",
      path: "/admin/subscriptions?status=active",
      expectedStatus: 307,
      expectedLocationStartsWith: "/admin/login?redirect_url=%2Fadmin%2Fsubscriptions%3Fstatus%3Dactive",
    },
    {
      name: "Unauthenticated /dashboard redirects to /login with redirect_url",
      path: "/dashboard",
      expectedStatus: 307,
      expectedLocationStartsWith: "/login?redirect_url=%2Fdashboard",
    },
    {
      name: "Unauthenticated /dashboard/settings preserves sub-page in redirect_url",
      path: "/dashboard/settings",
      expectedStatus: 307,
      expectedLocationStartsWith: "/login?redirect_url=%2Fdashboard%2Fsettings",
    },
    {
      name: "Unauthenticated /subscribe?plan=premium preserves plan query param",
      path: "/subscribe?plan=premium",
      expectedStatus: 307,
      expectedLocationStartsWith: "/register?redirect_url=%2Fsubscribe%3Fplan%3Dpremium",
    },
    {
      name: "Admin login portal is accessible directly",
      path: "/admin/login",
      expectedStatus: 200,
    },
    {
      name: "Customer login page is accessible directly",
      path: "/login",
      expectedStatus: 200,
    },
    {
      name: "Customer register page is accessible directly",
      path: "/register",
      expectedStatus: 200,
    },
    {
      name: "System health check is active",
      path: "/api/health",
      expectedStatus: 200,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    try {
      const res = await fetch(baseUrl + tc.path, { redirect: "manual" });
      const location = res.headers.get("location") || "";

      if (res.status !== tc.expectedStatus) {
        console.error(`❌ FAIL: ${tc.name} - Expected HTTP ${tc.expectedStatus}, got ${res.status}`);
        failed++;
        continue;
      }

      if (tc.expectedLocationStartsWith && !location.startsWith(tc.expectedLocationStartsWith)) {
        console.error(`❌ FAIL: ${tc.name} - Expected location '${tc.expectedLocationStartsWith}', got '${location}'`);
        failed++;
        continue;
      }

      console.log(`✅ PASS: ${tc.name} [HTTP ${res.status}${location ? ` -> ${location}` : ""}]`);
      passed++;
    } catch (err) {
      console.error(`❌ ERROR: ${tc.name} - ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`TOTAL: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

run();
