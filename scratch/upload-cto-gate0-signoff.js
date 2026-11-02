const fs = require("fs");

async function main() {
  const content = fs.readFileSync("docs/gate-0-signoff.md", "utf8");
  const payload = {
    title: "CTO Multi-Agent Orchestration & Gate 0 Sign-Off",
    format: "markdown",
    body: content,
    baseRevisionId: null
  };

  const url = `${process.env.PAPERCLIP_API_URL}/api/issues/${process.env.PAPERCLIP_TASK_ID}/documents/gate_0_signoff`;
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
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}: ${bodyText}`);
  }
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
