import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { advanceReading, readingDurations, readingProgress } from "../src/scripts/name-reading.mjs";

function play(elapsed, milliseconds, visible = [true, true, true]) {
	for (let t = 0; t < milliseconds; t += 16) elapsed = advanceReading(elapsed, 16, visible).elapsed;
	return elapsed;
}

test("reading finishes at rest, with overlapping eased details and persistent colors", () => {
	const early = readingProgress(play([0, 0, 0], 1200));
	assert.ok(early.filter((p) => p > 0 && p < 1).length > 3);
	assert.equal(early[21], 0);
	assert.ok(readingProgress([100, 0, 0])[0] < 100 / 1800);
	const finished = play([0, 0, 0], 8600);
	assert.deepEqual(finished, readingDurations);
	assert.deepEqual(readingProgress(finished), Array(22).fill(1));
	assert.deepEqual(advanceReading(finished, 16, [true, true, true]), {
		elapsed: finished,
		running: false,
	});
});

test("mobile waits for each visible group and resumes without rewinding previous details", () => {
	const ding = play([0, 0, 0], 9000, [true, false, false]);
	assert.deepEqual(ding, [readingDurations[0], 0, 0]);
	const chen = play(ding, 1600, [false, true, false]);
	assert.ok(chen[1] > 0 && chen[1] < readingDurations[1]);
	assert.deepEqual(play(chen, 3000, [false, false, false]), chen);
	const complete = play(chen, 7000, [false, true, true]);
	assert.deepEqual(complete, readingDurations);
});

function fixture() {
	let ElementClass;
	const window = {
		scrollY: 1000,
		innerHeight: 720,
		innerWidth: 1280,
		scrollTo({ top }) {
			this.scrollY = top;
		},
	};
	const document = {
		hidden: false,
		documentElement: { scrollHeight: 8000 },
		querySelector: () => null,
	};
	const context = vm.createContext({
		window,
		document,
		HTMLElement: class {},
		advanceReading,
		readingDurations,
		readingProgress,
		customElements: {
			get: () => false,
			define: (_name, value) => {
				ElementClass = value;
			},
		},
	});
	const source = readFileSync(
		new URL("../src/scripts/about-name.js", import.meta.url),
		"utf8",
	).replace(/^import[^\n]+\n/, "");
	vm.runInContext(source, context);
	const element = new ElementClass();
	const properties = new Map();
	element.section = {
		style: {
			setProperty: (k, v) => properties.set(k, v),
			removeProperty: (k) => properties.delete(k),
		},
		getBoundingClientRect: () => ({
			top: 1000 - window.scrollY,
			bottom: 3124 + (element.morphOffset ?? 0) * 720 - window.scrollY,
		}),
	};
	element.readingGroups = [0, 1, 2].map(() => ({
		getBoundingClientRect: () => ({ top: 100, bottom: 600 }),
	}));
	element.readingElapsed = [0, 0, 0];
	element.morphOffset = null;
	element.reduced = { matches: false };
	element.pinned = { matches: true };
	element.schedule = () => {};
	element.render = () => {};
	return { element, window, document, properties, context };
}

test("morph waits for Fjær; scrolling during playback becomes the new morph origin", () => {
	const { element, window, context } = fixture();
	element.advanceReading(16);
	assert.equal(element.readingComplete(), false);
	assert.equal(element.morphOffset, null);
	window.scrollY = 1400;
	for (let t = 0; t < 8600; t += 16) element.advanceReading(16);
	assert.equal(element.readingComplete(), true);
	assert.equal(element.morphStart(), 1400);
	const timeline = vm.runInContext("nameTimeline", context);
	assert.equal(timeline((window.scrollY - element.morphStart()) / 720).merge, 0);
	window.scrollY += 360;
	assert.ok(timeline((window.scrollY - element.morphStart()) / 720).merge > 0);
	window.scrollY = 1400;
	assert.equal(timeline((window.scrollY - element.morphStart()) / 720).merge, 0);
	assert.equal(element.readingComplete(), true);
});

test("hidden tabs pause playback; returning fully to the model resets the entrance", () => {
	const { element, window, document, properties } = fixture();
	element.advanceReading(1000);
	const before = [...element.readingElapsed];
	document.hidden = true;
	assert.equal(element.advanceReading(1000), false);
	assert.deepEqual([...element.readingElapsed], before);
	document.hidden = false;
	element.finishReading(true);
	window.scrollY = 0;
	element.advanceReading(16);
	assert.deepEqual([...element.readingElapsed], [0, 0, 0]);
	assert.equal(element.morphOffset, null);
	assert.equal(properties.has("--name-reading-scroll"), false);
});

test("fast scrolling past the section and reduced motion show a completed state", () => {
	for (const mode of ["fast", "reduced"]) {
		const { element, window } = fixture();
		if (mode === "fast") window.scrollY = 4000;
		else element.reduced.matches = true;
		assert.equal(element.advanceReading(16), false);
		assert.equal(element.readingComplete(), true);
		assert.equal(element.morphOffset, 0);
	}
});

test("shortcut finishes reading immediately and preserves morph then 10% portrait preview", () => {
	const { element, window, context } = fixture();
	element.skipDestination = () => ({ top: 4000, element: {} });
	element.skipReading();
	assert.equal(element.readingComplete(), true);
	assert.equal(window.scrollY, 1000 + 720 * 0.16);
	assert.equal(element.autoplay.morphEnd, 1000 + 720 * 1.71);
	const scroll = vm.runInContext("shortcutScroll", context);
	const { from, morphEnd, top } = element.autoplay;
	assert.equal(scroll(2200, from, morphEnd, top).top, morphEnd);
	assert.equal(scroll(3100, from, morphEnd, top).top, top);
	assert.equal(scroll(3100, from, morphEnd, top).done, true);
	const offset = vm.runInContext("portraitPreviewOffset", context)(1800);
	const t = (offset / 1800 - 0.1) / 0.8;
	assert.ok(Math.abs(t * t * (3 - 2 * t) - 0.1) < 1e-10);
});
