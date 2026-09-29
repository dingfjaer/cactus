// Milliseconds within Ding, Chen and Fjær. Adjacent details overlap deliberately.
const delays = [
	[0, 200, 400, 600, 450, 1000, 1800],
	[0, 200, 400, 600, 450, 1100, 1400, 1700, 2000],
	[0, 200, 400, 600, 1300, 2100],
];
const duration = 1800;
const groupStagger = 2300;
export const readingDurations = delays.map((group) => Math.max(...group) + duration);

export function readingProgress(elapsed) {
	return delays.flatMap((group, i) =>
		group.map((delay) => {
			const t = Math.max(0, Math.min(1, (elapsed[i] - delay) / duration));
			return t * t * (3 - 2 * t);
		}),
	);
}

// Visibility gates each group on narrow screens; a hidden tab never consumes time.
export function advanceReading(elapsed, dt, visible) {
	const next = [...elapsed];
	let running = false;
	for (let i = 0; i < next.length; i++) {
		const ready = i === 0 || elapsed[i - 1] >= groupStagger;
		if (!visible[i] || !ready || next[i] >= readingDurations[i]) continue;
		next[i] = Math.min(readingDurations[i], next[i] + dt);
		running ||= next[i] < readingDurations[i];
	}
	return { elapsed: next, running };
}
