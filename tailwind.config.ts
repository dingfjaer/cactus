import { readFileSync } from "node:fs";
import { join } from "node:path";
import { admonitionAliases, admonitionThemes } from "./src/data/admonitions";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";


function phosphorMask(icon: string) {
	const svg = readFileSync(join(__dirname, "src/assets/admonitions", `${icon}.svg`), "utf8").trim();
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}",
		"!./src/pages/og-image/[slug].png.ts",
	],
	corePlugins: {
		// disable some core plugins as they are included in the css, even when unused
		borderOpacity: false,
		fontVariantNumeric: false,
		ringOffsetColor: false,
		ringOffsetWidth: false,
		scrollSnapType: false,
		textOpacity: false,
		touchAction: false,
	},
	darkMode: ["class", '[data-theme="dark"]'],
	
	plugins: [
		require("@tailwindcss/typography"),
		plugin(({ addComponents }) => {
			addComponents({
				".cactus-link": {
					"&:hover": {
						"@apply decoration-link decoration-2": {},
					},
					"@apply underline underline-offset-2": {},
				},
				".title": {
					"@apply text-2xl font-semibold text-accent-2": {},
				},
			});
		}),
		/* Jeg la til den for å fikse menu-knapp på mobilvisning */
		plugin(({ addVariant }) => {
      addVariant('menu-open', '&.menu-open #navigation-menu'); // Definerer .menu-open-varianten
    }),
	],
	theme: {
		extend: {
			colors: {
				accent: "hsl(var(--theme-accent) / <alpha-value>)",
				"accent-2": "hsl(var(--theme-accent-2) / <alpha-value>)",
				bgColor: "hsl(var(--theme-bg) / <alpha-value>)",
				link: "hsl(var(--theme-link) / <alpha-value>)",
				quote: "hsl(var(--theme-quote) / <alpha-value>)",
				textColor: "hsl(var(--theme-text) / <alpha-value>)",
			},
			fontFamily: {
				// Add any custom fonts here
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
			},
			fontSize: {
				base: '1.125rem', // Endrer grunnstørrelse til 18px (fra 16px)
			},
			transitionProperty: {
				height: "height",
			},
			// @ts-expect-error
			// Remove above once tailwindcss exposes theme type
			typography: (theme) => ({
				DEFAULT: {
					css: {
						fontSize: '1.125rem', // Øker typografi grunnstørrelse
            lineHeight: '1.75rem', // Justerer linjehøyde tilsvarende
            p: { fontSize: '1.125rem' }, // Øker skriftstørrelse på avsnitt
						a: {
							"@apply cactus-link": "",
						},
						blockquote: {
							borderLeftWidth: "0",
						},
						code: {
							border: "1px dotted #666",
							borderRadius: "2px",
						},
						kbd: {
							"@apply dark:bg-textColor": "",
						},
						hr: {
							borderTopStyle: "dashed",
						},
						strong: {
							fontWeight: "700",
						},
						sup: {
							"@apply ms-0.5": "",
							a: {
								"&:after": {
									content: "']'",
								},
								"&:before": {
									content: "'['",
								},
								"&:hover": {
									"@apply text-link no-underline bg-none": "",
								},
								"@apply bg-none": "",
							},
						},
						/* Table */
						"tbody tr": {
							borderBottomWidth: "none",
						},
						tfoot: {
							borderTop: "1px dashed #666",
						},
						thead: {
							borderBottomWidth: "none",
						},
						"thead th": {
							borderBottom: "1px dashed #666",
							fontWeight: "700",
						},
						'th[align="center"], td[align="center"]': {
							"text-align": "center",
						},
						'th[align="right"], td[align="right"]': {
							"text-align": "right",
						},
						'th[align="left"], td[align="left"]': {
							"text-align": "left",
						},
						/* Admonitions/Aside */
						".aside": {
							"--admonition-color": "var(--tw-prose-quotes)",
							"@apply my-4 p-4 border-s-2 border-[--admonition-color]": "",
							".aside-title": {
								"@apply font-bold text-base flex items-center gap-2 my-0 text-[--admonition-color]":
									"",
								"&:before": {
									"@apply inline-block shrink-0 overflow-visible h-5 w-5 align-middle content-[''] bg-[--admonition-color]":
										"",
									"mask-size": "contain",
									"mask-position": "center",
									"mask-repeat": "no-repeat",
								},
							},
							".aside-content": {
								"> :last-child": {
									"@apply mb-0": "",
								},
							},
						},	
						...Object.fromEntries(Object.entries(admonitionAliases).map(([type, key]) => {
							const { color, icon } = admonitionThemes[key];
							return [`.aside.aside-${type}`, {
								"--admonition-color": theme(`colors.${color}.600`),
								backgroundColor: `${theme(`colors.${color}.500`)}0d`,
								".aside-title:before": { maskImage: phosphorMask(icon) },
								"&:is(.dark *, [data-theme=dark] *)": {
									"--admonition-color": theme(`colors.${color}.400`),
								},
							}];
						})),
					},
				},
				cactus: {
					css: {
						"--tw-prose-body": theme("colors.textColor / 1"),
						"--tw-prose-bold": theme("colors.textColor / 1"),
						"--tw-prose-bullets": theme("colors.textColor / 1"),
						"--tw-prose-code": theme("colors.textColor / 1"),
						"--tw-prose-headings": theme("colors.accent-2 / 1"),
						"--tw-prose-hr": "0.5px dashed #666",
						"--tw-prose-links": theme("colors.textColor / 1"),
						"--tw-prose-quotes": theme("colors.quote / 1"),
						"--tw-prose-th-borders": "#666",
					},
				},
				sm: {
					css: {
						code: {
							fontSize: theme("fontSize.sm")[0],
							fontWeight: "400",
						},
					},
				},
			}),
		},
	},
} satisfies Config;
