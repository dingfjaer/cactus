import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

export function remarkReadingTime() {
	// @ts-expect-error:next-line
	return (tree, { data }) => {
		const textOnPage = mdastToString(tree);
		const readingTime = getReadingTime(textOnPage);
		const roundedMinutes = Math.max(1, Math.round(readingTime.minutes));
		data.astro.frontmatter.minutesRead = `${roundedMinutes} min lesetid`;
	};
}
