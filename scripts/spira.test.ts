import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { contentFilter, legacyNerdingFilter, drawPosts, restoreDraw } from "../src/utils/spira.ts";

test("Dingo handles empty and small archives without duplicates or mutating the source", () => {
	for (const pool of [[], ["a"], ["a", "b", "c"], ["a", "b", "c", "d", "e", "f"]]) {
		const before = [...pool];
		const drawn = drawPosts(pool, () => 0.7);
		assert.equal(drawn.length, Math.min(5, pool.length));
		assert.equal(new Set(drawn).size, drawn.length);
		assert.ok(drawn.every((id) => pool.includes(id)));
		assert.deepEqual(pool, before);
	}
});
test("Dingo can select every member, without giving the first/pinned item preference", () => {
	const pool = ["pinned", "a", "b", "c", "d", "e", "f"];
	for (let i = 0; i < pool.length; i++)
		assert.equal(drawPosts(pool, () => (i + 0.1) / pool.length)[0], pool[i]);
});
test("Restored draws reject duplicates, missing/unpublished IDs and wrong counts", () => {
	const pool = ["a", "b", "c"];
	assert.deepEqual(restoreDraw(["c", "a", "b"], pool), ["c", "a", "b"]);
	for (const invalid of [null, {}, [], ["a", "a", "b"], ["a", "b", "draft"]])
		assert.equal(restoreDraw(invalid, pool), null);
	assert.deepEqual(restoreDraw([], []), []);
	assert.deepEqual(restoreDraw(["a"], pool), ["a"]);
	assert.equal(
		restoreDraw(["a", "b", "c", "d", "e", "f", "g"], ["a", "b", "c", "d", "e", "f", "g"]),
		null,
	);
	assert.equal(contentFilter("unknown"), "alle");
	assert.equal(contentFilter("ki-oppsummert"), "ki-oppsummert");
});
test("NerDing accepts the canonical key and upgrades old links and history filters", () => {
	assert.equal(contentFilter("nerding"), "nerding");
	assert.equal(contentFilter(legacyNerdingFilter), "nerding");
	assert.equal(contentFilter("ki-oppsummert"), "ki-oppsummert");
	assert.equal(contentFilter(null), "alle");
});
const themeScript = readFileSync(
	new URL("../src/components/ThemeProvider.astro", import.meta.url),
	"utf8",
)
	.split("<script is:inline>")[1]
	.split("</script>")[0];
function themeHarness(stored: string | null, blocked = false) {
	let applied = "";
	let saved = stored;
	const events: Record<string, (e: any) => void> = {};
	const root = {
		getAttribute: () => applied,
		setAttribute: (_key: string, value: string) => {
			applied = value;
		},
	};
	runInNewContext(themeScript, {
		localStorage: {
			getItem: () => {
				if (blocked) throw Error();
				return saved;
			},
			setItem: (_key: string, v: string) => {
				if (blocked) throw Error();
				saved = v;
			},
		},
		document: {
			documentElement: root,
			body: {},
			querySelector: () => ({ setAttribute: () => {} }),
			addEventListener: (name: string, callback: (e: any) => void) => {
				events[name] = callback;
			},
		},
		getComputedStyle: () => ({ getPropertyValue: () => "200deg 6% 10%" }),
		console,
	});
	return {
		theme: () => applied,
		change: (theme: string) => events["theme-change"]({ detail: { theme } }),
	};
}
test("First visit and unavailable storage default to dark; explicit light is respected", () => {
	assert.equal(themeHarness(null).theme(), "dark");
	assert.equal(themeHarness(null, true).theme(), "dark");
	assert.equal(themeHarness("invalid").theme(), "dark");
	const chosen = themeHarness("light");
	assert.equal(chosen.theme(), "light");
	chosen.change("dark");
	assert.equal(chosen.theme(), "dark");
	const blocked = themeHarness(null, true);
	blocked.change("light");
	assert.equal(blocked.theme(), "light");
});
