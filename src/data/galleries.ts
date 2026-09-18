export const galleries = {
	rosa: { title: "Rosa", shareId: "1m6fadh3co4g", description: "Fotografier fra hverdagen." },
	tinsta: { title: "Tinsta", shareId: "k0qd6q3j37gn", description: "Små og store øyeblikk med Tintin." },
	vipa: { title: "Vipa", shareId: "mkvam5mvllu0", description: "Apper og designarbeid." },
	lova: { title: "Løva", shareId: "of1d95h6rvrr", description: "Illustrasjoner, tegninger og malerier." },
} as const;

export type GalleryKey = keyof typeof galleries;
