export const nowTopicKeys = ["doing", "listening", "reading", "watching", "finished"] as const;
export type NowTopicKey = (typeof nowTopicKeys)[number];
export type NowValue = { title: string; detail?: string };
export type NowSnapshot = {
	publishedAt: string;
	sourceCommit: string | null; // null only for the user-dated initial snapshot
	changes: Partial<Record<NowTopicKey, NowValue>>;
};
export type NowHistory = { version: 1; snapshots: NowSnapshot[] };
export type NowItem = NowValue & { key: string; label: string };
export const emptyNowHistory = (): NowHistory => ({ version: 1, snapshots: [] });

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function normalizeValue(value: unknown): NowValue {
	if (!isRecord(value) || typeof value.title !== "string" || !value.title.trim())
		throw new Error("Every now entry needs a non-empty title.");
	if (value.detail !== undefined && typeof value.detail !== "string")
		throw new Error("Now entry detail must be text.");
	const detail = value.detail?.trim();
	return { title: value.title.trim(), ...(detail ? { detail } : {}) };
}
export function validateNowHistory(input: unknown): NowHistory {
	if (!isRecord(input) || input.version !== 1 || !Array.isArray(input.snapshots))
		throw new Error("Invalid now history. Refusing to overwrite existing history.");
	let previous = -Infinity;
	const snapshots = input.snapshots.map((entry): NowSnapshot => {
		if (
			!isRecord(entry) ||
			typeof entry.publishedAt !== "string" ||
			!/Z$/.test(entry.publishedAt) ||
			!Number.isFinite(Date.parse(entry.publishedAt)) ||
			Date.parse(entry.publishedAt) < previous ||
			(entry.sourceCommit !== null &&
				(typeof entry.sourceCommit !== "string" || !/^[a-f0-9]{40}$/.test(entry.sourceCommit))) ||
			!isRecord(entry.changes) ||
			!Object.keys(entry.changes).length
		)
			throw new Error("Invalid now history snapshot.");
		previous = Date.parse(entry.publishedAt);
		const changes: NowSnapshot["changes"] = {};
		for (const [key, value] of Object.entries(entry.changes)) {
			if (!nowTopicKeys.includes(key as NowTopicKey)) throw new Error(`Unknown now topic: ${key}`);
			changes[key as NowTopicKey] = normalizeValue(value);
		}
		return { publishedAt: entry.publishedAt, sourceCommit: entry.sourceCommit, changes };
	});
	return { version: 1, snapshots };
}
export function currentNowChanges(
	history: NowHistory,
	items: readonly NowItem[],
): NowSnapshot["changes"] {
	const latest: NowSnapshot["changes"] = {};
	for (const snapshot of history.snapshots) Object.assign(latest, snapshot.changes);
	const changes: NowSnapshot["changes"] = {};
	for (const key of nowTopicKeys) {
		const matches = items.filter((item) => item.key === key);
		if (matches.length !== 1) throw new Error(`Expected exactly one now entry for ${key}.`);
		const value = normalizeValue(matches[0]);
		if (latest[key]?.title !== value.title || latest[key]?.detail !== value.detail)
			changes[key] = value;
	}
	return changes;
}
export function appendNowSnapshot(
	history: NowHistory,
	items: readonly NowItem[],
	publishedAt: string,
	sourceCommit: string,
): NowHistory {
	const validated = validateNowHistory(history);
	const changes = currentNowChanges(validated, items);
	if (!Object.keys(changes).length) return validated;
	return validateNowHistory({
		version: 1,
		snapshots: [...validated.snapshots, { publishedAt, sourceCommit, changes }],
	});
}
export function nowDateLabel(timestamp: string) {
	return new Intl.DateTimeFormat("nb-NO", {
		timeZone: "Europe/Oslo",
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(timestamp));
}
