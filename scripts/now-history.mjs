// Run with Node 24. No installed dependencies, source-branch changes or auto-commits on main.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { appendNowSnapshot, validateNowHistory } from "../src/utils/now-history.ts";

const seed = validateNowHistory(
	JSON.parse(readFileSync(new URL("../src/data/now-history-seed.json", import.meta.url), "utf8")),
);
const cwd = resolve(process.env.NOW_REPO_DIR || ".");
const branch = "now-history";
const ref = `refs/heads/${branch}`;
const git = (args, input) =>
	execFileSync("git", args, {
		cwd,
		input,
		encoding: "utf8",
		stdio: ["pipe", "pipe", "pipe"],
	}).trim();
function readPublished() {
	const check = spawnSync("git", ["ls-remote", "--exit-code", "--heads", "origin", ref], {
		cwd,
		encoding: "utf8",
	});
	if (check.status === 2) return { base: "", history: seed };
	if (check.status !== 0) throw new Error(`Could not read published now history: ${check.stderr}`);
	git(["fetch", "--quiet", "origin", ref]);
	const base = git(["rev-parse", "FETCH_HEAD"]);
	const history = validateNowHistory(JSON.parse(git(["show", `${base}:now-history.json`])));
	return { base, history };
}
const command = process.argv[2];
if (!["prepare", "persist", "sync"].includes(command))
	throw new Error("Usage: node scripts/now-history.mjs prepare|persist|sync");
const { base, history } = readPublished();
const cache = resolve(cwd, ".astro/now-history.json");
mkdirSync(resolve(cwd, ".astro"), { recursive: true });
if (command === "sync") {
	writeFileSync(cache, JSON.stringify(history, null, 2) + "\n");
	console.log(`Loaded ${history.snapshots.length} published now snapshots for local preview.`);
} else {
	const { nowItems } = await import(pathToFileURL(resolve(cwd, "src/data/now.ts")).href);
	const at = command === "persist" ? process.env.NOW_HISTORY_AT : new Date().toISOString();
	const source = git(["rev-parse", "HEAD"]);
	if (command === "persist" && (!at || process.env.NOW_HISTORY_BASE === undefined))
		throw new Error("Missing publication metadata.");
	const next = appendNowSnapshot(history, nowItems, at, source);
	const json = JSON.stringify(next, null, 2) + "\n";
	if (command === "prepare") {
		writeFileSync(cache, json);
		if (process.env.GITHUB_OUTPUT)
			appendFileSync(process.env.GITHUB_OUTPUT, `at=${at}\nbase=${base}\n`);
		console.log(
			`Prepared ${next.snapshots.length - history.snapshots.length} new now snapshot(s).`,
		);
	} else {
		// Only the successful deploy step may persist. Fail safely on unexpected concurrent writers.
		if (base !== process.env.NOW_HISTORY_BASE) {
			const last = history.snapshots.at(-1);
			if (
				(last?.sourceCommit === source && last.publishedAt === at) ||
				(process.env.NOW_HISTORY_BASE === "" &&
					JSON.stringify(history) === JSON.stringify(seed) &&
					JSON.stringify(next) === JSON.stringify(seed))
			) {
				console.log("This publication was already recorded.");
				process.exit(0);
			}
			throw new Error("Published history changed during deployment. Refusing to overwrite it.");
		}
		if (base && next.snapshots.length === history.snapshots.length) {
			console.log("No changed now topics. History is unchanged.");
			process.exit(0);
		}
		const blob = git(["hash-object", "-w", "--stdin"], json);
		const tree = git(["mktree"], `100644 blob ${blob}\tnow-history.json\n`);
		const commit = git([
			"-c",
			"user.name=github-actions[bot]",
			"-c",
			"user.email=41898282+github-actions[bot]@users.noreply.github.com",
			"commit-tree",
			tree,
			...(base ? ["-p", base] : []),
			"-m",
			`Record published now update from ${source.slice(0, 7)}`,
		]);
		git(["push", "origin", `${commit}:${ref}`]);
		console.log("Saved published now history on the now-history branch.");
	}
}
