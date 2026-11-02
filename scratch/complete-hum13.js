const fs = require("fs");

async function main() {
  const comment = `### HUM-13: UI/UX & Brand Hierarchy Architecture Completed

1. **Dual Brand Identity Audit:**
   - Formalized brand tokens, roles, and visual distinctions between Humming Drops (Physical Nutrition / Breakfast Box delivery) and MedCity Smiles (Mind & Community Wellness, in collaboration with MedCity Health Labs & Berrybeats Cafe).
   - Documented in authoritative specification: \`docs/specifications/uiux-brand-hierarchy-architecture.md\`.

2. **MedCity Smiles Placement Above Pillars:**
   - Re-architected homepage bridge (\`src/components/home/health-community-bridge.tsx\`) so the MedCity Smiles Community Showcase and Free Health Vitals Checkups (Blood Sugar 🩸, Cholesterol 🫀, Blood Pressure 🩺) sit **above** the 4 holistic pillars.
   - Updated \`src/app/medcity-smiles/page.tsx\` so clinical vitals monitoring similarly sits above the holistic pillars.

3. **Pillar Replacement Roadmap (Pillars 3 & 4):**
   - Centralized holistic health pillars in \`src/types/pillars.ts\` with explicit status flags:
     * Pillars 1 & 2 ("Fuel Your Brain", "Protect Your Vitals") marked \`authoritative\` (tied directly to core deliverables).
     * Pillars 3 & 4 ("Cultivate Positive Self-Talk", "Happy-Healthy Coping") marked \`provisional_client_copy_pending\`.
   - Per client safety rules, brochure fidelity is maintained now, and replacement will occur strictly upon client copy receipt via a single point of update in \`src/types/pillars.ts\` with zero layout risk.

4. **Compact Footer Architecture:**
   - Redesigned \`src/components/layout/footer.tsx\` to reduce vertical whitespace by >35% (\`py-6 sm:py-7\`).
   - Integrated click-to-call phone and mailto links into the brand summary column, eliminating the stacked multi-row contact ribbon.
   - Consolidated copyright and Berrybeats Cafe Bangalore location into a sleek 1-line flex bottom bar.

5. **Complete Purge of Informal Daily Rates:**
   - Completely purged unconfirmed daily rates (\`~₹116/day\`, \`~₹133/day\`, \`perDayPriceINR\`) across:
     * \`src/types/plans.ts\`
     * \`src/components/home/pricing-section.tsx\`
     * \`src/app/plans/page.tsx\`
     * \`src/app/subscribe/page.tsx\`
     * \`docs/tracker.md\`, \`docs/plan.md\`, \`docs/uiux-design.md\`, \`docs/reference.md\`
   - Restored strict brochure fidelity to authoritative monthly pricing: Standard (₹3,500/mo) and Premium (₹4,000/mo).

6. **Quality & Verification:**
   - Strict TypeScript compiler check (\`npx tsc --noEmit\`): **0 errors** (Passed).
   - Responsive layout verified across mobile, tablet, and desktop breakpoints.`;

  const payload = {
    status: "done",
    comment: comment
  };

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}`;
  console.log("PATCH URL:", url);

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  console.log("HTTP status:", res.status);
  console.log("Updated status:", body.status);
  console.log("Issue id:", body.id);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
