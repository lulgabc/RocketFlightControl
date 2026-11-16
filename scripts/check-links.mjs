import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const base = "/RocketFlightControl";

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (entry.name.endsWith(".html")) out.push(path);
  }
  return out;
}

async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

const files = await walk(dist);
const missing = [];

for (const file of files) {
  const html = await readFile(file, "utf8");
  const rel = relative(dist, file);

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    let href = match[1];
    if (!href || href.startsWith("#")) continue;
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;

    href = href.split("#")[0].split("?")[0];
    if (!href.startsWith("/")) continue;

    let path = href;
    if (path === base) path = "/";
    else if (path.startsWith(`${base}/`)) path = path.slice(base.length);

    const clean = path.replace(/^\/+|\/+$/g, "");
    const candidates = clean
      ? [join(dist, clean), join(dist, clean, "index.html")]
      : [join(dist, "index.html")];

    let ok = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        ok = true;
        break;
      }
    }

    if (!ok) missing.push(`${rel} -> ${href}`);
  }
}

if (missing.length) {
  console.error(`\n[links] ${missing.length} missing internal link(s):`);
  for (const item of missing.slice(0, 40)) console.error(`  ${item}`);
  if (missing.length > 40) console.error(`  ... and ${missing.length - 40} more`);
  process.exit(1);
}

console.log(`[links] ${files.length} HTML files checked, no missing internal links`);
