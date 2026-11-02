import crypto from "crypto";

export interface CreateOrderParams {
  amountPaise: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: "order";
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: "created" | "attempted" | "paid";
  notes: Record<string, string>;
  created_at: number;
}

export class RazorpayClient {
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;
  private baseUrl = "https://api.razorpay.com/v1";

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  }

  private getAuthHeader(): string {
    return `Basic ${Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64")}`;
  }

  /**
   * Create an order on Razorpay servers with circuit-breaker timeout
   */
  async createOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
    const isMockMode =
      process.env.MOCK_RAZORPAY === "true" ||
      process.env.NODE_ENV === "test" ||
      this.keyId === "rzp_test_placeholder_key" ||
      !this.keyId ||
      !this.keySecret;

    if (isMockMode) {
      // In development, test environments, or when placeholder keys are used, return simulated order
      return {
        id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        entity: "order",
        amount: params.amountPaise,
        amount_paid: 0,
        amount_due: params.amountPaise,
        currency: params.currency || "INR",
        receipt: params.receipt,
        status: "created",
        notes: params.notes || {},
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    const payload = {
      amount: params.amountPaise,
      currency: params.currency || "INR",
      receipt: params.receipt,
      notes: params.notes || {},
      payment_capture: 1, // Auto-capture payment upon successful authorization
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8-second circuit breaker

    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Razorpay order creation failed [${response.status}]: ${JSON.stringify(errorData)}`
        );
      }

      return (await response.json()) as RazorpayOrderResponse;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Constant-time timing-safe signature verification for client checkout (verify)
   * HMAC-SHA256(order_id + "|" + payment_id, secret)
   */
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || this.keySecret;
    if (!secret) {
      throw new Error("Cannot verify signature: RAZORPAY_KEY_SECRET is unconfigured.");
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const receivedBuf = Buffer.from(signature, "utf8");

    if (expectedBuf.length !== receivedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }

  /**
   * Constant-time timing-safe webhook signature verification over raw body
   * HMAC-SHA256(rawBody, webhookSecret)
   */
  verifyWebhookSignature(rawBody: string, signature: string, customSecret?: string): boolean {
    const secret = customSecret || process.env.RAZORPAY_WEBHOOK_SECRET || this.webhookSecret;
    if (!secret) {
      return false;
    }

    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    const expectedBuf = Buffer.from(expected, "utf8");
    const receivedBuf = Buffer.from(signature, "utf8");

    if (expectedBuf.length !== receivedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }
}

export const razorpayClient = new RazorpayClient();
