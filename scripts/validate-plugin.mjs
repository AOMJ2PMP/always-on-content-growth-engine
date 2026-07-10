import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  ".codex-plugin/plugin.json",
  ".mcp.json",
  ".env.example",
  ".gitignore",
  "CONTRIBUTING.md",
  "LICENSE",
  "README.md",
  "SECURITY.md",
  "references/content-candidate.schema.json",
  "references/notion-opportunity-pool.md",
  "scripts/build-notion-record.mjs",
  "scripts/check-visual-uniqueness.mjs",
  "scripts/render-carousel.mjs",
  "scripts/score-candidate.mjs",
  "skills/always-on-content-growth-engine/SKILL.md",
  "skills/social-content-intelligence/SKILL.md",
  "skills/tencent-cloud-content-angle/SKILL.md",
  "skills/multiplatform-content-package/SKILL.md",
  "skills/tencent-cloud-illustration/SKILL.md",
  "skills/social-carousel-composer/SKILL.md",
  "skills/content-review-handoff/SKILL.md"
];

for (const relativePath of requiredFiles) {
  await access(path.join(root, relativePath));
}

const manifest = JSON.parse(await readFile(path.join(root, ".codex-plugin/plugin.json"), "utf8"));
const mcp = JSON.parse(await readFile(path.join(root, ".mcp.json"), "utf8"));
const schema = JSON.parse(await readFile(path.join(root, "references/content-candidate.schema.json"), "utf8"));

if (manifest.name !== "always-on-content-growth-engine") {
  throw new Error("Unexpected plugin name.");
}

if (!manifest.skills || !manifest.mcpServers) {
  throw new Error("Manifest must expose skills and MCP servers.");
}

const servers = Object.keys(mcp.mcpServers ?? {});
if (!servers.some((name) => name.includes("twitter")) || !servers.some((name) => name.includes("linkedin"))) {
  throw new Error("TikHub Twitter and LinkedIn MCP servers are both required.");
}

if (schema.title !== "Always-on Content Candidate Package") {
  throw new Error("Candidate schema is missing or invalid.");
}

process.stdout.write(`Validated ${requiredFiles.length} required files, ${servers.length} MCP servers, and the candidate schema.\n`);
