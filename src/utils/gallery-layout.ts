// Match the existing 1200px garden container, its padding and 16px column gaps.
export function masonryImageSizes(count: number) {
	const columns = Math.max(1, Math.min(3, count));
	const tabletColumns = Math.min(2, columns);
	return `(min-width: 1200px) ${(1136 - (columns - 1) * 16) / columns}px, (min-width: 1024px) calc((100vw - ${64 + (columns - 1) * 16}px) / ${columns}), (min-width: 640px) calc((100vw - ${64 + (tabletColumns - 1) * 16}px) / ${tabletColumns}), calc(100vw - 32px)`;
}

export const gridImageSizes = "(min-width: 1200px) 347px, (min-width: 1024px) calc((100vw - 160px) / 3), (min-width: 640px) calc((100vw - 96px) / 2), 100vw";
