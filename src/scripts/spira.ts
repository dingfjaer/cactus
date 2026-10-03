import { createDingoRoll } from "./dingo-roll";
import { rollDie } from "../utils/dingo";
import { contentFilter, drawPosts, restoreDraw, type ContentFilter } from "../utils/spira";

class SpiraExplorer extends HTMLElement {
	private cleanup?: () => void;
	connectedCallback() {
		this.cleanup?.();
		const controller = new AbortController();
		const { signal } = controller;
		const get = <T extends HTMLElement = HTMLElement>(selector: string) =>
			this.querySelector<T>(selector)!;
		const template = get<HTMLTemplateElement>("template[data-posts]");
		const rows = [...template.content.querySelectorAll<HTMLLIElement>("li[data-id]")];
		const results = get("[data-results]");
		const roll = createDingoRoll(this, results, get("[data-status]"), signal);
		const filters = [...this.querySelectorAll<HTMLButtonElement>("[data-filter]")];
		const initialPath = location.pathname;
		const initialPage = Number(this.dataset.page) || 1;
		let filter: ContentFilter = "alle";
		let dingo = false;
		let page = 1;
		let ids: string[] = [];
		const pool = () => rows.filter((row) => filter === "alle" || row.dataset.type === filter);
		const viewKey = `spira-view-v1:${this.dataset.base}`;
		const key = () => `spira-dingo-v1:${this.dataset.base}:${filter}`;
		const saveDraw = () => {
			try {
				sessionStorage.setItem(key(), JSON.stringify(ids));
			} catch {
				/* History still preserves the current draw. */
			}
		};
		const readDraw = () => {
			try {
				return JSON.parse(sessionStorage.getItem(key()) || "null");
			} catch {
				return null;
			}
		};
		const remember = (push: boolean) => {
			const url = new URL(this.dataset.base!, location.origin);
			if (filter !== "alle") url.searchParams.set("type", filter);
			if (dingo) url.searchParams.set("dingo", "1");
			else if (page > 1) url.searchParams.set("side", String(page));
			const state = { ...history.state, spira: { filter, ids: dingo ? ids : [] } };
			if (push) history.pushState(state, "", url);
			else history.replaceState(state, "", location.href);
			try {
				sessionStorage.setItem(
					viewKey,
					JSON.stringify({ url: url.pathname + url.search, spira: state.spira }),
				);
			} catch {
				/* Back/forward still uses history state. */
			}
		};
		const render = () => {
			const available = pool();
			const pages = Math.max(1, Math.ceil(available.length / 10));
			page = Math.max(1, Math.min(pages, page));
			const selected = dingo
				? ids.map((id) => available.find((row) => row.dataset.id === id)!).filter(Boolean)
				: available.slice((page - 1) * 10, page * 10);
			filters.forEach((button) =>
				button.setAttribute("aria-pressed", String(button.dataset.filter === filter)),
			);
			const copy =
				filter === "dingaling"
					? ["NerDing", "Egne tanker, små oppdagelser og notater i vekst."]
					: ["KI-oppsummert", "Fagstoff jeg har utforsket, lest og oppsummert med hjelp av KI."];
			get("[data-description]").hidden = filter === "alle";
			get("[data-filter-title]").textContent = copy[0];
			get("[data-filter-description]").textContent = copy[1];
			get("[data-dingo]").hidden = !dingo;
			const count = String(selected.length);
			get("[data-dingo-title]").textContent =
				`Dingo! ${count} ${selected.length === 1 ? "tilfeldig funn" : "tilfeldige funn"} fra hagen.`;
			get("[data-pagination]").hidden = dingo || pages <= 1;
			get<HTMLButtonElement>("[data-prev]").disabled = page <= 1;
			get<HTMLButtonElement>("[data-next]").disabled = page >= pages;
			get("[data-page-label]").textContent = `Side ${page} av ${pages}`;
			get<HTMLButtonElement>("[data-draw]").disabled = available.length === 0;
			get<HTMLButtonElement>("[data-again]").disabled = available.length === 0;
			const fragment = document.createDocumentFragment();
			let group = "";
			let list: HTMLUListElement;
			for (const row of selected) {
				const nextGroup = dingo
					? "dingo"
					: row.dataset.pinned === "true"
						? "pinned"
						: row.dataset.year!;
				if (nextGroup !== group) {
					group = nextGroup;
					if (group !== "dingo" && group !== "pinned") {
						const heading = document.createElement("h2");
						heading.className = "title text-lg";
						heading.textContent = group;
						fragment.append(heading);
					}
					list = document.createElement("ul");
					list.className = "mb-8 mt-6 space-y-8 text-start";
					fragment.append(list);
				}
				const clone = row.cloneNode(true) as HTMLLIElement;
				if (dingo) clone.querySelector('[aria-label="Festet innlegg"]')?.remove();
				list!.append(clone);
			}
			if (!selected.length) {
				const empty = document.createElement("p");
				empty.textContent = "Ingen innlegg her ennå. Det spirer snart.";
				fragment.append(empty);
			}
			results.replaceChildren(fragment);
			get("[data-status]").textContent = dingo
				? `Dingo: ${selected.length} tilfeldige innlegg.`
				: `${available.length} innlegg. Side ${page} av ${pages}.`;
		};
		const readLocation = () => {
			roll.cancel();
			const params = new URLSearchParams(location.search);
			filter = contentFilter(params.get("type"));
			dingo = params.get("dingo") === "1";
			const requested = Number(
				params.get("side") || (location.pathname === initialPath ? initialPage : 1),
			);
			page = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
			if (dingo) {
				const available = pool().map((row) => row.dataset.id!);
				const saved = history.state?.spira;
				ids =
					restoreDraw(saved?.filter === filter ? saved.ids : null, available) ||
					restoreDraw(readDraw(), available) ||
					drawPosts(available, Math.random, rollDie());
				saveDraw();
			}
			render();
			remember(false);
		};
		const update = () => {
			render();
			remember(true);
		};
		filters.forEach((button) =>
			button.addEventListener(
				"click",
				() => {
					filter = contentFilter(button.dataset.filter);
					dingo = false;
					page = 1;
					update();
				},
				{ signal },
			),
		);
		const draw = () => {
			if (roll.busy || !pool().length) return;
			const value = rollDie();
			const drawn = drawPosts(
				pool().map((row) => row.dataset.id!),
				Math.random,
				value,
			);
			roll.start(value, () => {
				ids = drawn;
				dingo = true;
				saveDraw();
				update();
			});
		};
		get("[data-draw]").addEventListener("click", draw, { signal });
		get("[data-again]").addEventListener("click", draw, { signal });
		get("[data-latest]").addEventListener(
			"click",
			() => {
				dingo = false;
				page = 1;
				update();
				get<HTMLButtonElement>("[data-draw]").focus();
			},
			{ signal },
		);
		const turnPage = (change: number) => {
			page += change;
			update();
			this.scrollIntoView({ block: "start", behavior: "instant" });
		};
		get("[data-prev]").addEventListener("click", () => turnPage(-1), { signal });
		get("[data-next]").addEventListener("click", () => turnPage(1), { signal });
		window.addEventListener("popstate", readLocation, { signal });
		// Returning through the Spira navigation also keeps the last view in this tab.
		if (initialPage === 1 && !location.search && !history.state?.spira) {
			try {
				const saved = JSON.parse(sessionStorage.getItem(viewKey) || "null");
				if (saved && typeof saved.url === "string") {
					const url = new URL(saved.url, location.origin);
					if (url.origin === location.origin && url.pathname === this.dataset.base) {
						history.replaceState({ ...history.state, spira: saved.spira }, "", url);
					}
				}
			} catch {
				/* Start with the normal newest list if storage is unavailable. */
			}
		}
		readLocation();
		get("[data-enhanced]").hidden = false;
		get("[data-fallback]").hidden = true;
		this.cleanup = () => {
			roll.cancel();
			controller.abort();
		};
	}
	disconnectedCallback() {
		this.cleanup?.();
	}
}
if (!customElements.get("spira-explorer")) customElements.define("spira-explorer", SpiraExplorer);
