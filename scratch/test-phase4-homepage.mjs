import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();

console.log("=== Phase 4: Humming Drops Homepage Verification ===\n");

// 1. Check Section Components
const components = [
  "src/components/home/hero.tsx",
  "src/components/home/box-anatomy.tsx",
  "src/components/home/morning-journey.tsx",
  "src/components/home/why-humming-drops.tsx",
  "src/components/home/health-community-bridge.tsx",
  "src/components/home/pricing-section.tsx",
  "src/components/home/closing-cta.tsx",
];

for (const comp of components) {
  const compPath = path.join(cwd, comp);
  if (!fs.existsSync(compPath)) {
    console.error(`❌ Missing component: ${comp}`);
    process.exit(1);
  }
  const stat = fs.statSync(compPath);
  console.log(`✓ Verified component: ${comp} (${stat.size} bytes)`);
}

// 2. Check Authentic Images
const images = [
  "public/images/humming-drops-box.png",
  "public/images/humming-drops-fresh-produce.png",
];

for (const img of images) {
  const imgPath = path.join(cwd, img);
  if (!fs.existsSync(imgPath)) {
    console.error(`❌ Missing image: ${img}`);
    process.exit(1);
  }
  const stat = fs.statSync(imgPath);
  console.log(`✓ Verified image asset: ${img} (${stat.size} bytes)`);
}

// 3. Check Page Assembly & Journey Order in src/app/page.tsx
const pageContent = fs.readFileSync(path.join(cwd, "src/app/page.tsx"), "utf8");
const expectedSectionsInOrder = [
  "Hero",
  "BoxAnatomy",
  "MorningJourney",
  "WhyHummingDrops",
  "HealthCommunityBridge",
  "PricingSection",
  "ClosingCTA",
];

let lastIndex = -1;
for (const sec of expectedSectionsInOrder) {
  const idx = pageContent.indexOf(`<${sec}`);
  if (idx === -1) {
    console.error(`❌ Page does not mount section: ${sec}`);
    process.exit(1);
  }
  if (idx < lastIndex) {
    console.error(`❌ Section ${sec} mounted out of expected journey order`);
    process.exit(1);
  }
  lastIndex = idx;
}
console.log("✓ Page properly mounts all 7 sections in order: Discover → Explore → Understand → Connect → Trust → Subscribe → Action");

// 4. Content Safety & Brochure Fidelity Audit
const forbiddenPhrases = [
  "7:00 AM",
  "7 AM",
  "8:00 AM",
  "8 AM",
  "guaranteed delivery time",
  "chilled doorstep delivery",
  "chilled delivery",
  "Bangalore kitchen",
  "delivery across Bangalore",
  "cure diabetes",
  "cure hypertension",
  "treatment for heart disease",
  "clinical guarantee",
];

let safetyFailed = false;
for (const comp of components) {
  const content = fs.readFileSync(path.join(cwd, comp), "utf8");
  for (const phrase of forbiddenPhrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      console.error(`❌ Content safety violation in ${comp}: found "${phrase}"`);
      safetyFailed = true;
    }
  }
}

if (safetyFailed) {
  process.exit(1);
}
console.log("✓ Content safety verified: zero unconfirmed operational or clinical claims");

// 5. Check Pricing Fidelity
const pricingContent = fs.readFileSync(path.join(cwd, "src/components/home/pricing-section.tsx"), "utf8");
if (!pricingContent.includes("3,500") || !pricingContent.includes("4,000")) {
  console.error("❌ Pricing section missing canonical ₹3,500 or ₹4,000 prices");
  process.exit(1);
}
console.log("✓ Pricing fidelity confirmed: Standard ₹3,500 and Premium ₹4,000");

// 6. Check MedCity Lab Tests
const healthContent = fs.readFileSync(path.join(cwd, "src/components/home/health-community-bridge.tsx"), "utf8");
const requiredTests = ["Blood Sugar", "Cholesterol", "Blood Pressure"];
for (const test of requiredTests) {
  if (!healthContent.includes(test)) {
    console.error(`❌ Health bridge missing required lab test: ${test}`);
    process.exit(1);
  }
}
console.log("✓ Health & Community Bridge confirmed with MedCity test inclusions");

console.log("\n✓ All Phase 4 Homepage Verification Tests Passed Successfully!");
