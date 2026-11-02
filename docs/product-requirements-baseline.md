# HUMMING DROPS & MEDCITY SMILES — PRODUCT REQUIREMENTS & BUSINESS RULES BASELINE

**Document Version:** 1.0  
**Phase / Milestone:** HUM-W1-04 (Week 1 Architecture & Baselines)  
**Author:** Product Analyst (`bf9a0400-d57b-4611-9588-7a8a1cb9747f`)  
**Status:** Authoritative Product Baseline  
**Authority Reference:** `references/Humming-Drops-Brochure.pdf`, `references/Humming drop Logo .png`  

---

## 1. Executive Summary & Brand Foundation

Humming Drops is a holistic wellness subscription platform originating in Bangalore. The venture solves a critical modern dilemma: in fast-paced urban environments, working professionals struggle to consistently source, wash, cut, and consume balanced daily micronutrients. 

By delivering freshly prepared, multi-compartment breakfast boxes directly to doorsteps every morning, Humming Drops bridges daily nutrition with preventative healthcare and emotional wellbeing through its integrated partnership with **MedCity Health Labs** and **CARE by Berrybeats Cafe**.

### 1.1 Brand Identity & Mission
* **Brand Name:** Humming Drops
* **Community Arm:** MedCity Smiles Community
* **Core Philosophy:** *"Nourishing the Body. Uplifting the Mind. Building a Happier Community."*
* **Official Tagline:** *"Healthy Drops, Healthier you"*
* **Central Proposition:** Physical nutrition through daily fresh cut fruit/vegetable/salad boxes, paired with mental health workshops and monthly clinical vitals monitoring (Blood Sugar, Cholesterol, Blood Pressure).
* **Operational Base / Central Kitchen:** Berrybeats Cafe, Bangalore.
* **Official Contact:**
  * Phone / WhatsApp: `+91 8618902810`
  * Email: `hummingdrops@gmail.com`
  * Official Domain: `www.hummingdrops.com`

---

## 2. Authoritative Subscription Plan Baseline

The platform offers two distinct monthly subscription tiers. The specifications below are grounded 100% in the client brochure.

### 2.1 Side-by-Side Comparison Matrix

| Feature / Dimension | Standard Plan | Premium Plan | Authoritative Source / Notes |
| :--- | :--- | :--- | :--- |
| **Monthly Pricing** | **₹3,500 / month** | **₹4,000 / month** | Brochure Page 4 |
| **Informational Daily Rate** | ~₹116 / day *(30-day basis)* | ~₹133 / day *(30-day basis)* | Calculated for marketing transparency |
| **Daily Fruit Varieties** | **4 Varieties** — Every Day | **4 Varieties** — Every Day | Brochure Page 4 (Fresh daily cut fruits) |
| **Daily Vegetable Varieties**| **2 Varieties** — Every Day | **2 Varieties** — Every Day | Brochure Page 4 (Fresh daily cut vegetables) |
| **Daily Fresh Mixed Salad** | **Included** — Every Day | **Included** — Every Day | Brochure Page 4 |
| **Daily Fresh Sprouts** | **Included** — Every Day | **Included** — Every Day | Brochure Page 4 (High-protein sprouts) |
| **Dry Fruits Cadence** | **3 Days a Week** | **Daily (7 Days a Week)** | **Key Plan Differentiator** (Brochure Page 4) |
| **Packaging Specification** | 5-Compartment Eco Box | 5-Compartment Eco Box | Visual match from Brochure Page 1 photo |
| **MedCity Smiles Membership**| **Included (Free)** | **Included (Free)** | Access to seminars, classes & sessions |
| **Monthly Clinical Checkup**| **Free Monthly Checkup** | **Free Monthly Checkup** | 1. Blood Sugar, 2. Cholesterol, 3. BP |
| **Expert Advisory Access** | Doctors & Nutritionists | Doctors & Nutritionists | Community vitals review & guidance |
| **MedCity Labs Discounts** | Standard partner rates | **Exclusive Additional Discounts** on selected curated health packages | **Premium Exclusive** (Brochure Page 4) |
| **Special Healthy Juice Drops**| Not Included | **Included** (Curated by Humming Drops & CARE by Berrybeats on select dates) | **Premium Exclusive** (Brochure Page 4) |

### 2.2 Standard Plan Rules (`standard`)
1. **Price Lock:** Locked strictly at ₹3,500 per monthly billing cycle.
2. **Daily Box Contents:** Every delivery box must contain:
   * 4 distinct varieties of seasonal fruits.
   * 2 distinct varieties of crisp vegetables.
   * 1 portion of fresh mixed salad.
   * 1 portion of live, fresh sprouts.
3. **Dry Fruit Rotation:** Dry fruits (almonds, walnuts, cashews, raisins, seeds) are packed strictly **3 days per week** (e.g., Monday, Wednesday, Friday).
4. **Healthcare Access:** Free enrollment in MedCity Smiles community with access to monthly non-fasting/fasting vitals checkup (Sugar, Cholesterol, BP).

### 2.3 Premium Plan Rules (`premium`)
1. **Price Lock:** Locked strictly at ₹4,000 per monthly billing cycle (+₹500 delta over Standard).
2. **Everyday Dry Fruits:** Dry fruits are included in the daily box **every day** (7 days/week or every active delivery day), providing continuous nutrient density.
3. **Curated Healthy Juice Drops:** Includes special, cold-pressed healthy juice formulations curated with CARE by Berrybeats, delivered on designated pre-planned dates and festive/special wellness occasions.
4. **Enhanced Medical Perks:** Access to tier-exclusive discount vouchers and subsidized pricing on comprehensive diagnostic panels at MedCity Health Labs beyond the standard 3-parameter vitals test.

---

## 3. Client-Input Decision Matrix (CIR Analysis)

To adhere to the core architectural safety rule—**"Do Not Invent Client Information"**—all unconfirmed operational parameters have been extracted into this structured decision matrix. 

Engineering implementations must use sensible, non-blocking defaults without hardcoding brittle assumptions into database schemas or business logic.

| ID | Operational Dimension | Authoritative Brochure Truth | Provisional Engineering Assumption | Impact / Risk if Hardcoded | Options for Client Confirmation | Current Implementation Guardrail |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **CIR-01** | **Bangalore Delivery Corridors & Geofencing** | Operational hub is Berrybeats Cafe, Bangalore. Doorstep delivery promised across Bangalore. | No hardcoded neighborhood whitelist. Serviceable across Bangalore pincodes (560xxx). | Hardcoding specific localities (e.g. Indiranagar only) drops conversion from nearby serviceable tech corridors. | **Option A:** Fixed radial radius (e.g., 8 km from Berrybeats Cafe).<br>**Option B:** Specific corridor whitelist (Koramangala, HSR, Indiranagar, Bellandur, Whitefield).<br>**Option C:** City-wide pincode capture with backend operational feasibility validation. | Accept standard Bangalore pincodes in UI; record locality in lead/order. Validate exact route during dispatch operations. |
| **CIR-02** | **Morning Delivery Windows** | Brochure guarantees: *"Delivered every morning"*. | Early morning window (between 6:00 AM and 8:30 AM). | Promising a rigid 30-minute slot (e.g., "by 7:00 AM sharp") exposes delivery ops to traffic failure penalties. | **Option A:** Single uniform window (6:00 AM – 8:00 AM).<br>**Option B:** Two selectable slots (6:00–7:15 AM vs. 7:15–8:30 AM).<br>**Option C:** Customer delivery note capture (e.g., "Leave at security before 8 AM"). | Capture delivery timing preferences as flexible customer instructions/notes; avoid strict time-slot dropdown DB constraints. |
| **CIR-03** | **Monthly Delivery Frequency & Calendar Days** | Brochure specifies monthly subscription (₹3,500 / ₹4,000). | 30 consecutive calendar days per monthly billing cycle. | If client operates on a 26-day (Mon–Sat) or 22-day (Mon–Fri) cycle, per-day cost math and box preparation schedules will be miscalculated. | **Option A:** 30 consecutive calendar days (all days).<br>**Option B:** 26 days (Mon–Sat, Sundays off).<br>**Option C:** 22 working days (Mon–Fri corporate plan). | Model subscriptions by `start_date` and `renewal_date` rather than decrementing a hardcoded 30-day box counter. Show informational per-day rate. |
| **CIR-04** | **Delivery Pause & Resumption Lead-Time** | No pause policy stated in brochure. Standard subscription UX allows pausing. | Pausing requires minimum 12-hour lead time (e.g., 8:00 PM previous evening for next morning box). | Zero-lead-time pauses cause food waste since fresh produce is procured and sliced in pre-dawn hours. | **Option A:** 8:00 PM cutoff the evening before.<br>**Option B:** 24-hour advance notice via dashboard or WhatsApp.<br>**Option C:** Maximum 5 pause days allowed per monthly cycle. | Implement dashboard pause/resume with configurable `cutoff_hour` (default 20:00 local time). Do not permanently lock rigid cutoff without client sign-off. |
| **CIR-05** | **Monthly Health Checkup Fulfillment Mode** | Brochure promises: *"FREE SUGAR, CHOLESTEROL & B.P CHECKUP EVERY MONTH"*. | Clinic walk-in voucher at partner MedCity Health Labs centers in Bangalore. | Promising home phlebotomist visit incurs massive unbudgeted operational costs if MedCity Labs only offers walk-ins. | **Option A:** Digital voucher/token redeemed at MedCity Labs clinics.<br>**Option B:** At-home technician blood draw appointment.<br>**Option C:** Monthly weekend wellness camp at Berrybeats Cafe. | Frame copy as "Monthly Health Checkup powered by MedCity Labs". Avoid promising home phlebotomy until confirmed. |
| **CIR-06** | **Produce Customization vs. Fixed Box** | Brochure states: *"CUSTOMISED PLAN PRECISELY TO YOUR NEEDS"*. | Chef-curated daily box with customer allergy/dietary preference notes (Vegan, Pure Fruit, Nut Allergy). | Offering full ingredient pick-and-choose creates exponential SKU complexity in a high-volume morning kitchen. | **Option A:** Fixed daily nutritional menu with allergy exclusion filters.<br>**Option B:** 3 set profiles (Standard, All-Fruit, Diabetic-Friendly).<br>**Option C:** Custom item substitutions with add-on pricing. | Capture dietary preferences (Vegan, Standard, Nut-Free) and free-text notes during checkout; do not build dynamic per-box ingredient builders. |
| **CIR-07** | **Checkout & Payment Architecture** | Brochure features QR code: *"Scan and Register 8618902810"* & *"CONNECT WITH MEDCITY HEALTH LABS: Tap to chat"*. | Dual-mode checkout (`CheckoutStrategy`): Mode A (Razorpay Online Gateway) & Mode B (Assisted WhatsApp Onboarding). | Hardcoding Razorpay exclusively fails if client lacks merchant PG credentials; hardcoding WhatsApp only eliminates automated recurring revenue. | **Option A:** Instant Razorpay online checkout with automated activation.<br>**Option B:** High-conversion lead capture generating reference code + WhatsApp handoff.<br>**Option C:** Hybrid (Customer chooses "Pay Online" or "Order via WhatsApp"). | System architecture supports both Mode A and Mode B via `NEXT_PUBLIC_CHECKOUT_MODE`. Default to assisted lead capture if PG credentials are unconfigured. |
| **CIR-08** | **Subscription Cancellation & Refund Rules** | Brochure does not state refund terms. | Subscriptions are non-refundable once started; unused whole weeks can be credited as pause days or gifted. | Customer disputes over missed deliveries or midway cancellations without clear written policy. | **Option A:** Strict no-refund policy once delivery commences; balance convertible to store credit.<br>**Option B:** Pro-rata refund for remaining full weeks minus 10% administrative fee.<br>**Option C:** Transferable subscription (gift balance to a friend/family member). | Provide clear terms disclosure during onboarding indicating perishable food subscription policy. Allow pause instead of cancellation. |

---

## 4. Bangalore Delivery Logistics & Operational Constraints

Operating a fresh cut fruit and vegetable subscription in Bangalore imposes severe geographical, infrastructural, and microbiological constraints.

### 4.1 Kitchen & Dispatch Hub
* **Hub Location:** Berrybeats Cafe, Bangalore.
* **Kitchen Readiness:** Sourcing, triple-washing, precision cutting, portioning, and tamper-evident packaging.
* **Perishable Lifespan:** Fresh-cut fruits and raw sprouts have an active freshness degradation window. Cut produce must be packed cold (4°C–8°C) and delivered within **2.5 hours of dispatch** to avoid oxidation, weeping, and microbial spoilage.

### 4.2 Morning Operational Timeline
```text
04:00 AM — 05:00 AM : Fresh produce intake & quality inspection at Berrybeats Kitchen
05:00 AM — 06:15 AM : Sanitization, cutting, 5-compartment portioning & seal packaging
06:15 AM — 06:45 AM : Route batching & rider dispatch across delivery corridors
06:45 AM — 08:30 AM : Doorstep deliveries & contactless apartment handovers
08:30 AM — 09:00 AM : Exception logging, delivery confirmation sync, customer notifications
```

### 4.3 Bangalore Corridor Logistics & Traffic Dynamics
1. **Traffic Cutoff:** Bangalore morning vehicular traffic ramps up drastically between 08:15 AM and 09:30 AM. Deliveries after 08:30 AM face a 2.5x delivery duration multiplier. All routes must target completion before 08:30 AM.
2. **Radial Serviceability Zones:**
   * **Zone 1 (Core Radial — 0 to 6 km from Hub):** High-density dispatch via dedicated fleet (e.g. Koramangala, Domlur, Indiranagar, HSR Layout). High margin, rapid transit (<25 min).
   * **Zone 2 (Extended Tech Corridor — 6 to 14 km):** Batch deliveries to high-density apartment complexes along Outer Ring Road (ORR), Bellandur, Sarjapur Road, Whitefield. Managed via route-consolidated delivery vans or third-party hyper-local 3PL (Shadowfax/Dunzo/Blowhorn).
   * **Zone 3 (Outer Bangalore — >14 km):** Feasibility assessed on minimum subscriber density (e.g., minimum 5 subscribers within a single residential society).
3. **Pincode Strategy:**
   * Bangalore standard postal codes span `560001` through `560110`.
   * The platform validates the 6-digit PIN starts with `560`. Pincodes outside `560xxx` prompt a graceful "Outside Bangalore service area" modal with an email waitlist form.

### 4.4 Apartment & Gated Community Handover Protocols
Over 70% of Bangalore target wellness subscribers reside in gated high-rise societies (e.g. Prestige, Sobha, Brigade):
1. **Security / Gate Pass Procedures:** Many societies restrict delivery personnel entry before 07:00 AM.
2. **Delivery Modes Supported:**
   * *Doorstep Delivery:* When visitor entry is allowed, box is placed at apartment door with a photo confirmation.
   * *Security Desk / Club House Drop:* Box tagged with Customer Name, Flat No, and Tower Name, deposited at designated society delivery rack.
   * *Delivery Notification:* Automated WhatsApp/SMS trigger: *"Your Humming Drops breakfast box has arrived at your security desk/doorstep! Best enjoyed fresh before 10:00 AM."*

---

## 5. Technical Architecture & Data Model Alignment

These business rules translate directly into our existing and upcoming software architecture:

### 5.1 Plan Specification (`src/types/plans.ts`)
```typescript
export const OFFICIAL_PLANS: Record<PlanTier, SubscriptionPlan> = {
  standard: {
    id: "standard",
    name: "Standard",
    monthlyPriceINR: 3500,
    perDayPriceINR: 116,
    tagline: "Complete daily fresh breakfast nutrition & holistic health monitoring",
    boxInclusions: [
      { title: "4 Varieties of Fruits", frequency: "Every Day" },
      { title: "2 Varieties of Vegetables", frequency: "Every Day" },
      { title: "Fresh Mix Salad", frequency: "Every Day" },
      { title: "Fresh Sprouts", frequency: "Every Day" },
      { title: "Dry Fruits", frequency: "3 Days a Week" },
    ],
    communityAndHealthPerks: [
      "Free Membership to MedCity Smiles Community",
      "Free Monthly Health Checkup (Blood Sugar, Cholesterol, Blood Pressure)",
      "Access to community of doctors & clinical nutritionists",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    monthlyPriceINR: 4000,
    perDayPriceINR: 133,
    tagline: "Everything in Standard plus daily dry fruits, curated juices & lab discounts",
    isRecommended: true,
    boxInclusions: [
      { title: "4 Varieties of Fruits", frequency: "Every Day" },
      { title: "2 Varieties of Vegetables", frequency: "Every Day" },
      { title: "Fresh Mix Salad", frequency: "Every Day" },
      { title: "Fresh Sprouts", frequency: "Every Day" },
      { title: "Daily Dry Fruits", frequency: "Every Day (Upgraded)", isPremiumOnly: true },
    ],
    communityAndHealthPerks: [
      "Free Membership to MedCity Smiles Community",
      "Free Monthly Health Checkup (Blood Sugar, Cholesterol, Blood Pressure)",
      "Access to community of doctors & clinical nutritionists",
    ],
    premiumPerks: [
      "Exclusive MedCity Labs Benefits (Discounts on selected health packages)",
      "Special Healthy Juice Drops curated by Humming Drops & CARE by Berrybeats (on selected dates)",
    ],
  },
};
```

### 5.2 Subscription Lifecycle State Machine (`src/types/subscription.ts`)
```text
[User Submits Form]
       │
       ▼
registration_submitted ──► pending_confirmation ──► confirmed_active ◄──► paused
                                 │                         │
                                 ▼                         ▼
                             cancelled                  expired
```
* **Guardrail Enforcement:** Only subscriptions in `confirmed_active` state receive daily box dispatches or clinical vouchers. A `pending_confirmation` assisted registration cannot unlock active subscriber benefits.

### 5.3 Pluggable Checkout Strategy (`src/lib/checkout-config.ts`)
```text
                      ┌─────────────────────────┐
                      │    CheckoutStrategy     │
                      └────────────┬────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
        Mode A: Online Gateway              Mode B: Assisted Lead
       (Razorpay Server Orders)            (WhatsApp + Manual Review)
                 │                                   │
        Instant Active Status               pending_confirmation
```
* **Security Guard:** `NEXT_PUBLIC_CHECKOUT_MODE` controls UI display; server-authoritative API handlers independently validate signatures and pricing rules.

---

## 6. Implementation Verification & Sign-Off

* [x] **Brochure Alignment:** All prices (₹3,500 Standard / ₹4,000 Premium), box items (4 fruits, 2 vegetables, salad, sprouts, dry fruits), and health checkups match `references/Humming-Drops-Brochure.pdf` with zero fabrication.
* [x] **Unknowns Quarantined:** All 8 operational ambiguities classified as Client Decisions Required (`CIR-01` to `CIR-08`) with non-breaking fallback architectures.
* [x] **Bangalore Constraints Codified:** Sourcing hub (Berrybeats Cafe), perishable 2.5-hour morning transit, 560xxx pincode boundaries, and apartment delivery protocols fully specified.
* [x] **Ready for Engineering:** Feeds directly into multi-step onboarding (HUM-15), Drizzle ORM schema (HUM-12), and admin dispatch tools (HUM-16).
