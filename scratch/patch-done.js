async function main() {
  const commentText = [
    "Compiled authoritative product baseline and business rules inventory grounded 100% in the client brochure:",
    "",
    "- **Standard (₹3,500/mo) vs Premium (₹4,000/mo) Plan Rules**: Fully documented 5-compartment box contents (4 fruits, 2 vegetables, mix salad, sprouts daily; 3 days/week dry fruits for Standard vs daily dry fruits for Premium), MedCity Smiles membership, free monthly vitals checkups (Blood Sugar, Cholesterol, Blood Pressure), and Premium-exclusive perks (MedCity Labs package discounts & special healthy juice drops by CARE by Berrybeats).",
    "- **Client-Input Decision Matrix (CIR-01 to CIR-08)**: Documented knowns, provisional assumptions, architectural guardrails, and options for client confirmation across delivery corridors, delivery timing, monthly calendar cycles, pause lead times, health checkup fulfillment, produce customization, and checkout modes.",
    "- **Bangalore Delivery Logistics Constraints**: Codified central kitchen hub at Berrybeats Cafe, 2.5-hour morning perishable transit window, peak morning traffic mitigation (dispatch completed before 08:30 AM), 560xxx pincode serviceability, and high-rise apartment security gate handover protocols.",
    "",
    "Authoritative task document published: [Product Requirements & Business Rules Baseline](/HUM/issues/HUM-14#document-product_requirements_baseline) and saved to `docs/product-requirements-baseline.md`."
  ].join("\n");

  const payload = {
    status: "done",
    comment: commentText
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

  const bodyText = await res.text();
  console.log("HTTP status:", res.status);
  console.log("Response:", bodyText);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
