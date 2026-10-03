const STORAGE_KEY = "garden-figpal";
const LIFETIME = 5000;
const MAX_STICKERS = 30;
const nativeArea =
	'figpal-picker, input, textarea, select, [contenteditable]:not([contenteditable="false"]), canvas, video, iframe, dialog, [role="slider"], astro-dev-toolbar';

// Keep familiar click affordances, including SVGs/images nested inside a control.
const clickableArea =
	'a[href], button, summary, [role="button"], [role="link"], [role="tab"], [role="switch"], [role="menuitem"], [data-media-open], .cursor-pointer';

type Sticker = { image: HTMLImageElement; x: number; y: number; timer: number };

class FigPalPicker extends HTMLElement {
	private cleanup?: () => void;

	connectedCallback() {
		this.cleanup?.();
		const controller = new AbortController();
		const { signal } = controller;
		const toggle = this.querySelector<HTMLButtonElement>(".figpal-toggle")!;
		const panel = this.querySelector<HTMLElement>(".figpal-panel")!;
		const choices = [...this.querySelectorAll<HTMLButtonElement>("[data-figpal]")];
		const finePointer = matchMedia("(any-hover: hover) and (any-pointer: fine)");
		let selected = "mushroom";
		try {
			selected = localStorage.getItem(STORAGE_KEY) || selected;
		} catch {
			/* Storage can be disabled. */
		}
		if (!choices.some((choice) => choice.dataset.figpal === selected)) selected = "mushroom";
		let src = "";
		let cursorReady = false;
		let frame = 0;
		let pointerX = 0;
		let pointerY = 0;
		let down: { x: number; y: number; id: number; moved: boolean } | undefined;
		const stickers = new Set<Sticker>();
		const layer = document.createElement("div");
		layer.className = "figpal-layer";
		layer.setAttribute("aria-hidden", "true");
		const pointer = document.createElement("img");
		pointer.className = "figpal-pointer";
		pointer.alt = "";
		pointer.hidden = true;
		layer.append(pointer);
		document.body.append(layer);

		const hidePointer = () => {
			pointer.hidden = true;
			delete document.documentElement.dataset.figpalCursor;
		};
		const removeSticker = (sticker: Sticker) => {
			clearTimeout(sticker.timer);
			sticker.image.remove();
			stickers.delete(sticker);
		};
		const clearStickers = () => {
			for (const sticker of stickers) removeSticker(sticker);
		};
		const paint = () => {
			frame = 0;
			pointer.style.transform = `translate3d(${pointerX - 24}px, ${pointerY - 27}px, 0)`;
			for (const sticker of stickers) {
				sticker.image.style.translate = `${sticker.x - scrollX - 32}px ${sticker.y - scrollY - 36}px`;
			}
		};
		const schedulePaint = () => {
			if (!frame) frame = requestAnimationFrame(paint);
		};
		const select = (id: string) => {
			selected = id;
			src = choices.find((choice) => choice.dataset.figpal === id)?.dataset.src || "";
			cursorReady = false;
			hidePointer();
			if (src) pointer.src = src;
			else {
				pointer.removeAttribute("src");
				clearStickers();
			}
			choices.forEach((choice) =>
				choice.setAttribute("aria-pressed", String(choice.dataset.figpal === id)),
			);
		};
		pointer.addEventListener(
			"load",
			() => {
				cursorReady = true;
			},
			{ signal },
		);
		pointer.addEventListener(
			"error",
			() => {
				cursorReady = false;
				hidePointer();
			},
			{ signal },
		);
		select(selected);

		const positionPanel = () => {
			const rect = toggle.getBoundingClientRect();
			panel.style.left = `${Math.max(12, Math.min(rect.right - panel.offsetWidth, innerWidth - panel.offsetWidth - 12))}px`;
			panel.style.top = `${Math.max(12, Math.min(rect.bottom + 10, innerHeight - panel.offsetHeight - 12))}px`;
		};
		const closePanel = () => panel.hidePopover();
		toggle.disabled = false;
		toggle.addEventListener(
			"click",
			() => {
				if (panel.matches(":popover-open")) closePanel();
				else {
					panel.showPopover();
					positionPanel();
					hidePointer();
					choices
						.find((choice) => choice.dataset.figpal === selected)
						?.focus({ preventScroll: true });
				}
			},
			{ signal },
		);
		panel.addEventListener(
			"toggle",
			() => {
				const open = panel.matches(":popover-open");
				toggle.setAttribute("aria-expanded", String(open));
				if (!open && panel.contains(document.activeElement)) toggle.focus({ preventScroll: true });
			},
			{ signal },
		);
		this.querySelector(".figpal-close")!.addEventListener("click", closePanel, { signal });
		choices.forEach((choice) =>
			choice.addEventListener(
				"click",
				() => {
					select(choice.dataset.figpal!);
					try {
						localStorage.setItem(STORAGE_KEY, selected);
					} catch {
						/* Keep the current-page choice. */
					}
					closePanel();
					toggle.focus({ preventScroll: true });
				},
				{ signal },
			),
		);

		document.addEventListener(
			"pointermove",
			(event) => {
				if (down && Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6)
					down.moved = true;
				if (
					!src ||
					!cursorReady ||
					!finePointer.matches ||
					event.pointerType !== "mouse" ||
					event.buttons ||
					panel.matches(":popover-open") ||
					(event.target as Element).closest(`${nativeArea}, ${clickableArea}`)
				) {
					hidePointer();
					return;
				}
				pointerX = event.clientX;
				pointerY = event.clientY;
				pointer.hidden = false;
				document.documentElement.dataset.figpalCursor = "true";
				schedulePaint();
			},
			{ signal, passive: true },
		);
		document.addEventListener(
			"pointerdown",
			(event) => {
				down =
					event.button === 0
						? { x: event.clientX, y: event.clientY, id: event.pointerId, moved: false }
						: undefined;
			},
			{ signal, passive: true },
		);
		document.addEventListener(
			"pointercancel",
			() => {
				down = undefined;
				hidePointer();
			},
			{ signal },
		);
		document.addEventListener(
			"dragstart",
			() => {
				down = undefined;
				hidePointer();
			},
			{ signal },
		);
		document.addEventListener(
			"click",
			(event) => {
				const start = down;
				down = undefined;
				if (
					!src ||
					!cursorReady ||
					!start ||
					start.moved ||
					!event.detail ||
					event.button !== 0 ||
					event.defaultPrevented ||
					panel.matches(":popover-open")
				)
					return;
				if (
					Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6 ||
					(event.target as Element).closest(nativeArea) ||
					!window.getSelection()?.isCollapsed
				)
					return;
				const image = document.createElement("img");
				image.src = src;
				image.alt = "";
				image.className = "figpal-sticker";
				image.style.setProperty("--sticker-rotation", `${Math.round(Math.random() * 16 - 8)}deg`);
				const sticker: Sticker = {
					image,
					x: scrollX + Math.max(32, Math.min(innerWidth - 32, event.clientX)),
					y: scrollY + event.clientY,
					timer: 0,
				};
				if (stickers.size >= MAX_STICKERS) removeSticker(stickers.values().next().value!);
				stickers.add(sticker);
				layer.prepend(image);
				paint();
				sticker.timer = window.setTimeout(() => removeSticker(sticker), LIFETIME);
			},
			{ signal },
		);
		window.addEventListener(
			"scroll",
			() => {
				if (down) down.moved = true;
				hidePointer();
				schedulePaint();
				if (panel.matches(":popover-open")) positionPanel();
			},
			{ signal, passive: true, capture: true },
		);
		window.addEventListener(
			"resize",
			() => {
				hidePointer();
				schedulePaint();
				if (panel.matches(":popover-open")) positionPanel();
			},
			{ signal },
		);
		document.documentElement.addEventListener("pointerleave", hidePointer, { signal });
		window.addEventListener("blur", hidePointer, { signal });
		document.addEventListener(
			"keydown",
			(event) => {
				if (event.key === "Tab" || event.key === "Escape") hidePointer();
			},
			{ signal },
		);
		document.addEventListener(
			"visibilitychange",
			() => {
				if (document.hidden) {
					hidePointer();
					clearStickers();
				}
			},
			{ signal },
		);
		window.addEventListener(
			"pagehide",
			() => {
				hidePointer();
				clearStickers();
			},
			{ signal },
		);
		finePointer.addEventListener("change", hidePointer, { signal });
		this.cleanup = () => {
			controller.abort();
			cancelAnimationFrame(frame);
			clearStickers();
			hidePointer();
			layer.remove();
		};
	}

	disconnectedCallback() {
		this.cleanup?.();
	}
}
if (!customElements.get("figpal-picker")) customElements.define("figpal-picker", FigPalPicker);
