const clamp = (value) => Math.max(0, Math.min(1, value));

// Hold each complete drawing briefly; scroll back through the identical reveal.
function portraitProgress(scroll, start, distance) {
	const t = clamp(((scroll - start) / Math.max(1, distance) - 0.1) / 0.8);
	return t * t * (3 - 2 * t);
}

class AboutPortrait extends HTMLElement {
	connectedCallback() {
		this.abort = new AbortController();
		this.section = this.querySelector(".portrait-section");
		this.scene = this.querySelector(".portrait-scene");
		this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
		this.visual = null;
		this.schedule = () => {
			if (!this.frame) this.frame = requestAnimationFrame((time) => this.tick(time));
		};
		const options = { passive: true, signal: this.abort.signal };
		window.addEventListener("scroll", this.schedule, options);
		window.addEventListener("resize", this.schedule, options);
		window.addEventListener("pageshow", this.schedule, options);
		this.reduced.addEventListener("change", this.schedule, options);
		this.resizeObserver = new ResizeObserver(this.schedule);
		this.resizeObserver.observe(this.section);
		this.setAttribute("data-enhanced", "");
		this.schedule();
	}

	tick(time) {
		this.frame = 0;
		this.toggleAttribute("data-reduced", this.reduced.matches);
		const section = this.section.getBoundingClientRect();
		const scene = this.scene.getBoundingClientRect();
		const inset = parseFloat(getComputedStyle(this.scene).top) || 0;
		const start = section.top + window.scrollY - inset;
		const target = this.reduced.matches
			? 1
			: portraitProgress(window.scrollY, start, section.height - scene.height);
		const dt = Math.min(64, this.lastTime ? time - this.lastTime : 16);
		this.lastTime = time;
		this.visual =
			this.visual === null || this.reduced.matches || Math.abs(target - this.visual) < 0.0001
				? target
				: this.visual + (target - this.visual) * (1 - Math.exp(-dt / 320));
		this.scene.style.setProperty("--reveal", String(this.visual));
		this.scene.style.setProperty("--edge", String(Math.sin(this.visual * Math.PI) * 0.65));
		if (this.visual !== target) this.schedule();
		else this.lastTime = 0;
	}

	disconnectedCallback() {
		this.abort?.abort();
		this.resizeObserver?.disconnect();
		cancelAnimationFrame(this.frame);
	}
}

if (!customElements.get("about-portrait")) customElements.define("about-portrait", AboutPortrait);
