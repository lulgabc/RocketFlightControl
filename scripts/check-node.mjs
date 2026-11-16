const [major, minor, patch] = process.versions.node.split(".").map(Number);

if (major < 22 || (major === 22 && (minor < 23 || (minor === 23 && patch < 4)))) {
  console.error(
    `\nAstro 7 requires Node.js >= 22.23.4 (current: ${process.versions.node}).\n` +
      "Use `nvm use` (see .nvmrc) or install Node >= 22.23.4.\n",
  );
  process.exit(1);
}
