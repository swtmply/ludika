#!/usr/bin/env bun
/**
 * Cross-package duplicate detector.
 *
 * Per-package typecheck and lint never see two workspaces holding the same
 * file, so copy-paste between apps is invisible to every other check in this
 * repo. This walks every source file under `apps/*` and `packages/*`, strips
 * comments and whitespace, and reports files that are identical or close to it.
 *
 *   bun run dupes            report only, always exits 0 (what CI runs)
 *   bun run dupes --strict   exits 1 on any finding, for local pre-push use
 *
 * A finding is not automatically a bug. Some duplication is deliberate: see
 * IGNORE below, and add to it with a reason rather than silencing the report.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/** Deliberate duplication. Each entry needs a reason. */
const IGNORE: { pattern: RegExp; reason: string }[] = [
  {
    // Each Expo app owns its own auth client: the storage prefix and deep-link
    // scheme are read from that app's own expoConfig at runtime.
    pattern: /^apps\/[^/]+\/lib\/auth-client\.ts$/,
    reason: "per-app auth client (app-specific scheme + secure-store prefix)",
  },
  {
    pattern: /^apps\/[^/]+\/lib\/server-config\.ts$/,
    reason: "per-app server config (reads that app's EXPO_PUBLIC_* env)",
  },
  {
    pattern: /^apps\/[^/]+\/utils\/trpc\.ts$/,
    reason: "per-app tRPC and query client singletons",
  },
];

const SKIP_DIRS = new Set([
  "node_modules",
  ".expo",
  ".next",
  "android",
  "ios",
  "dist",
  "build",
  "migrations",
  ".turbo",
  ".eas",
]);

const NEAR_DUPLICATE_THRESHOLD = 0.85;
const SHINGLE_SIZE = 5;
const MIN_TOKENS = 40;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path, out);
    } else if (/\.tsx?$/.test(entry) && !entry.endsWith(".d.ts")) {
      out.push(path);
    }
  }
  return out;
}

/** Strip comments and collapse whitespace so formatting noise cannot hide a copy. */
function normalise(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenise(normalised: string): string[] {
  return normalised.split(/(?=[^\w$])|(?<=[^\w$])/).filter((token) => token.trim().length > 0);
}

function shingles(tokens: string[]): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i + SHINGLE_SIZE <= tokens.length; i++) {
    set.add(tokens.slice(i, i + SHINGLE_SIZE).join(" "));
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const item of small) {
    if (large.has(item)) shared++;
  }
  return shared / (a.size + b.size - shared);
}

function workspaceOf(repoPath: string): string {
  const [group, name] = repoPath.split("/");
  return `${group}/${name}`;
}

function ignoreReason(repoPath: string): string | null {
  for (const { pattern, reason } of IGNORE) {
    if (pattern.test(repoPath)) return reason;
  }
  return null;
}

const roots = ["apps", "packages"];
const files = roots
  .flatMap((root) => walk(root))
  .map((path) => relative(process.cwd(), path).split(sep).join("/"));

type Entry = {
  path: string;
  workspace: string;
  hash: string;
  shingles: Set<string>;
  tokenCount: number;
};

const entries: Entry[] = files.map((path) => {
  const normalised = normalise(readFileSync(path, "utf8"));
  const tokens = tokenise(normalised);
  return {
    path,
    workspace: workspaceOf(path),
    hash: Bun.hash(normalised).toString(16),
    shingles: shingles(tokens),
    tokenCount: tokens.length,
  };
});

type Finding = {
  kind: "identical" | "near-identical";
  similarity: number;
  paths: string[];
  ignoredBecause: string | null;
};

const findings: Finding[] = [];
const pairedExactly = new Set<string>();

// Exact duplicates, grouped so a file copied three times reports once.
const byHash = new Map<string, Entry[]>();
for (const entry of entries) {
  const group = byHash.get(entry.hash) ?? [];
  group.push(entry);
  byHash.set(entry.hash, group);
}

for (const group of byHash.values()) {
  if (group.length < 2) continue;
  const workspaces = new Set(group.map((entry) => entry.workspace));
  if (workspaces.size < 2) continue;
  for (const a of group) {
    for (const b of group) pairedExactly.add([a.path, b.path].sort().join("|"));
  }
  findings.push({
    kind: "identical",
    similarity: 1,
    paths: group.map((entry) => entry.path).sort(),
    ignoredBecause: group.map((entry) => ignoreReason(entry.path)).find(Boolean) ?? null,
  });
}

// Near duplicates across workspaces.
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const a = entries[i]!;
    const b = entries[j]!;
    if (a.workspace === b.workspace) continue;
    if (a.tokenCount < MIN_TOKENS || b.tokenCount < MIN_TOKENS) continue;
    if (pairedExactly.has([a.path, b.path].sort().join("|"))) continue;

    const similarity = jaccard(a.shingles, b.shingles);
    if (similarity < NEAR_DUPLICATE_THRESHOLD) continue;

    findings.push({
      kind: "near-identical",
      similarity,
      paths: [a.path, b.path].sort(),
      ignoredBecause: ignoreReason(a.path) ?? ignoreReason(b.path),
    });
  }
}

findings.sort((a, b) => b.similarity - a.similarity || a.paths[0]!.localeCompare(b.paths[0]!));

const reportable = findings.filter((finding) => !finding.ignoredBecause);
const ignored = findings.filter((finding) => finding.ignoredBecause);

console.log(`Scanned ${entries.length} source files across ${roots.join(", ")}`);
console.log("");

if (reportable.length === 0) {
  console.log("No cross-package duplication found.");
} else {
  console.log(`${reportable.length} duplication finding(s):`);
  console.log("");
  for (const finding of reportable) {
    const pct = (finding.similarity * 100).toFixed(0);
    console.log(`  ${finding.kind} (${pct}%)`);
    for (const path of finding.paths) console.log(`    ${path}`);
    console.log(
      "    fix: promote to packages/ui or packages/mobile-ui, or add to IGNORE with a reason",
    );
    console.log("");
  }
}

if (ignored.length > 0) {
  console.log("");
  console.log(`${ignored.length} known duplicate(s), deliberate:`);
  for (const finding of ignored) {
    console.log(`  ${finding.paths.join(", ")}`);
    console.log(`    ${finding.ignoredBecause}`);
  }
}

if (process.argv.includes("--strict") && reportable.length > 0) {
  process.exit(1);
}
