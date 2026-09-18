# Alt som gror

Spira (`/posts/`) retains articles, tags and pagination. Shared navigation links to
Rosa (`/posts/rosa/`), Vipa (`/posts/vipa/`), Løva (`/posts/lova/`) and Tinsta
(`/posts/tinsta/`). Album IDs and descriptions live in `src/data/galleries.ts`.

The existing Vipa illustration article now has slug `vipa-illustrasjon` to free
`/posts/vipa/` for the requested gallery. Article lists, tags, RSS and sitemap use
the updated content ID. Existing external links to `/posts/vipa/` now reach the gallery.

## Images and dates

The existing `fetchAlbum()` fetches public Jottacloud data at build time. Astro
Image generates local WebP assets with responsive sizes. Adding/removing photos
requires a new successful build and deployment. No automatic rebuild schedule
has been added. All four albums were successfully fetched during verification.

`capturedDate` is the Jottacloud photo date (milliseconds since Unix epoch).
`timestamp` is not used as the photo date. Dates are displayed in Europe/Oslo,
and age uses the same calendar day and the birthday 2025-04-08. Missing/invalid
dates show explicit unknown labels; photos before birth are labelled accordingly.
Photos are sorted newest first, with unknown dates last. GPS/owner metadata is
not included in rendered output.

There is no album-size cap. Requests fetch 100 entries at a time, using the last
entry's nanosecond `timestamp` string as the next URL path segment. The loop
continues until a short/empty page and deduplicates overlapping IDs. Network
errors and non-advancing cursors fail the build instead of losing images.
Verified against Jottacloud's public client `jotta-libs.4d54f36a.js` and a live
4-photo album fetched as 2 + 2 + 0 entries. All four albums also matched
when comparing 2-entry pages against 100-entry pages (1, 4, 1 and 15 photos). Tests also cover a 151-photo album,
page overlaps and failures on subsequent pages.

## Glass navigation

Order: Spira, Rosa, Vipa, Løva, Tinsta. The browser adaptation of Liquid Glass
uses translucent layers, a shared sliding selection lens, 44px touch targets,
press feedback and horizontal pointer scrubbing. Vertical touch scrolling remains
native. Keyboard users can Tab through links or move focus with arrows/Home/End
and activate with Enter. Real links preserve URL/history and modifier-clicks.
Native cross-document View Transitions animate the lens without a client router;
browsers without that API retain ordinary navigation and press feedback.
Reduced motion disables animation; reduced transparency and forced colors have
fallback styles. No native iOS shader or haptic feedback is claimed.

## Verification

Using Node 24:

- `node --test tests/garden.test.mjs`: calendar boundaries, leap year, Oslo/DST,
  missing dates, metadata filtering and failed/incomplete album responses.
- `pnpm build`: Astro check, static build, image conversion and Pagefind indexing.
- Browser: navigate all five tabs, confirm selected link and image loading;
  verify desktop three columns, tablet two columns, mobile one column;
  Tinsta images have left=0 and right=viewport width on mobile.
- Check dark/light themes and the relocated Vipa article.
