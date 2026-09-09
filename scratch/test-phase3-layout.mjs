import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("=== 1. Checking Public Logo Assets ===");
const logos = [
  "public/images/humming-drops-logo.png",
  "public/images/medcity-smiles-logo.png",
  "public/images/berrybeats-logo.png",
];

for (const logo of logos) {
  const fullPath = path.join(process.cwd(), logo);
  assert(fs.existsSync(fullPath), `Missing required logo asset: ${logo}`);
  const stats = fs.statSync(fullPath);
  assert(stats.size > 1000, `Logo asset seems empty or invalid: ${logo}`);
  console.log(`✓ Logo asset verified: ${logo} (${stats.size} bytes)`);
}

console.log("\n=== 2. Checking Layout & Shell Architecture ===");
const appShellContent = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/app-shell.tsx"),
  "utf8"
);
assert(
  appShellContent.includes('href="#main-content"'),
  "AppShell must include skip-to-main-content link"
);
assert(
  appShellContent.includes('id="main-content"'),
  "AppShell must include <main id='main-content'> landmark"
);
assert(
  appShellContent.includes("<Navbar />"),
  "AppShell must render global Navbar"
);
console.log("✓ AppShell contains skip link, global Navbar, and main landmark");

const dashboardLayoutContent = fs.readFileSync(
  path.join(process.cwd(), "src/app/dashboard/layout.tsx"),
  "utf8"
);
assert(
  !dashboardLayoutContent.includes("<main"),
  "Dashboard layout must not render a nested <main> tag (accessibility violation)"
);
console.log("✓ Dashboard layout verified: zero nested <main> landmarks");

console.log("\n=== 3. Checking Navigation Link Validity ===");
const navigationContent = fs.readFileSync(
  path.join(process.cwd(), "src/types/navigation.ts"),
  "utf8"
);

// Check that all listed routes exist on filesystem
const routesToCheck = [
  "/plans",
  "/medcity-smiles",
  "/about",
  "/contact",
  "/subscribe",
  "/login",
  "/register",
  "/dashboard",
];

for (const route of routesToCheck) {
  const pagePath = path.join(process.cwd(), "src/app", route.replace(/^\//, ""), "page.tsx");
  assert(
    fs.existsSync(pagePath),
    `Navigation links to non-existent route: ${route} (expected ${pagePath})`
  );
  console.log(`✓ Validated route link target: ${route}`);
}

console.log("\n=== 4. Checking Navbar & Accessibility Primitives ===");
const navbarContent = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/navbar.tsx"),
  "utf8"
);
assert(
  navbarContent.includes('aria-label="Main Navigation"'),
  "Navbar must contain accessible landmark aria-label"
);
assert(
  navbarContent.includes('role="dialog"'),
  "Mobile drawer must have role='dialog'"
);
assert(
  navbarContent.includes('aria-modal="true"'),
  "Mobile drawer must have aria-modal='true'"
);
assert(
  navbarContent.includes('e.key === "Escape"'),
  "Mobile drawer must handle Escape key for keyboard accessibility"
);
console.log("✓ Navbar ARIA landmarks, mobile dialog, and Escape handler verified");

console.log("\n=== 5. Checking Error, Loading, and 404 Shell States ===");
assert(
  fs.existsSync(path.join(process.cwd(), "src/app/not-found.tsx")),
  "src/app/not-found.tsx must exist"
);
assert(
  fs.existsSync(path.join(process.cwd(), "src/app/loading.tsx")),
  "src/app/loading.tsx must exist"
);
assert(
  fs.existsSync(path.join(process.cwd(), "src/app/error.tsx")),
  "src/app/error.tsx must exist"
);
console.log("✓ Not-Found, Loading, and Error boundaries confirmed present");

console.log("\n=== 6. Content Safety Guardrail Verification ===");
const footerContent = fs.readFileSync(
  path.join(process.cwd(), "src/components/layout/footer.tsx"),
  "utf8"
);

// Prohibit unconfirmed citywide delivery claims
assert(
  !footerContent.includes("across Bangalore"),
  "Footer must NOT make unconfirmed citywide delivery claims ('across Bangalore')"
);
assert(
  !footerContent.includes("delivered daily in Bangalore"),
  "Footer must NOT claim 'delivered daily in Bangalore'"
);
assert(
  !navbarContent.includes("Bangalore Doorstep Delivery"),
  "Navbar must NOT make unconfirmed citywide delivery promises"
);

// Prohibit invented disclaimers or clinical guarantees
assert(
  !footerContent.includes("Disclaimer:"),
  "Footer must NOT contain unapproved invented medical/regulatory disclaimers"
);
assert(
  !footerContent.includes("certified clinical staff"),
  "Footer must NOT invent unconfirmed clinical staff certifications"
);

console.log("✓ Content safety verified: no unconfirmed operational claims or invented disclaimers");

console.log("\n✓ All Phase 3 Layout & Navigation Tests Passed Successfully!");
