const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
	const t = clamp(value);
	return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const MORPH_START = 0.16;
const RAINBOW_STEPS = new Set([0, 1, 2, 3, 7, 8, 9, 10, 16, 17, 18, 19]);
let rainbowId = 0;

// The rainbow enters from the left, then stays centred across the finished glyph.
function rainbowBand(progress) {
	const left = mix(-1.2, -0.1, clamp(progress));
	return { left, right: left + 1.2 };
}
// Use the existing pause after the final highlight to restore black before morphing.
function rainbowReset(afterReading, pinned, reduced) {
	return reduced ? 1 : pinned ? smooth(afterReading / MORPH_START) : 0;
}
const SVG_NS = "http://www.w3.org/2000/svg";

// Pair each closed contour of the font glyph with its contour in the original logo.
// Equal arc-length samples allow the outlines to change shape as well as position.
function prepareMorph(source, targetData, svg) {
	const temporary = document.createElementNS(SVG_NS, "path");
	temporary.style.visibility = "hidden";
	svg.append(temporary);
	const sample = (data) => {
		temporary.setAttribute("d", data);
		const bounds = temporary.getBBox();
		const contours = data.match(/M[^M]*/gi) ?? [];
		return {
			bounds,
			contours: contours.map((contour) => {
				temporary.setAttribute("d", contour);
				const length = temporary.getTotalLength();
				return Array.from({ length: 160 }, (_, i) => {
					const point = temporary.getPointAtLength((length * i) / 160);
					return [(point.x - bounds.x) / bounds.width, (point.y - bounds.y) / bounds.height];
				});
			}),
		};
	};
	const from = sample(source.getAttribute("d"));
	const to = sample(targetData);
	temporary.remove();
	if (from.contours.length !== to.contours.length) throw new Error("Incompatible name contours");
	const contours = from.contours.map((points, index) => {
		const target = to.contours[index];
		let best = target,
			score = Infinity;
		for (const direction of [1, -1]) {
			for (let offset = 0; offset < target.length; offset++) {
				const aligned = points.map(
					(_, i) => target[(offset + direction * i + target.length) % target.length],
				);
				const distance = points.reduce(
					(sum, p, i) => sum + (p[0] - aligned[i][0]) ** 2 + (p[1] - aligned[i][1]) ** 2,
					0,
				);
				if (distance < score) {
					best = aligned;
					score = distance;
				}
			}
		}
		return { from: points, to: best };
	});
	return {
		bounds: to.bounds,
		sourceBounds: from.bounds,
		path: (progress) =>
			contours
				.map(
					({ from: points, to: target }) =>
						points
							.map(
								(point, i) =>
									`${i ? "L" : "M"}${mix(point[0], target[i][0], progress).toFixed(5)},${mix(point[1], target[i][1], progress).toFixed(5)}`,
							)
							.join("") + "Z",
				)
				.join(""),
	};
}

// Non-overlapping ranges keep the reading order identical in both directions.
function readingSchedule({ pinned, sectionTop, height, anchors, maxScroll }) {
	const ranges = [];
	let cursor = sectionTop - height * 0.18;
	for (let step = 0; step < anchors.length; step++) {
		const letter = RAINBOW_STEPS.has(step);
		const duration = height * (letter ? 0.085 : 0.18) * (pinned ? 1 : 0.85);
		// Consecutive letters form one wave; pauses only separate reading beats.
		const gap = step && !(letter && RAINBOW_STEPS.has(step - 1)) ? height * 0.025 : 0;
		const desired = pinned ? cursor + gap : Math.max(0, anchors[step] - height * 0.78);
		const start = Math.max(desired, step ? ranges[step - 1].end + gap : 0);
		ranges.push({ start, end: start + duration });
		cursor = start + duration;
	}
	// On short pages, compress the whole sequence uniformly, retaining every gap.
	if (!pinned && ranges.at(-1).end > maxScroll) {
		const origin = Math.min(ranges[0].start, Math.max(0, maxScroll - height));
		const scale = Math.max(1, maxScroll - origin) / (ranges.at(-1).end - origin);
		return ranges.map(({ start, end }) => ({
			start: origin + (start - origin) * scale,
			end: origin + (end - origin) * scale,
		}));
	}
	return ranges;
}

// The complete reading sequence and a short pause precede the desktop morph.
function nameTimeline(distance) {
	return {
		merge: smooth((distance - MORPH_START) / 0.6),
		stamp: smooth((distance - 0.76) / 0.18),
		lift: smooth((distance - 1.11) / 0.6),
	};
}

// Finish the morph before moving the viewport to the portrait preview.
function shortcutScroll(elapsed, from, morphEnd, destination) {
	const morphDuration = from < morphEnd ? 2200 : 0;
	if (elapsed < morphDuration) {
		return { top: mix(from, morphEnd, smooth(elapsed / morphDuration)), done: false };
	}
	const progress = clamp((elapsed - morphDuration) / 900);
	return {
		top: mix(Math.max(from, morphEnd), destination, smooth(progress)),
		done: progress === 1,
	};
}

// Invert portraitProgress: account for its 10% lead-in and smoothstep easing.
// This reveals 10% of the image, rather than advancing 10% of the scroll runway.
function portraitPreviewOffset(distance) {
	const reveal = 0.1;
	const easedPosition = 0.5 - Math.sin(Math.asin(1 - 2 * reveal) / 3);
	return Math.max(0, distance) * (0.1 + 0.8 * easedPosition);
}

const LOGO = { x: 657.38, y: 147.229, width: 415.69, height: 721.05 };
function glyphInLogo(bounds, logo) {
	return {
		left: logo.left + ((bounds.x - LOGO.x) / LOGO.width) * logo.width,
		top: logo.top + ((bounds.y - LOGO.y) / LOGO.width) * logo.width,
		width: (bounds.width / LOGO.width) * logo.width,
		height: (bounds.height / LOGO.width) * logo.width,
	};
}

class AboutName extends HTMLElement {
	connectedCallback() {
		this.abort = new AbortController();
		this.section = this.querySelector(".name-section");
		this.scene = this.querySelector(".name-scene");
		this.grid = this.querySelector(".name-grid");
		this.mark = this.querySelector(".name-mark");
		this.markImage = this.mark.querySelector("img");
		this.flight = this.querySelector(".name-flight");
		this.reduced = matchMedia("(prefers-reduced-motion: reduce)");
		this.pinned = matchMedia("(min-width: 900px) and (min-height: 700px)");
		this.letters = ["d", "c"].map((letter) => {
			const source = this.querySelector(`[data-letter="${letter}"]`);
			const flight = this.querySelector(`[data-flight="${letter}"]`);
			return { source, flight, morph: prepareMorph(source, flight.dataset.target, this.flight) };
		});
		// A small typographic inset puts c exactly below its final centre inside d.
		// This is in the SVG's font units, so the alignment survives every breakpoint.
		const [d, c] = this.letters.map((letter) => letter.morph);
		const centre =
			d.sourceBounds.x +
			((c.bounds.x + c.bounds.width / 2 - d.bounds.x) / d.bounds.width) * d.sourceBounds.width;
		this.querySelector("[data-chen-align]").setAttribute(
			"transform",
			`translate(${centre - c.sourceBounds.x - c.sourceBounds.width / 2} 0)`,
		);
		this.reveals = [...this.querySelectorAll("[data-reveal]")];
		this.highlights = [...this.querySelectorAll("[data-highlight]")];
		this.steps = Array.from({ length: 22 }, (_, step) => {
			const element = this.querySelector(
				`[data-rainbow="${step}"], [data-reveal="${step}"], [data-highlight="${step}"]`,
			);
			return element.hasAttribute("data-rainbow")
				? element.closest(".name-word")
				: element.hasAttribute("data-reveal")
					? element.parentElement
					: element;
		});
		this.rainbow = [...this.querySelectorAll("[data-rainbow]")].map((element) => {
			const svg = element.ownerSVGElement;
			let defs = svg.querySelector("defs[data-rainbow-defs]");
			if (!defs) {
				defs = document.createElementNS(SVG_NS, "defs");
				defs.setAttribute("data-rainbow-defs", "");
				svg.prepend(defs);
			}
			const gradient = document.createElementNS(SVG_NS, "linearGradient");
			gradient.id = `name-rainbow-${++rainbowId}`;
			gradient.setAttribute("y1", "0");
			gradient.setAttribute("y2", "0");
			const stops = [
				"#181a1b",
				"#e53945",
				"#f28c28",
				"#edbd24",
				"#45a765",
				"#249dd8",
				"#7652cc",
				"#cd48a0",
				"#181a1b",
			].map((color, i, colors) => {
				const stop = document.createElementNS(SVG_NS, "stop");
				stop.setAttribute("offset", String(i / (colors.length - 1)));
				stop.setAttribute("stop-color", color);
				gradient.append(stop);
				return {
					stop,
					channels: color.match(/[0-9a-f]{2}/gi).map((channel) => parseInt(channel, 16)),
				};
			});
			defs.append(gradient);
			element.style.fill = `url(#${gradient.id})`;
			return { element, gradient, stops, step: Number(element.dataset.rainbow) };
		});
		this.rainbowReset = null;
		this.nextButton = this.querySelector("[data-name-next]");
		this.topButton = this.querySelector("[data-name-top]");
		this.chenTail = this.querySelector(".name-chen text");
		this.visualScroll = window.scrollY;
		this.schedule = () => {
			if (!this.frame) this.frame = requestAnimationFrame((time) => this.tick(time));
		};
		const options = { passive: true, signal: this.abort.signal };
		this.nextButton.addEventListener("click", () => this.skipReading(), options);
		this.topButton.addEventListener(
			"click",
			() => {
				this.stopAutoplay();
				window.scrollTo({ top: 0, behavior: this.reduced.matches ? "instant" : "smooth" });
				const heading = document.querySelector("#main-header a");
				heading?.focus({ preventScroll: true });
			},
			options,
		);
		const interrupt = () => this.stopAutoplay();
		window.addEventListener("wheel", interrupt, options);
		window.addEventListener("touchstart", interrupt, options);
		window.addEventListener("pointerdown", interrupt, options);
		window.addEventListener(
			"keydown",
			(event) => {
				if (
					[
						"Escape",
						"ArrowUp",
						"ArrowDown",
						"PageUp",
						"PageDown",
						"Home",
						"End",
						" ",
						"Tab",
					].includes(event.key)
				)
					interrupt();
			},
			options,
		);
		window.addEventListener("resize", interrupt, options);
		this.reduced.addEventListener("change", interrupt, options);
		this.pinned.addEventListener("change", interrupt, options);
		window.addEventListener("scroll", this.schedule, options);
		window.addEventListener("resize", this.schedule, options);
		window.addEventListener("pageshow", this.schedule, options);
		this.reduced.addEventListener("change", this.schedule, options);
		this.pinned.addEventListener("change", this.schedule, options);
		this.resizeObserver = new ResizeObserver(this.schedule);
		this.resizeObserver.observe(this.scene);
		this.setAttribute("data-enhanced", "");
		document.fonts.ready.then(() => {
			if (this.isConnected) this.schedule();
		});
		this.schedule();
	}

	readingRanges() {
		const section = this.section.getBoundingClientRect();
		const height = window.innerHeight;
		const pinned = this.pinned.matches && !this.reduced.matches;
		return readingSchedule({
			pinned,
			sectionTop: section.top + window.scrollY,
			height,
			anchors: this.steps.map((element) => element.getBoundingClientRect().top + window.scrollY),
			maxScroll: Math.max(
				1,
				Math.min(
					document.documentElement.scrollHeight - height - 16,
					section.bottom + window.scrollY - height * 0.35,
				),
			),
		});
	}

	skipDestination(ranges = this.readingRanges()) {
		const portrait = document.querySelector(".portrait-section");
		const scene = portrait?.querySelector(".portrait-scene");
		const inset = scene ? parseFloat(getComputedStyle(scene).top) || 0 : 0;
		const previewOffset =
			portrait && scene && !this.reduced.matches
				? portraitPreviewOffset(
						portrait.getBoundingClientRect().height - scene.getBoundingClientRect().height,
					)
				: 0;
		return {
			top: portrait
				? portrait.getBoundingClientRect().top + window.scrollY - inset + previewOffset
				: ranges.at(-1).end,
			element: portrait ?? this.section,
		};
	}

	stopAutoplay() {
		if (!this.autoplay) return;
		this.autoplay = null;
		this.schedule();
	}

	focusDestination(element) {
		element.setAttribute("tabindex", "-1");
		element.focus({ preventScroll: true });
	}

	skipReading() {
		if (this.autoplay) return;
		const ranges = this.readingRanges();
		const destination = this.skipDestination(ranges);
		const top = Math.max(
			0,
			Math.min(destination.top, document.documentElement.scrollHeight - window.innerHeight),
		);
		const pinned = this.pinned.matches && !this.reduced.matches;
		const from = pinned
			? Math.min(
					top,
					Math.max(window.scrollY, ranges.at(-1).end + window.innerHeight * MORPH_START),
				)
			: top;
		// Bypass reading immediately, then play only the morph and the journey to the portrait.
		window.scrollTo({ top: from, behavior: "instant" });
		this.visualScroll = window.scrollY;
		this.lastTime = 0;
		if (pinned) {
			this.autoplay = {
				from: window.scrollY,
				morphEnd: Math.min(top, ranges.at(-1).end + window.innerHeight * 1.71),
				top,
				element: destination.element,
				started: null,
			};
		} else this.focusDestination(destination.element);
		this.render();
		this.schedule();
	}

	tick(time) {
		this.frame = 0;
		if (this.autoplay) {
			const playback = this.autoplay;
			playback.started ??= time;
			const position = shortcutScroll(
				time - playback.started,
				playback.from,
				playback.morphEnd,
				playback.top,
			);
			window.scrollTo({ top: position.top, behavior: "instant" });
			this.visualScroll = window.scrollY;
			if (position.done) {
				this.autoplay = null;
				this.focusDestination(playback.element);
			}
			this.render();
			this.lastTime = 0;
			if (this.autoplay) this.schedule();
			return;
		}
		const dt = Math.min(64, this.lastTime ? time - this.lastTime : 16);
		this.lastTime = time;
		const difference = window.scrollY - this.visualScroll;
		// Ease only the artwork. Native wheel/touch scrolling is never intercepted.
		this.visualScroll =
			this.reduced.matches || Math.abs(difference) < 0.25
				? window.scrollY
				: mix(this.visualScroll, window.scrollY, 1 - Math.exp(-dt / 320));
		this.render();
		if (this.visualScroll !== window.scrollY) this.schedule();
		else this.lastTime = 0;
	}

	render() {
		const reduced = this.reduced.matches;
		this.toggleAttribute("data-reduced", reduced);
		const pinned = this.pinned.matches && !reduced;
		const section = this.section.getBoundingClientRect();
		const scene = this.scene.getBoundingClientRect();
		const height = window.innerHeight;
		const lag = reduced ? 0 : window.scrollY - this.visualScroll;
		const [d, c] = this.letters;
		const rect = (element) => {
			const b = element.getBoundingClientRect();
			return {
				left: b.left,
				top: b.top + (pinned ? -scene.top : lag),
				width: b.width,
				height: b.height,
			};
		};
		const dSource = rect(d.source),
			cSource = rect(c.source);
		const schedule = this.readingRanges();
		const destination = this.skipDestination(schedule);
		this.toggleAttribute(
			"data-shortcuts",
			section.top < height * 0.7 && window.scrollY > height * 0.3,
		);
		this.nextButton.hidden = window.scrollY >= destination.top - 2;
		this.nextButton.disabled = Boolean(this.autoplay);
		const nextLabel = pinned
			? "Spill logo-animasjonen og gå til portrettet"
			: "Hopp til portrettet";
		this.nextButton.setAttribute("aria-label", nextLabel);
		this.nextButton.title = nextLabel;
		const progress = schedule.map(({ start, end }) =>
			reduced ? 1 : smooth((this.visualScroll - start) / (end - start)),
		);
		const afterReading = (this.visualScroll - schedule.at(-1).end) / height;
		let complete = afterReading >= 0;
		if (reduced) {
			const after = document.documentElement.scrollHeight - (window.scrollY + section.bottom);
			complete = section.bottom <= Math.max(0, height - after) + 24;
		}
		const { merge, stamp, lift } = pinned
			? nameTimeline(afterReading)
			: { merge: 0, stamp: complete ? 1 : 0, lift: complete ? 1 : 0 };
		const dAnchor = {
			...dSource,
			top: dSource.top,
		};
		const assembled = {
			left: dAnchor.left,
			top: dAnchor.top - ((d.morph.bounds.y - LOGO.y) / d.morph.bounds.width) * dAnchor.width,
			width: (dAnchor.width * LOGO.width) / d.morph.bounds.width,
		};
		const axis = assembled.left + assembled.width / 2;
		const width = mix(assembled.width, window.innerWidth < 700 ? 44 : 48, lift);
		const logo = { left: axis - width / 2, top: mix(assembled.top, 16, lift), width };
		const cDestination = glyphInLogo(c.morph.bounds, assembled);
		const dDestination = glyphInLogo(d.morph.bounds, logo);
		this.chenTail.style.opacity = "1";
		const active = pinned ? merge > 0 : complete;
		this.mark.toggleAttribute("data-active", active);
		this.mark.toggleAttribute("data-complete", lift >= 0.999);
		this.mark.style.left = `${logo.left}px`;
		this.mark.style.top = `${logo.top}px`;
		this.mark.style.width = `${logo.width}px`;
		this.mark.style.opacity = String(stamp);
		this.markImage.style.opacity = "1";
		this.mark.tabIndex = lift >= 0.999 ? 0 : -1;
		this.mark.setAttribute("aria-hidden", lift >= 0.999 ? "false" : "true");
		this.grid.style.opacity = String(pinned ? 1 - smooth((afterReading - 0.16) / 0.58) : 1);

		this.letters.forEach(({ source, flight, morph }, index) => {
			const detached = pinned && merge > 0;
			source.style.opacity = detached ? "0" : "1";
			flight.style.opacity = detached ? String(1 - stamp) : "0";
			if (!detached || stamp >= 1) return;
			// c scales around its fixed centre as it rises into d, which stays still.
			const cWidth = mix(cSource.width, cDestination.width, merge);
			const box =
				index === 0
					? dDestination
					: {
							left: cDestination.left + cDestination.width / 2 - cWidth / 2,
							top: mix(cSource.top, cDestination.top, merge),
							width: cWidth,
							height: mix(cSource.height, cDestination.height, merge),
						};
			flight.setAttribute("d", morph.path(merge));
			flight.setAttribute(
				"transform",
				`translate(${box.left} ${box.top}) scale(${box.width} ${box.height})`,
			);
		});

		const reset = rainbowReset(afterReading, pinned, reduced);
		this.rainbow.forEach(({ gradient, stops, step }) => {
			const band = rainbowBand(progress[step]);
			gradient.setAttribute("x1", String(band.left));
			gradient.setAttribute("x2", String(band.right));
			if (reset !== this.rainbowReset) {
				stops.forEach(({ stop, channels }) => {
					const color = channels.map((channel, i) =>
						Math.round(mix(channel, [24, 26, 27][i], reset)),
					);
					stop.setAttribute("stop-color", `rgb(${color.join(", ")})`);
				});
			}
		});
		this.rainbowReset = reset;
		this.reveals.forEach((element) => {
			const p = progress[Number(element.dataset.reveal)];
			const isSeal = element.classList.contains("name-seal");
			// The flourish settles completely before the next reading step begins.
			const sway = reduced || isSeal ? 0 : Math.sin(p * Math.PI) * 10;
			element.style.opacity = String(p);
			element.style.transform = `translateY(${(1 - p) * (isSeal ? -38 : 108) + sway * 0.8}px) rotate(${(1 - p) * (isSeal ? -16 : -25) + sway}deg) scale(${0.78 + p * 0.22})`;
		});
		this.highlights.forEach((element) => {
			element.style.setProperty("--ink", String(progress[Number(element.dataset.highlight)]));
		});
	}

	disconnectedCallback() {
		this.autoplay = null;
		this.rainbow?.forEach(({ element, gradient }) => {
			element.style.removeProperty("fill");
			gradient.remove();
		});
		this.abort?.abort();
		this.resizeObserver?.disconnect();
		cancelAnimationFrame(this.frame);
	}
}

if (!customElements.get("about-name")) customElements.define("about-name", AboutName);
