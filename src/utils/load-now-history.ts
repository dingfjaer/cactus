import seed from "../data/now-history-seed.json";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateNowHistory } from "./now-history";

/** Build input prepared by CI, or explicitly synced for local preview. Never invent past events. */
export function loadNowHistory() {
	try {
		return validateNowHistory(JSON.parse(readFileSync(resolve(".astro/now-history.json"), "utf8")));
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			if (process.env.GITHUB_ACTIONS === "true")
				throw new Error("Prepare now history before building the publication.");
			return validateNowHistory(seed);
		}
		throw error;
	}
}
