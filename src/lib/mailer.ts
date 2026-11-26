/**
 * Minimal transactional mailer.
 * - With RESEND_API_KEY + MAIL_FROM set: sends through the Resend HTTP API.
 * - Otherwise, outside production: logs the message to the server console
 *   (dev convenience so flows can be tested without an email provider).
 * - Otherwise (production, no provider): throws, so misconfiguration is visible.
 */
export async function sendMail(opts: { to: string; subject: string; text: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (apiKey && from) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, text: opts.text }),
    });
    if (!res.ok) throw new Error(`Mail provider responded ${res.status}`);
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log(`[MAIL:dev] To: ${opts.to}\n[MAIL:dev] Subject: ${opts.subject}\n${opts.text}`);
    return;
  }
  throw new Error("No mail provider configured (RESEND_API_KEY / MAIL_FROM).");
}
