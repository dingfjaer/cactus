/** Rejection sampling avoids favouring any die face when using random bytes. */
export function randomInt(
	max: number,
	next = () => crypto.getRandomValues(new Uint32Array(1))[0]!,
) {
	const limit = 2 ** 32 - (2 ** 32 % max);
	let value: number;
	do {
		value = next();
	} while (value >= limit);
	return value % max;
}
export function rollDie() {
	return randomInt(6) + 1;
}

/** Partial Fisher–Yates, with no replacement or special treatment of pinned items. */
export function sampleItems<T>(pool: readonly T[], count: number, pick = randomInt): T[] {
	const copy = [...pool];
	const size = Math.min(count, copy.length);
	for (let i = 0; i < size; i++) {
		const j = i + pick(copy.length - i);
		[copy[i], copy[j]] = [copy[j]!, copy[i]!];
	}
	return copy.slice(0, size);
}

// Rotate the selected face directly toward the reader when the tumble settles.
export const diceRotations = [
	"rotateX(-90deg)",
	"rotateY(180deg)",
	"rotateY(-90deg)",
	"rotateY(90deg)",
	"rotateY(0deg)",
	"rotateX(90deg)",
];
