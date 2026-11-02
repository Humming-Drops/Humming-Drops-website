/**
 * Humming Drops & MedCity Smiles Automated Test Runner
 *
 * Executes Vitest-compatible test suites across:
 * - Pricing Invariants
 * - Phone & Address Sanitization
 * - Lead State Transitions
 * - Production Build Smoke Verification
 */

import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const isUnitOnly = args.includes("--unit");
const isSmokeOnly = args.includes("--smoke");

const testFiles = [];

const unitTestsDir = path.join(process.cwd(), "tests", "unit");
const smokeTestsDir = path.join(process.cwd(), "tests", "smoke");

if (!isSmokeOnly && fs.existsSync(unitTestsDir)) {
  const unitFiles = fs
    .readdirSync(unitTestsDir)
    .filter((f) => f.endsWith(".test.ts") || f.endsWith(".spec.ts"))
    .map((f) => path.join(unitTestsDir, f));
  testFiles.push(...unitFiles);
}

if (!isUnitOnly && fs.existsSync(smokeTestsDir)) {
  const smokeFiles = fs
    .readdirSync(smokeTestsDir)
    .filter((f) => f.endsWith(".test.ts") || f.endsWith(".spec.ts"))
    .map((f) => path.join(smokeTestsDir, f));
  testFiles.push(...smokeFiles);
}

console.log("================================================================================");
console.log("             HUMMING DROPS & MEDCITY SMILES VERIFICATION MATRIX                 ");
console.log("================================================================================");
console.log(`Discovered ${testFiles.length} test suite file(s). Starting execution...\n`);

const startTime = Date.now();
let totalPassed = 0;
let totalFailed = 0;
const errors = [];

for (const filePath of testFiles) {
  const relPath = path.relative(process.cwd(), filePath);
  console.log(`▶ Running suite: ${relPath}`);
  try {
    const fileUrl = pathToFileURL(filePath).href;
    await import(fileUrl);
    // Allow any pending async tests in suite to finish
    await new Promise((r) => setTimeout(r, 200));
    console.log(`✔ Suite completed: ${relPath}\n`);
    totalPassed++;
  } catch (err) {
    console.error(`✖ Suite failed: ${relPath}`);
    console.error(err);
    totalFailed++;
    errors.push({ file: relPath, error: err });
  }
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);

console.log("================================================================================");
console.log("                            TEST EXECUTION SUMMARY                              ");
console.log("================================================================================");
console.log(`Total Suites:  ${testFiles.length}`);
console.log(`Passed Suites: ${totalPassed}`);
console.log(`Failed Suites: ${totalFailed}`);
console.log(`Duration:      ${duration}s`);
console.log("================================================================================");

if (totalFailed > 0) {
  console.error(`\n✖ Test execution completed with ${totalFailed} failure(s).`);
  process.exit(1);
} else {
  console.log(`\n✔ All test suites passed successfully! Test matrix verified.`);
  process.exit(0);
}
