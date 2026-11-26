// Vercel runs the "vercel-build" script instead of "build". Production deploys
// apply pending migrations first, using the DATABASE_URL already configured in
// Vercel, so nobody has to copy the connection string to their own machine.
// Preview builds never migrate. A failed migration fails the deploy.
import { execSync } from "node:child_process";

const run = (command) => execSync(command, { stdio: "inherit" });

if (process.env.VERCEL_ENV === "production" && process.env.DATABASE_URL) {
  run("npx drizzle-kit migrate");
} else {
  console.log("Skipping migrations (needs a production deploy with DATABASE_URL).");
}

run("npm run build");
