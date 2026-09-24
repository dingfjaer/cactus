import type { AdmonitionType, GardenAdmonitionType } from "../types";

// Phosphor regular icons. Keep theme names, colors and icons together.
export const admonitionThemes = {
	spira: { label: "Spira", icon: "plant", color: "emerald" },
	rosa: { label: "Rosa", icon: "flower", color: "pink" },
	vipa: { label: "Vipa", icon: "bird", color: "sky" },
	lova: { label: "Løva", icon: "leaf", color: "amber" },
	tinsta: { label: "Tinsta", icon: "paw-print", color: "orange" },
} as const;

// Retain the established mapping for existing Markdown.
export const admonitionAliases = {
	spira: "spira",
	rosa: "rosa",
	vipa: "vipa",
	lova: "lova",
	tinsta: "tinsta",
	tip: "spira",
	important: "rosa",
	note: "vipa",
	caution: "lova",
	warning: "tinsta",
} as const satisfies Record<AdmonitionType, GardenAdmonitionType>;
