import { cp, mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = join(root, "src", "labs");
const dest = join(root, "public", "labs");

await mkdir(dest, { recursive: true });

const entries = await readdir(src, { withFileTypes: true });
let copied = 0;

for (const entry of entries) {
  if (!entry.isFile()) continue;
  await cp(join(src, entry.name), join(dest, entry.name));
  copied += 1;
}

console.log(`[labs] synced ${copied} files: src/labs -> public/labs`);
