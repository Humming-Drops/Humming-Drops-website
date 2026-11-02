# Runbook RB-01: Local Development & Environment Setup

**Document:** `docs/runbooks/local-development.md`  
**Target Audience:** Frontend, Full-Stack, and DevOps Engineers  
**Prerequisites:** Node.js 18.18+ or 20+, npm 9+, Git  

---

## 1. System Requirements & Prerequisites

* **Node.js:** `v18.18.0` or higher (Node 20 LTS recommended).
* **Package Manager:** `npm` (comes bundled with Node) or `pnpm`.
* **Operating System:** macOS, Linux, or Windows (PowerShell / WSL2).
* **Editor:** VS Code or Cursor with Tailwind CSS and ESLint extensions enabled.

---

## 2. Repository Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Humming-Drops/Humming-Drops-website.git
   cd Humming-Drops-website
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   > [!NOTE]
   > Ensure all dependencies install cleanly without `--force` or `--legacy-peer-deps`.

3. **Verify Git Branch:**
   ```bash
   git status
   git branch
   ```
   Work should be branched off `main` for feature tickets.

---

## 3. Environment Variable Configuration

Copy the example environment configuration:
```bash
cp .env.example .env.local
```

### Key Environment Variables

```bash
# -----------------------------------------------------------------------------
# APPLICATION & BRAND CONFIGURATION
# -----------------------------------------------------------------------------
NEXT_PUBLIC_APP_NAME="Humming Drops & MedCity Smiles"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# -----------------------------------------------------------------------------
# CHECKOUT & PAYMENT CONFIGURATION (PLUGGABLE STRATEGY)
# -----------------------------------------------------------------------------
# Server-authoritative checkout mode: "assisted_lead" (Mode B) | "online_gateway" (Mode A)
CHECKOUT_MODE=assisted_lead

# Client-safe presentation mode hint (DO NOT trust for security-sensitive logic)
NEXT_PUBLIC_CHECKOUT_MODE=assisted_lead

# Official coordinator contact details (Client Brochure Page 8)
NEXT_PUBLIC_COORDINATOR_PHONE="8618902810"
NEXT_PUBLIC_COORDINATOR_WHATSAPP="918618902810"
NEXT_PUBLIC_COORDINATOR_EMAIL="hummingdrops@gmail.com"

# -----------------------------------------------------------------------------
# RAZORPAY CONFIGURATION (REQUIRED ONLY FOR MODE A: online_gateway)
# -----------------------------------------------------------------------------
# RAZORPAY_KEY_ID="rzp_test_..."
# RAZORPAY_KEY_SECRET="..."
# RAZORPAY_WEBHOOK_SECRET="..."
# NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
```

---

## 4. Running the Development Server

Start the local Next.js development server:
```bash
npm run dev
```

The application will be accessible at:
* **Humming Drops (Physical Wellbeing):** [http://localhost:3000](http://localhost:3000)
* **MedCity Smiles (Mental Wellbeing):** [http://localhost:3000/medcity-smiles](http://localhost:3000/medcity-smiles)
* **Subscription Onboarding:** [http://localhost:3000/subscribe](http://localhost:3000/subscribe)
* **Plans Comparison:** [http://localhost:3000/plans](http://localhost:3000/plans)
* **Subscriber Dashboard Shell:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 5. Daily Development Guidelines

1. **Design Tokens & Theme Styling:**
   * Never hardcode arbitrary hex colors for core brand surfaces. Use semantic classes:
     * `bg-canvas`, `bg-surface`, `text-primary`, `text-secondary`, `border-subtle`.
     * `text-forest-900`, `bg-leaf-500` for Humming Drops accents.
     * `text-teal-900`, `bg-mint-100` for MedCity Smiles accents.
2. **Component Conventions:**
   * Place generic UI primitives in `src/components/ui/`.
   * Place feature-specific components in `src/components/home/`, `src/components/layout/`, etc.
   * Maintain strict separation between Server Components (default) and Client Components (`"use client"`).
3. **Type Safety:**
   * Import all shared domain interfaces from `src/types/`.
   * Never use `any` type annotations; strict TypeScript is enforced in CI.
