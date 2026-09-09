import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ======================================================================
           Direct Brand Palettes (Preserved & Refined Foundation)
           ====================================================================== */
        forest: {
          50: "#f2f7f2",
          100: "#e2ede2",
          200: "#c7dcc7",
          300: "#a0c4a1",
          400: "#72a574",
          500: "#4f8752",
          600: "#3d6d3f",
          700: "#325734",
          800: "#1b5e20", // Rich Verdant Green
          900: "#144518", // Official Humming Drops Forest Green (Logo Lettering)
          950: "#0b260e",
        },
        leaf: {
          300: "#5ba213",
          400: "#417b08",
          500: "#2e7301", // Official Logo Leaf Accent
          600: "#255c01",
          700: "#1d4701",
        },
        teal: {
          50: "#f0f9f8",
          100: "#d7f0ed",
          200: "#b2e1dc",
          300: "#83cdc6",
          400: "#4fb2a9",
          500: "#33968e",
          600: "#209185", // Uplifting Sea Green
          700: "#156c63", // Official MedCity Smiles Mindful Teal
          800: "#194f4b",
          900: "#0d5049", // Deep Pine Teal (MedCity Smiles Logo Icon)
          950: "#082926",
        },
        cream: {
          50: "#fdfcf7", // Warm Morning Paper Canvas (Humming Drops)
          100: "#f7f5ea",
          200: "#eee9d3",
          300: "#dfd6b8",
        },
        mist: {
          50: "#f8faf9", // Serene Mist Canvas (MedCity Smiles)
          100: "#eef5f4",
          200: "#dbe7e5",
          300: "#c2d6d3",
        },
        citrus: {
          50: "#fef3eb",
          500: "#e86a17", // Sun Papaya / Carrot Accent
          700: "#9a3412",
        },
        berry: {
          50: "#fdf2f2",
          500: "#c53030", // Strawberry / Pomegranate Accent
          700: "#991b1b",
        },

        /* ======================================================================
           Semantic Color Tokens (Mapped to Active Theme CSS Variables)
           ====================================================================== */
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        "surface-raised": "var(--bg-surface-raised)",
        muted: "var(--bg-muted)",
        subtle: "var(--bg-subtle)",

        brand: {
          primary: "var(--primary-brand)",
          hover: "var(--primary-brand-hover)",
          subtle: "var(--primary-brand-subtle)",
          "subtle-hover": "var(--primary-brand-subtle-hover)",
          text: "var(--primary-brand-text)",
          contrast: "var(--primary-brand-contrast)",
          secondary: "var(--brand-secondary)",
          "secondary-hover": "var(--brand-secondary-hover)",
        },

        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },

        line: {
          subtle: "var(--border-subtle)",
          strong: "var(--border-strong)",
          interactive: "var(--border-interactive)",
        },

        accent: {
          citrus: "var(--accent-citrus)",
          "citrus-subtle": "var(--accent-citrus-subtle)",
          "citrus-text": "var(--accent-citrus-text)",
          berry: "var(--accent-berry)",
          "berry-subtle": "var(--accent-berry-subtle)",
          "berry-text": "var(--accent-berry-text)",
          sprout: "var(--accent-sprout)",
          "sprout-subtle": "var(--accent-sprout-subtle)",
          "sprout-text": "var(--accent-sprout-text)",
          dryfruit: "var(--accent-dryfruit)",
          "dryfruit-subtle": "var(--accent-dryfruit-subtle)",
          "dryfruit-text": "var(--accent-dryfruit-text)",
        },

        status: {
          success: "var(--status-success)",
          "success-bg": "var(--status-success-bg)",
          "success-border": "var(--status-success-border)",
          "success-text": "var(--status-success-text)",
          warning: "var(--status-warning)",
          "warning-bg": "var(--status-warning-bg)",
          "warning-border": "var(--status-warning-border)",
          "warning-text": "var(--status-warning-text)",
          error: "var(--status-error)",
          "error-bg": "var(--status-error-bg)",
          "error-border": "var(--status-error-border)",
          "error-text": "var(--status-error-text)",
          info: "var(--status-info)",
          "info-bg": "var(--status-info-bg)",
          "info-border": "var(--status-info-border)",
          "info-text": "var(--status-info-text)",
        },
      },

      /* ======================================================================
         Typography Hierarchy & Fonts
         ====================================================================== */
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: [
          "clamp(2.25rem, 5vw, 3.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "800" },
        ],
        "section-h1": [
          "clamp(1.75rem, 4vw, 2.5rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "section-h2": [
          "clamp(1.375rem, 3vw, 1.75rem)",
          { lineHeight: "1.25", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        "card-h3": [
          "1.25rem",
          { lineHeight: "1.35", letterSpacing: "0", fontWeight: "600" },
        ],
        "price-hero": [
          "clamp(2.25rem, 4vw, 2.75rem)",
          { lineHeight: "1.0", letterSpacing: "-0.03em", fontWeight: "800" },
        ],
        "body-lg": [
          "1.125rem",
          { lineHeight: "1.6", letterSpacing: "0" },
        ],
        "body-base": [
          "1rem",
          { lineHeight: "1.6", letterSpacing: "0" },
        ],
        "body-sm": [
          "0.875rem",
          { lineHeight: "1.5", letterSpacing: "0" },
        ],
        caption: [
          "0.75rem",
          { lineHeight: "1.4", letterSpacing: "0.01em" },
        ],
        cta: [
          "0.9375rem",
          { lineHeight: "1.0", letterSpacing: "0.01em", fontWeight: "600" },
        ],
      },

      /* ======================================================================
         Spacing Scale & Section Padding
         ====================================================================== */
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        28: "7rem",
        "section-compact": "3rem",
        "section-standard": "5rem",
        "section-generous": "7rem",
      },

      /* ======================================================================
         Border Radii Scale
         ====================================================================== */
      borderRadius: {
        sm: "0.25rem",   // 4px
        md: "0.5rem",    // 8px
        lg: "0.75rem",   // 12px
        xl: "1rem",      // 16px
        "2xl": "1.25rem",// 20px
        "3xl": "1.5rem", // 24px
        "4xl": "2rem",   // 32px
        pill: "9999px",
      },

      /* ======================================================================
         Elevation & Multi-Stop Shadows
         ====================================================================== */
      boxShadow: {
        card: "var(--shadow-card)",
        raised: "var(--shadow-raised)",
        floating: "var(--shadow-floating)",
        botanical: "0 4px 20px -2px rgba(20, 69, 24, 0.06)",
        "botanical-lg": "0 12px 32px -4px rgba(20, 69, 24, 0.10)",
        mindful: "0 4px 20px -2px rgba(21, 108, 99, 0.06)",
        "mindful-lg": "0 12px 32px -4px rgba(21, 108, 99, 0.10)",
      },

      /* ======================================================================
         Standardized Motion Durations & Organic Easing Curves
         ====================================================================== */
      transitionDuration: {
        instant: "100ms",
        fast: "150ms",
        normal: "250ms",
        deliberate: "400ms",
        slow: "600ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      /* ======================================================================
         Layout & Ergonomic Max-Widths
         ====================================================================== */
      maxWidth: {
        reading: "680px",
        "form-flow": "600px",
      },
    },
  },
  plugins: [],
};

export default config;
