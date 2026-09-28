import { nowCalendar } from "@/utils/now-calendar.mjs";

class NowWidget extends HTMLElement {
	private index = 0;
	private playing = true;
	private hovered = false;
	private focused = false;
	private timer?: ReturnType<typeof setTimeout>;
	private clock?: ReturnType<typeof setInterval>;
	private abort?: AbortController;
	private slides: HTMLElement[] = [];

	connectedCallback() {
		this.abort = new AbortController();
		const options = { signal: this.abort.signal };
		this.slides = [...this.querySelectorAll<HTMLElement>("[data-slide]")];
		const reduced = matchMedia("(prefers-reduced-motion: reduce)");
		this.playing = !reduced.matches;
		this.querySelector<HTMLElement>("[data-controls]")!.hidden = false;
		this.setAttribute("data-enhanced", "");
		this.querySelector("[data-previous]")!.addEventListener(
			"click",
			() => this.show(-1, true),
			options,
		);
		this.querySelector("[data-next]")!.addEventListener("click", () => this.show(1, true), options);
		this.querySelector("[data-play]")!.addEventListener(
			"click",
			() => {
				this.playing = !this.playing;
				this.updatePlayback();
			},
			options,
		);
		this.addEventListener(
			"pointerenter",
			() => {
				this.hovered = true;
				this.schedule();
			},
			options,
		);
		this.addEventListener(
			"pointerleave",
			() => {
				this.hovered = false;
				this.schedule();
			},
			options,
		);
		this.addEventListener(
			"focusin",
			() => {
				this.focused = true;
				this.schedule();
			},
			options,
		);
		this.addEventListener(
			"focusout",
			(event) => {
				this.focused = this.contains((event as FocusEvent).relatedTarget as Node | null);
				this.schedule();
			},
			options,
		);
		document.addEventListener(
			"visibilitychange",
			() => {
				this.updateCalendar();
				this.schedule();
			},
			options,
		);
		reduced.addEventListener(
			"change",
			() => {
				if (reduced.matches) {
					this.playing = false;
					this.updatePlayback();
				}
			},
			options,
		);
		this.updateCalendar();
		this.clock = setInterval(() => this.updateCalendar(), 60000);
		this.updatePlayback();
	}
	private show(direction: number, announce = false) {
		this.index = (this.index + direction + this.slides.length) % this.slides.length;
		this.slides.forEach((slide, index) => {
			slide.hidden = index !== this.index;
		});
		this.querySelector("[data-count]")!.textContent =
			`${String(this.index + 1).padStart(2, "0")} / ${String(this.slides.length).padStart(2, "0")}`;
		if (announce)
			this.querySelector("[data-announcement]")!.textContent = this.slides[this.index].innerText;
		this.schedule();
	}
	private schedule() {
		clearTimeout(this.timer);
		if (this.playing && !this.hovered && !this.focused && !document.hidden)
			this.timer = setTimeout(() => this.show(1), 5000);
	}
	private updatePlayback() {
		this.querySelector("[data-play]")!.setAttribute(
			"aria-label",
			this.playing ? "Sett automatisk bytte på pause" : "Start automatisk bytte",
		);
		this.querySelector("[data-pause-icon]")!.toggleAttribute("hidden", !this.playing);
		this.querySelector("[data-play-icon]")!.toggleAttribute("hidden", this.playing);
		this.dataset.playing = String(this.playing);
		this.schedule();
	}
	private updateCalendar() {
		const value = nowCalendar();
		this.querySelector("[data-tintin-age]")!.textContent = value.age;
		this.querySelector("[data-year]")!.textContent = String(value.year);
		this.querySelector("[data-percent]")!.textContent = `${Math.round(value.progress * 100)} %`;
		const track = this.querySelector<HTMLElement>(".year-track")!;
		track.title = value.dateLabel;
		track.setAttribute("aria-label", `Året ${value.year}`);
		track.setAttribute("aria-valuenow", String(Math.round(value.progress * 100)));
		track.setAttribute("aria-valuetext", value.dateLabel);
		this.querySelector<HTMLElement>(".year-fill")!.style.width = `${value.progress * 100}%`;
		const date = this.querySelector<HTMLTimeElement>(".now-date")!;
		date.dateTime = value.day;
		date.textContent = value.dateLabel;
	}
	disconnectedCallback() {
		this.abort?.abort();
		clearTimeout(this.timer);
		clearInterval(this.clock);
	}
}
if (!customElements.get("now-widget")) customElements.define("now-widget", NowWidget);
