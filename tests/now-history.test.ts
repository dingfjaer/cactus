import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { nowItems } from "../src/data/now.ts";
import {
	appendNowSnapshot,
	emptyNowHistory,
	currentNowChanges,
	validateNowHistory,
	nowDateLabel,
} from "../src/utils/now-history.ts";
const sha = "a".repeat(40);
const initial = () =>
	appendNowSnapshot(emptyNowHistory(), nowItems, "2026-11-01T12:00:00.000Z", sha);

test("First publication records exactly the five editable topics, not Tintin", () => {
	assert.equal(initial().snapshots.length, 1);
	assert.deepEqual(Object.keys(initial().snapshots[0].changes), [
		"doing",
		"listening",
		"reading",
		"watching",
		"finished",
	]);
});
test("Unchanged rebuilds and label/whitespace changes do not create events", () => {
	const items = nowItems.map((item) => ({
		...item,
		title: item.key === "tintin" ? "older today" : ` ${item.title} `,
		label: "Updated label",
	}));
	assert.deepEqual(
		appendNowSnapshot(initial(), items, "2026-11-02T12:00:00.000Z", "b".repeat(40)),
		initial(),
	);
});
test("One changed detail creates one event; reverting an activity is a new event", () => {
	const history = initial();
	const before = JSON.stringify(history);
	const items = nowItems.map((item) =>
		item.key === "reading" ? { ...item, detail: "A different edition" } : item,
	);
	const changed = appendNowSnapshot(history, items, "2026-11-02T12:00:00.000Z", "b".repeat(40));
	assert.deepEqual(Object.keys(changed.snapshots[1].changes), ["reading"]);
	assert.equal(JSON.stringify(history), before);
	assert.equal(
		appendNowSnapshot(changed, nowItems, "2026-11-03T12:00:00.000Z", sha).snapshots.length,
		3,
	);
	assert.deepEqual(currentNowChanges(changed, items), {});
});
test("Corrupt history, backwards dates and missing topics fail rather than erase history", () => {
	assert.throws(() => validateNowHistory({ snapshots: [] }));
	assert.throws(() =>
		validateNowHistory({ version: 1, snapshots: [{ publishedAt: "yesterday", changes: {} }] }),
	);
	assert.throws(() =>
		appendNowSnapshot(
			initial(),
			nowItems.map((i) => (i.key === "doing" ? { ...i, title: "Changed" } : i)),
			"2026-10-01T12:00:00.000Z",
			sha,
		),
	);
	assert.throws(() =>
		currentNowChanges(
			initial(),
			nowItems.filter((i) => i.key !== "reading"),
		),
	);
});
test("Labels use Oslo time across daylight saving boundaries", () => {
	assert.match(nowDateLabel("2026-10-24T12:00:00Z"), /14:00/);
	assert.match(nowDateLabel("2026-10-25T12:00:00Z"), /13:00/);
});
test("Publication CLI persists only after success, keeps main untouched and rejects concurrent writers", () => {
	const dir = mkdtempSync(join(tmpdir(), "cactus-now-history-"));
	const repo = join(dir, "repo");
	const remote = join(dir, "remote.git");
	const output = join(dir, "outputs");
	const script = resolve("scripts/now-history.mjs");
	const run = (args: string[], cwd = repo, input?: string) =>
		execFileSync("git", args, {
			cwd,
			input,
			encoding: "utf8",
			stdio: ["pipe", "pipe", "pipe"],
		}).trim();
	const cli = (command: string, extra: Record<string, string> = {}) =>
		execFileSync(process.execPath, [script, command], {
			cwd: repo,
			env: { ...process.env, NOW_REPO_DIR: repo, GITHUB_OUTPUT: output, ...extra },
			encoding: "utf8",
			stdio: ["pipe", "pipe", "pipe"],
		});
	const metadata = () =>
		Object.fromEntries(
			readFileSync(output, "utf8")
				.trim()
				.split("\n")
				.map((line) => {
					const i = line.indexOf("=");
					return [line.slice(0, i), line.slice(i + 1)];
				}),
		);
	try {
		mkdirSync(repo);
		run(["init", "--bare", remote], dir);
		run(["init", "-b", "main"]);
		run(["config", "user.name", "Now test"]);
		run(["config", "user.email", "test@example.invalid"]);
		run(["remote", "add", "origin", remote]);
		mkdirSync(join(repo, "src/data"), { recursive: true });
		const writeItems = (items: unknown) =>
			writeFileSync(
				join(repo, "src/data/now.ts"),
				`export const nowItems = ${JSON.stringify(items)};\n`,
			);
		writeItems(nowItems);
		run(["add", "."]);
		run(["commit", "-m", "Initial content"]);
		const main = run(["rev-parse", "HEAD"]);
		cli("prepare");
		assert.equal(run(["ls-remote", "--heads", "origin", "now-history"]), ""); // Failed/skipped deploy has no history.
		const candidate = readFileSync(join(repo, ".astro/now-history.json"), "utf8");
		assert.equal(JSON.parse(candidate).snapshots[0].publishedAt, "2026-09-27T16:25:00.000Z");
		assert.equal(JSON.parse(candidate).snapshots[0].sourceCommit, null);
		assert.match(nowDateLabel(JSON.parse(candidate).snapshots[0].publishedAt), /18:25/);
		const first = metadata();
		cli("persist", { NOW_HISTORY_AT: first.at, NOW_HISTORY_BASE: first.base });
		assert.equal(
			run(["show", "refs/heads/now-history:now-history.json"], remote),
			candidate.trim(),
		);
		assert.equal(run(["rev-parse", "HEAD"]), main);
		assert.equal(run(["branch", "--show-current"]), "main");
		cli("persist", { NOW_HISTORY_AT: first.at, NOW_HISTORY_BASE: first.base }); // Retry is idempotent.
		writeItems(
			nowItems.map((i) => (i.key === "doing" ? { ...i, title: "Concurrent first update" } : i)),
		);
		assert.throws(() => cli("persist", { NOW_HISTORY_AT: first.at, NOW_HISTORY_BASE: "" }));
		writeItems(nowItems);
		const recorded = run(["rev-parse", "refs/heads/now-history"], remote);
		cli("prepare");
		const second = metadata();
		cli("persist", { NOW_HISTORY_AT: second.at, NOW_HISTORY_BASE: second.base });
		assert.equal(run(["rev-parse", "refs/heads/now-history"], remote), recorded);
		writeItems(nowItems.map((i) => (i.key === "doing" ? { ...i, title: "New activity" } : i)));
		run(["add", "src/data/now.ts"]);
		run(["commit", "-m", "Change activity"]);
		cli("prepare");
		const changed = metadata();
		cli("persist", { NOW_HISTORY_AT: changed.at, NOW_HISTORY_BASE: changed.base });
		const ledger = JSON.parse(run(["show", "refs/heads/now-history:now-history.json"], remote));
		assert.equal(ledger.snapshots.length, 2);
		assert.deepEqual(Object.keys(ledger.snapshots[1].changes), ["doing"]);
		assert.throws(() => cli("persist", { NOW_HISTORY_AT: first.at, NOW_HISTORY_BASE: first.base }));
		cli("sync");
		assert.deepEqual(
			JSON.parse(readFileSync(join(repo, ".astro/now-history.json"), "utf8")),
			ledger,
		);
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
});
