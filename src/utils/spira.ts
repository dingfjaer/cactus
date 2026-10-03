export type ContentFilter = "alle" | "dingaling" | "ki-oppsummert";
export function contentFilter(value: unknown): ContentFilter {
	return value === "dingaling" || value === "ki-oppsummert" ? value : "alle";
}

/** Partial Fisher–Yates: every post, including pinned posts, has equal odds. */
export function drawPosts<T>(pool: readonly T[], random = Math.random): T[] {
	const copy = [...pool];
	const count = Math.min(5, copy.length);
	for (let i = 0; i < count; i++) {
		const j = i + Math.floor(random() * (copy.length - i));
		[copy[i], copy[j]] = [copy[j]!, copy[i]!];
	}
	return copy.slice(0, count);
}

/** Restore only unique IDs still present in the current published/filter pool. */
export function restoreDraw(ids: unknown, pool: readonly string[]): string[] | null {
	if (!Array.isArray(ids) || ids.length !== Math.min(5, pool.length)) return null;
	if (
		new Set(ids).size !== ids.length ||
		!ids.every((id) => typeof id === "string" && pool.includes(id))
	)
		return null;
	return ids;
}
