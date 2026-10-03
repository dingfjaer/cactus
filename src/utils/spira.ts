export type ContentFilter = "alle" | "nerding" | "ki-oppsummert";
// Read-only compatibility alias for links and session data created before the rename.
export const legacyNerdingFilter = "dingaling";
export function contentFilter(value: unknown): ContentFilter {
	if (value === legacyNerdingFilter) return "nerding";
	return value === "nerding" || value === "ki-oppsummert" ? value : "alle";
}

/** Partial Fisher–Yates: every post, including pinned posts, has equal odds. */
export function drawPosts<T>(pool: readonly T[], random = Math.random, requestedCount = 5): T[] {
	const copy = [...pool];
	const count = Math.min(requestedCount, copy.length);
	for (let i = 0; i < count; i++) {
		const j = i + Math.floor(random() * (copy.length - i));
		[copy[i], copy[j]] = [copy[j]!, copy[i]!];
	}
	return copy.slice(0, count);
}

/** Restore only unique IDs still present in the current published/filter pool. */
export function restoreDraw(ids: unknown, pool: readonly string[]): string[] | null {
	if (
		!Array.isArray(ids) ||
		ids.length > Math.min(6, pool.length) ||
		(!ids.length && pool.length > 0)
	)
		return null;
	if (
		new Set(ids).size !== ids.length ||
		!ids.every((id) => typeof id === "string" && pool.includes(id))
	)
		return null;
	return ids;
}
