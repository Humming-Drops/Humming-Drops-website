const fs = require("fs");

async function main() {
  const content = fs.readFileSync("docs/verification-suite-proposal.md", "utf8");
  const payload = {
    title: "Verification Suite Baseline & Test Coverage Proposal (HUM-16)",
    format: "markdown",
    body: content,
    baseRevisionId: null
  };

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}/documents/verification-report`;
  console.log("PUT URL:", url);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${process.env.PAPERCLIP_API_KEY}`,
      "X-Paperclip-Run-Id": process.env.PAPERCLIP_RUN_ID,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const bodyText = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", bodyText);
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
