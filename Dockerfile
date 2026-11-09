# ==============================================================================
# Humming Drops & MedCity Smiles - Production Multi-Stage Dockerfile
# Optimized for Next.js 15 App Router on Railway PaaS
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base Image with Alpine & glibc compatibility
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ------------------------------------------------------------------------------
# Stage 2: Dependencies Installation
# ------------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install clean production and development dependencies for build step
RUN npm ci

# ------------------------------------------------------------------------------
# Stage 3: Application Builder
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Bring installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js anonymous telemetry collection
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_* values must be present at build time -- Next.js inlines
# them into the client bundle and the root layout's ClerkProvider
# needs the publishable key to render static pages during the build.
# These are never secrets, so baking them into image layers is safe.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_CHECKOUT_MODE
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_CHECKOUT_MODE=$NEXT_PUBLIC_CHECKOUT_MODE
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Build Next.js application with standalone output mode
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner (Ultra-lean, unprivileged non-root execution)
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create dedicated non-root system group and user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and public directory
COPY --from=builder /app/public ./public

# Prepare .next directory with correct ownership
RUN mkdir .next && chown nextjs:nodejs .next

# Local-disk storage fallback (src/lib/storage.ts, dev/test only when
# Cloudinary isn't configured) writes under cwd (/app) at runtime --
# needs to be writable by the non-root user, same as .next above.
RUN mkdir .local-storage && chown nextjs:nodejs .local-storage

# Leverage Next.js standalone output to drastically reduce image size (<120MB)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Drop root privileges
USER nextjs

# Expose standard container port
EXPOSE 3000

# Start Next.js standalone Node server
CMD ["node", "server.js"]
