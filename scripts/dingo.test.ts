import assert from "node:assert/strict";
import { test } from "node:test";
import { randomInt, rollDie, sampleItems, diceRotations } from "../src/utils/dingo.ts";
import { drawPosts, restoreDraw } from "../src/utils/spira.ts";

test("Every die face maps to a unique outcome; out-of-range random bytes are retried", () => {
	for (let face = 0; face < 6; face++)
		assert.equal(
			randomInt(6, () => face),
			face,
		);
	const bytes = [2 ** 32 - 1, 2 ** 32 - 2, 5];
	assert.equal(
		randomInt(6, () => bytes.shift()!),
		5,
	);
	assert.equal(bytes.length, 0);
	for (let i = 0; i < 50; i++) {
		const value = rollDie();
		assert.ok(Number.isInteger(value) && value >= 1 && value <= 6);
	}
	assert.equal(new Set(diceRotations).size, 6);
});

test("All six results select exactly that many unique items, capped only by available content", () => {
	for (const size of [0, 1, 3, 6, 18, 68]) {
		const source = Array.from({ length: size }, (_, i) => String(i));
		const original = [...source];
		for (let value = 1; value <= 6; value++) {
			const found = sampleItems(source, value, (max) => max - 1);
			assert.equal(found.length, Math.min(size, value));
			assert.equal(new Set(found).size, found.length);
			assert.ok(found.every((item) => source.includes(item)));
			assert.deepEqual(restoreDraw(found, source), found);
			assert.equal(drawPosts(source, () => 0.8, value).length, found.length);
		}
		assert.deepEqual(source, original);
	}
});

test("Gallery selection can start with every member, irrespective of its original order", () => {
	const source = ["a", "b", "c", "d", "e", "f", "g"];
	for (let index = 0; index < source.length; index++) {
		assert.deepEqual(
			sampleItems(source, 1, () => index),
			[source[index]],
		);
	}
});
