# Runbook RB-03: Bangalore Hub Lead Operations & Manual Confirmation

**Document:** `docs/runbooks/lead-operations-handover.md`  
**Target Audience:** Bangalore Hub Coordinators, Customer Operations, Berrybeats Cafe Team  
**Primary Contact Helpline:** `8618902810`  
**Official Email:** `hummingdrops@gmail.com`  

---

## 1. Operational Overview

In Mode B (Assisted Lead Registration / WhatsApp Handoff), prospective customers register their subscription interest on the website (`/subscribe`). The platform assigns a unique reference code (`HD-REG-YYYY-XXXXX`), records the delivery address and dietary preferences in `pending_confirmation` state, and generates a pre-formatted WhatsApp chat link to the official Bangalore coordinator (`+91 8618902810`).

This runbook instructs hub operators on the daily SOP for triaging, contacting, verifying, and activating subscriptions.

---

## 2. Customer Ingestion Workflow

```
┌─────────────────────────────────┐
│ Customer submits form on web    │
│ Route: /subscribe               │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Server generates Reference ID:  │
│ e.g. HD-REG-2026-A1B2C          │
│ Status: pending_confirmation    │
│ Record stored in data/leads.json│
└────────────────┬────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│ WhatsApp message initiated to 8618902810:              │
│ "Hello Humming Drops Team! I would like to confirm my  │
│ subscription for Standard Plan (Ref: HD-REG-...)       │
└────────────────┬───────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Coordinator receives message    │
│ at Berrybeats Cafe Hub          │
└─────────────────────────────────┘
```

---

## 3. Daily Hub Coordinator Standard Operating Procedure (SOP)

### Step 1: Lead Identification & Verification
1. Open the incoming WhatsApp message on the official hub phone (`8618902810`).
2. Note the customer's reference code (format: `HD-REG-YYYY-XXXXX`).
3. Query the lead record via the API or hub console:
   ```bash
   curl -s "http://localhost:3000/api/subscriptions/lead?ref=HD-REG-2026-A1B2C"
   ```
4. Verify the customer record details:
   * **Customer Full Name:** Confirm spelling.
   * **Selected Plan:** Standard (₹3,500/mo) or Premium (₹4,000/mo).
   * **Bangalore Delivery Address:** Flat/House number, Street, Locality, Pincode.
   * **Dietary Preferences / Allergies:** Note any specific allergies (nuts, citrus, etc.).

### Step 2: Customer Contact & Delivery Confirmation
1. Send an official welcome message from `8618902810`:
   > *"Namaste [Customer Name]! Warm greetings from Humming Drops & Berrybeats Cafe, Bangalore. We have received your subscription request [HD-REG-YYYY-XXXXX] for the [Standard / Premium] Breakfast Box."*
2. Confirm the delivery address and preferred start date (next day morning delivery).
3. If dietary restrictions were noted, confirm with the kitchen team at Berrybeats Cafe.

### Step 3: Payment Collection & Status Transition
1. Share the official UPI / QR code or bank transfer details for Humming Drops.
2. Verify payment receipt:
   * Standard Plan: Exactly `₹3,500`.
   * Premium Plan: Exactly `₹4,000`.
3. Once payment is received, mark the lead as `confirmed` / `active` in the backend dashboard.
4. Issue an official welcome email from `hummingdrops@gmail.com` confirming:
   * Box schedule (Monday to Sunday fresh breakfast delivery).
   * MedCity Smiles membership activation.
   * Free monthly health checkup voucher details (Blood Sugar, Cholesterol, BP).

---

## 4. Kitchen Notification & Dispatch Checklist

Every evening before **8:00 PM**:
* [ ] Consolidate tomorrow's dispatch manifest at Berrybeats Cafe kitchen.
* [ ] Verify produce stock:
  * 4 varieties of fresh seasonal fruits.
  * 2 varieties of crisp vegetables.
  * Fresh salad mix and freshly sprouted legumes.
  * Dry fruit portions (almonds, walnuts, raisins — standard vs premium).
  * Special Healthy Juice Drops (for Premium subscribers on scheduled dates).
* [ ] Route delivery drops by Bangalore neighborhood corridors.
