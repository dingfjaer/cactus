import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { slug } from "github-slugger";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const post = defineCollection({
	loader: glob({
		base: "./src/content/post",
		pattern: ["**/*.{md,mdx}", "!Templates/**"],
		// Keep the original Cactus URLs, including Norwegian letters and underscores.
		generateId: ({ entry, data }) => typeof data.slug === "string" ? data.slug : entry.replace(/\.(md|mdx)$/, "").split("/").map(part => slug(part)).join("/").replace(/\/index$/, ""),
	}),
	schema: ({ image }) =>
		z.object({
			coverImage: z
				.object({
					alt: z.string(),
					src: image(),
				})
				.optional(), 
			description: z.string().max(160),
			draft: z.boolean().default(false),
			pinned: z.boolean().optional().default(false),
			ogImage: z.string().optional(),
			publishDate: z
				.string()
				.or(z.date())
				.transform((val) => new Date(val)),
			tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
			title: z.string().max(60),
			updatedDate: z
				.string()
				.or(z.date())
				.optional()
				.transform((str) => (str ? new Date(str) : undefined)),
		}),
});

export const collections = { post };
