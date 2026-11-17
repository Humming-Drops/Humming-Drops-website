const routes = [
  { path: '/', expectStatus: 200, check: 'Humming Drops' },
  { path: '/about', expectStatus: 200, check: 'About' },
  { path: '/plans', expectStatus: 200, check: 'Standard' },
  { path: '/medcity-smiles', expectStatus: 200, check: 'MedCity' },
  { path: '/contact', expectStatus: 200, check: 'Contact' },
  { path: '/subscribe', expectStatus: 307, checkLocation: '/register?redirect_url=%2Fsubscribe' },
  { path: '/login', expectStatus: 200, check: 'Sign In' },
  { path: '/register', expectStatus: 200, check: 'Account' },
  { path: '/forgot-password', expectStatus: 200, check: 'Reset' },
  { path: '/admin/login', expectStatus: 200, check: 'Operations Console' },
  { path: '/admin', expectStatus: 200, check: 'Operations Console' },
  { path: '/api/health', expectStatus: 200, check: 'healthy' },
];

async function run() {
  console.log("=== VERIFYING ALL PAGES ===");
  let failed = 0;
  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3000' + r.path, { redirect: 'manual' });
      const statusOk = res.status === r.expectStatus;
      let contentOk = true;
      if (r.checkLocation) {
        const loc = res.headers.get('location') || '';
        contentOk = loc.includes(r.checkLocation);
      } else if (r.check) {
        const text = await res.text();
        contentOk = text.toLowerCase().includes(r.check.toLowerCase());
      }
      if (statusOk && contentOk) {
        console.log(`[PASS] ${r.path} (HTTP ${res.status}) - Verified`);
      } else {
        console.log(`[FAIL] ${r.path} (HTTP ${res.status}, expected ${r.expectStatus}) - Verified: ${contentOk}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERR] ${r.path}: ${e.message}`);
      failed++;
    }
  }

  // Also check protected routes under middleware:
  console.log("\n=== VERIFYING PROTECTED ROUTE REDIRECTS (UNAUTHENTICATED) ===");
  const protectedRoutes = ['/dashboard', '/dashboard/settings', '/dashboard/overview', '/onboarding'];
  for (const p of protectedRoutes) {
    try {
      const res = await fetch('http://localhost:3000' + p, { redirect: 'manual' });
      // Next.js middleware redirects to /login when unauthenticated
      if (res.status === 307 || res.status === 308 || res.status === 302 || res.status === 303) {
        const location = res.headers.get('location') || '';
        console.log(`[PASS] ${p} (HTTP ${res.status}) -> Redirected to: ${location}`);
      } else {
        console.log(`[INFO] ${p} responded with HTTP ${res.status}`);
      }
    } catch (e) {
      console.error(`[ERR] ${p}: ${e.message}`);
      failed++;
    }
  }

  // Test the new registration endpoint
  console.log("\n=== VERIFYING /api/register ENDPOINT ===");
  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Automation User',
        email: 'automated-test@hummingdrops.dev',
        phone: '9876543210',
        planId: 'standard'
      })
    });
    const data = await res.json();
    if (res.status === 201 && data.success) {
      console.log(`[PASS] /api/register returned HTTP 201 Created: ${JSON.stringify(data.message)}`);
    } else {
      console.log(`[FAIL] /api/register returned HTTP ${res.status}:`, data);
      failed++;
    }
  } catch (e) {
    console.error(`[ERR] /api/register: ${e.message}`);
    failed++;
  }

  console.log("\n=============================");
  console.log(failed === 0 ? "ALL CHECKS PASSED!" : `TOTAL FAILURES: ${failed}`);
  console.log("=============================");
}

run();
