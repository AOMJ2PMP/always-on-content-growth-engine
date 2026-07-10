import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

function signature(candidate) {
  return JSON.stringify(candidate.visualPlan?.visualSignature ?? {});
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

const inputs = process.argv.slice(2);
if (inputs.length < 2) {
  throw new Error("Usage: node scripts/check-visual-uniqueness.mjs <candidate-a.json> <candidate-b.json> [...]");
}

const candidates = await Promise.all(
  inputs.map(async (input) => JSON.parse(await readFile(path.resolve(input), "utf8"))),
);

const promptOwners = new Map();
const signatureOwners = new Map();
const backgroundOwners = new Map();

for (const candidate of candidates) {
  const id = candidate.candidateId;
  const prompt = candidate.visualPlan?.prompt?.trim();
  const visualSignature = signature(candidate);
  if (!prompt || visualSignature === "{}") throw new Error(`${id} is missing a prompt or visual signature.`);

  for (const [value, owners, label] of [
    [prompt, promptOwners, "prompt"],
    [visualSignature, signatureOwners, "visual signature"],
  ]) {
    if (owners.has(value)) throw new Error(`${id} reuses the ${label} from ${owners.get(value)}.`);
    owners.set(value, id);
  }

  for (const background of candidate.visualPlan?.backgrounds ?? []) {
    const resolved = path.resolve(background);
    if (backgroundOwners.has(resolved)) {
      throw new Error(`${id} reuses background ${resolved} from ${backgroundOwners.get(resolved)}.`);
    }
    backgroundOwners.set(resolved, id);
  }
}

const summary = candidates.map((candidate) => ({
  candidateId: candidate.candidateId,
  promptHash: hash(candidate.visualPlan.prompt),
  signatureHash: hash(signature(candidate)),
  backgroundCount: candidate.visualPlan.backgrounds.length,
}));

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
