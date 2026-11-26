import { describe, it, expect, afterEach, vi } from "vitest";
import { sendMail } from "@/lib/mailer";

const message = { to: "someone@example.invalid", subject: "Subject", text: "Body" };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("sendMail", () => {
  it("posts to the mail provider when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("MAIL_FROM", "from@example.invalid");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    await sendMail(message);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(init.body)).toEqual({ from: "from@example.invalid", to: [message.to], subject: "Subject", text: "Body" });
  });

  it("throws when the provider rejects the message", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("MAIL_FROM", "from@example.invalid");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 422 }));
    await expect(sendMail(message)).rejects.toThrow("422");
  });

  it("logs instead of sending outside production without a provider", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "development");
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await sendMail(message);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalled();
  });

  it("throws in production without a provider", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    await expect(sendMail(message)).rejects.toThrow("No mail provider");
  });
});
