import { masonryImageSizes, gridImageSizes } from "../utils/gallery-layout";
import { rollDie, sampleItems } from "../utils/dingo";
import { restoreDraw } from "../utils/spira";
import { createDingoRoll } from "./dingo-roll";

type MediaFilter = "all" | "image" | "video";
const mediaFilter = (value: unknown): MediaFilter =>
	value === "image" || value === "video" ? value : "all";
class DingoGallery extends HTMLElement {
	private cleanup?: () => void;
	connectedCallback() {
		this.cleanup?.();
		const controller = new AbortController();
		const { signal } = controller;
		const get = <T extends HTMLElement = HTMLElement>(selector: string) =>
			this.querySelector<T>(selector)!;
		const figures = [...this.querySelectorAll<HTMLElement>("[data-media-kind]")];
		const buttons = [...this.querySelectorAll<HTMLButtonElement>("[data-filter-choice]")];
		const grid = this.querySelector<HTMLElement>(".photo-gallery");
		const drawButton = get<HTMLButtonElement>("[data-draw]");
		const status = get("[data-status]");
		const roll = createDingoRoll(this, grid ?? this, status, signal);
		let filter: MediaFilter = "all";
		let ids: string[] | null = null;
		let value = 0;
		const key = `gallery-dingo-v1:${location.pathname}:${this.dataset.gallery}`;
		const pool = () => figures.filter((f) => filter === "all" || f.dataset.mediaKind === filter);
		try {
			const saved = JSON.parse(sessionStorage.getItem(key) || "null");
			filter = mediaFilter(saved?.filter);
			if (saved?.ids && Number.isInteger(saved.value) && saved.value >= 1 && saved.value <= 6) {
				ids = restoreDraw(
					saved.ids,
					pool().map((f) => f.dataset.mediaId!),
				);
				if (ids?.length !== Math.min(saved.value, pool().length)) ids = null;
				value = saved.value;
			}
		} catch {
			/* A blocked store simply starts with the complete gallery. */
		}
		const render = () => {
			const available = pool();
			const selected = ids
				? ids.map((id) => available.find((f) => f.dataset.mediaId === id)!).filter(Boolean)
				: available;
			this.dataset.filter = filter;
			buttons.forEach((b) =>
				b.setAttribute("aria-pressed", String(b.dataset.filterChoice === filter)),
			);
			figures.forEach((f) => {
				f.hidden = !selected.includes(f);
			});
			// Move existing figures, preserving media handlers and the draw's reading order.
			grid?.append(...selected, ...figures.filter((f) => f.hidden));
			if (grid?.classList.contains("masonry")) {
				grid.style.setProperty("--columns", String(Math.max(1, Math.min(3, selected.length))));
				grid.style.setProperty(
					"--tablet-columns",
					String(Math.max(1, Math.min(2, selected.length))),
				);
				grid.querySelectorAll("img").forEach((img) => {
					img.sizes = filter === "video" ? gridImageSizes : masonryImageSizes(selected.length);
				});
			}
			get("[data-dingo]").hidden = ids === null;
			const found =
				selected.length === 1 ? "1 tilfeldig funn" : `${selected.length} tilfeldige funn`;
			get("[data-dingo-title]").textContent =
				`Dingo! Du kastet ${value} – ${found}.` +
				(ids && selected.length < value ? " Det er alle som finnes i dette filteret." : "");
			const empty = get(".filter-empty");
			empty.hidden = !!selected.length || !figures.length;
			empty.textContent =
				filter === "video"
					? "Ingen videoer i dette albumet ennå."
					: "Ingen bilder i dette albumet ennå.";
			drawButton.disabled = !available.length;
			get<HTMLButtonElement>("[data-again]").disabled = !available.length;
			status.textContent = ids
				? `Du kastet ${value}. Viser ${found}.`
				: `${available.length} bilder og videoer.`;
			try {
				sessionStorage.setItem(key, JSON.stringify({ filter, ids, value }));
			} catch {
				/* The current page still works. */
			}
		};
		const draw = () => {
			if (roll.busy || !pool().length) return;
			const next = rollDie();
			const selected = sampleItems(pool(), next).map((f) => f.dataset.mediaId!);
			roll.start(next, () => {
				value = next;
				ids = selected;
				render();
			});
		};
		drawButton.addEventListener("click", draw, { signal });
		get("[data-again]").addEventListener("click", draw, { signal });
		get("[data-latest]").addEventListener(
			"click",
			() => {
				ids = null;
				render();
				drawButton.focus();
			},
			{ signal },
		);
		buttons.forEach((b) =>
			b.addEventListener(
				"click",
				() => {
					roll.cancel();
					filter = mediaFilter(b.dataset.filterChoice);
					ids = null;
					render();
				},
				{ signal },
			),
		);
		render();
		drawButton.hidden = false;
		this.cleanup = () => controller.abort();
	}
	disconnectedCallback() {
		this.cleanup?.();
	}
}
if (!customElements.get("dingo-gallery")) customElements.define("dingo-gallery", DingoGallery);
