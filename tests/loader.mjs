import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");

function tryResolveFile(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js"),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      return pathToFileURL(c).href;
    }
  }
  return null;
}

export async function resolve(specifier, context, defaultResolve) {
  // Handle @/ alias
  if (specifier.startsWith("@/")) {
    const subpath = specifier.slice(2);
    const targetPath = path.join(srcDir, subpath);
    const resolvedUrl = tryResolveFile(targetPath);
    if (resolvedUrl) {
      return { url: resolvedUrl, shortCircuit: true };
    }
  }

  // Handle relative imports without extension
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const parentUrl = context.parentURL;
    if (parentUrl && parentUrl.startsWith("file:")) {
      const parentDir = path.dirname(fileURLToPath(parentUrl));
      const targetPath = path.resolve(parentDir, specifier);
      const resolvedUrl = tryResolveFile(targetPath);
      if (resolvedUrl) {
        return { url: resolvedUrl, shortCircuit: true };
      }
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}
