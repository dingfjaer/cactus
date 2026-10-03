import { diceRotations } from "../utils/dingo";

/** Shared by Spira and the four media galleries; cancel never applies a new draw. */
export function createDingoRoll(
	root: HTMLElement,
	results: HTMLElement,
	status: HTMLElement,
	signal: AbortSignal,
) {
	const dialog = root.querySelector<HTMLDialogElement>("[data-roll]")!;
	let timer: number | undefined;
	let trigger: HTMLElement | null = null;
	const cancel = () => {
		window.clearTimeout(timer);
		timer = undefined;
		if (dialog.open) dialog.close();
		results.removeAttribute("aria-busy");
		if (trigger?.isConnected) trigger.focus({ preventScroll: true });
		trigger = null;
	};
	dialog.addEventListener(
		"cancel",
		(event) => {
			event.preventDefault();
			cancel();
			status.textContent = "Trekningen er avbrutt.";
		},
		{ signal },
	);
	window.addEventListener("pagehide", cancel, { signal });
	signal.addEventListener("abort", cancel, { once: true });
	return {
		cancel,
		get busy() {
			return timer !== undefined;
		},
		start(value: number, apply: () => void) {
			if (timer !== undefined) return;
			trigger = document.activeElement as HTMLElement | null;
			dialog.style.setProperty("--dice-result", diceRotations[value - 1]!);
			dialog.dataset.value = String(value);
			dialog.setAttribute("aria-label", `Terningkast: ${value}`);
			dialog.querySelector<HTMLElement>("[data-roll-result]")!.textContent = `Du kastet ${value}!`;
			results.setAttribute("aria-busy", "true");
			status.textContent = "Terningen ruller …";
			dialog.showModal();
			timer = window.setTimeout(
				() => {
					cancel();
					apply();
				},
				matchMedia("(prefers-reduced-motion: reduce)").matches ? 500 : 1600,
			);
		},
	};
}
