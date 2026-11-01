// Rediger title/detail her. Publiser som vanlig via main; CI arkiverer endrede temaer.
// Behold key-verdiene. Historikken lagres automatisk på branchen now-history etter vellykket deploy.
// Tintins alder er automatisk og inngår ikke i de fem tidslinjene.
// Lokal historikk: pnpm now:sync. Les scripts/now-history.md for arbeidsflyten.
export const nowItems = [
	{ key: "doing", label: "Driver med", title: "Klar for ferie.", detail: "Wuhan, Chongqing, Beijing" },
	{ key: "listening", label: "Hører på", title: "Sehnsucht", detail: "Rammstein" },
	{ key: "reading", label: "Leser", title: "Homo Deus", detail: "En kort historie om i morgen" },
	{
		key: "watching",
		label: "Ser på",
		title: "Mission impossible 1-6",
		detail: "Bakeskolen, TV2",
	},
	{ key: "finished", label: "Sett ferdig", title: "Slow Horses" , detail: "Sesong 6" },
	{ key: "tintin", label: "Tintin", title: "", detail: "Litt større for hver dag" },
] as const;
