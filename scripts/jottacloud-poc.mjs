import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const DEFAULT_SHARE = 'k0qd6q3j37gn';
const PAGE_SIZE = 100;

function jottaURL(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.jottacloud.com')) {
    throw new Error('Unexpected image host');
  }
  return url.href;
}

async function get(url) {
  const response = await fetch(url, {
    credentials: 'omit',
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Jottacloud HTTP ${response.status}`);
  return response;
}

// Import this function in Astro frontmatter to fetch at build time.
// Only public gallery fields are returned; EXIF/GPS and owner data are omitted.
/**
 * @returns {Promise<{
 *   title: string, shareId: string, endpoint: string, fetchedAt: string,
 *   photos: Array<{
 *     id: string, filename: string, takenAt: string | null, width: number, height: number,
 *     thumbnail: string, preview: string, original: string, page: string,
 *     kind: "image" | "video", duration: string, localPreview?: string
 *   }>
 * }>}
 */
export async function fetchAlbum(shareId = DEFAULT_SHARE, { pageSize = PAGE_SIZE, includeVideos = false } = {}) {
  if (!/^[a-zA-Z0-9_-]+$/.test(shareId)) throw new Error('Invalid share ID');
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid page size');
  const base = `https://api.jottacloud.com/photos/v1/public/${shareId}/`;
  const query = `?order=ASC&limit=${pageSize}&comments=false`;
  const endpoint = `${base}${query}`;
  let title = '', cursor = '';
  const seenCursors = new Set();
  const entries = new Map();
  // Jottacloud's public-album client passes the last photo's timestamp as
  // the next path segment (from). Keep it as a string: it is nanoseconds.
  while (true) {
    const raw = await (await get(`${base}${encodeURIComponent(cursor)}${query}`)).json();
    if (typeof raw.title !== 'string' || !Array.isArray(raw.photos)) {
      throw new Error('Unexpected album response');
    }
    if (!cursor) title = raw.title;
    for (const photo of raw.photos) {
      if (typeof photo.id !== 'string') throw new Error('Unexpected photo ID');
      entries.set(photo.id, photo);
    }
    if (raw.photos.length < pageSize) break;
    const next = raw.photos.at(-1)?.timestamp;
    if (typeof next !== 'string' || !/^\d+$/.test(next) || seenCursors.has(next)) {
      throw new Error('Jottacloud pagination did not advance');
    }
    seenCursors.add(next);
    cursor = next;
  }
  const photos = [...entries.values()].filter(p => !p.deleted && !p.hidden && (p.content === 'image' || (includeVideos && p.content === 'video'))).map(p => {
    if (typeof p.id !== 'string' || typeof p.filename !== 'string' ||
        !Number.isFinite(p.width) || p.width <= 0 ||
        !Number.isFinite(p.height) || p.height <= 0) {
      throw new Error('Unexpected photo response');
    }
    return {
      kind: p.content,
      duration: typeof p.duration === "string" ? p.duration : "",
      id: p.id,
      filename: p.filename,
      // capturedDate is Jottacloud's photo date in milliseconds, not the
      // nanosecond timestamp used by the API for ordering/versioning.
      takenAt: typeof p.capturedDate === 'number' && Number.isFinite(p.capturedDate)
        && p.capturedDate > 0 && !Number.isNaN(new Date(p.capturedDate).valueOf())
        ? new Date(p.capturedDate).toISOString() : null,
      width: p.width,
      height: p.height,
      thumbnail: jottaURL(`${p.thumbnail_url}.s`),
      preview: jottaURL(`${p.thumbnail_url}.l`),
      original: jottaURL(p.file_url),
      page: `https://jottacloud.com/share/${shareId}/${encodeURIComponent(p.id)}`,
    };
  });
  return { title, shareId, endpoint, fetchedAt: new Date().toISOString(), photos };
}

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[c]);

export async function buildGallery(outputDirectory, shareId = DEFAULT_SHARE) {
  const album = await fetchAlbum(shareId);
  const output = resolve(outputDirectory);
  await mkdir(join(output, 'images'), { recursive: true });
  const checks = [];
  for (const photo of album.photos) {
    const name = createHash('sha256').update(photo.id).digest('hex').slice(0, 20);
    for (const kind of ['thumbnail', 'preview', 'original']) {
      const response = await get(photo[kind]);
      const type = response.headers.get('content-type')?.split(';')[0];
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!type?.startsWith('image/') || !bytes.length) throw new Error(`Invalid ${kind} image`);
      checks.push({ filename: photo.filename, kind, status: response.status, type, bytes: bytes.length });
      if (kind === 'preview') {
        const ext = ({ 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' })[type];
        if (!ext) throw new Error(`Preview is not browser-friendly: ${type}`);
        photo.localPreview = `images/${name}.${ext}`;
        await writeFile(join(output, photo.localPreview), bytes);
      }
    }
  }
  const e = escapeHTML;
  const figures = album.photos.map(p => `<figure>
    <a href="${e(p.page)}"><img src="${e(p.localPreview)}" width="${p.width}" height="${p.height}" alt="${e(p.filename)}" loading="lazy"></a>
    <figcaption>${e(p.filename)} · <a href="${e(p.original)}">Original (HEIC)</a></figcaption>
  </figure>`).join('\n');
  const html = `<!doctype html><html lang="nb"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${e(album.title)} – Jottacloud-test</title>
  <style>body{font:18px system-ui;max-width:900px;margin:40px auto;padding:0 20px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}figure{margin:0}img{width:100%;height:360px;object-fit:contain;background:#f4f4f4}figcaption{font-size:14px;padding-top:8px}a{color:inherit}</style>
  <h1>${e(album.title)}</h1><p>${album.photos.length} bilder hentet fra det offentlige Jottacloud-albumet.</p><main>${figures}</main>
  <p>Forhåndsvisningene er hentet ved bygging. Albumendringer vises etter en ny kjøring.</p></html>`;
  await writeFile(join(output, 'index.html'), html);
  await writeFile(join(output, 'album.json'), JSON.stringify(album, null, 2));
  await writeFile(join(output, 'verification.json'), JSON.stringify(checks, null, 2));
  console.table(checks);
  console.log(`${album.title}: ${album.photos.length} photos → ${join(output, 'index.html')}`);
  return album;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const output = process.argv[2];
  if (!output) {
    console.error('Usage: node scripts/jottacloud-poc.mjs <output-directory> [share-id]');
    process.exitCode = 1;
  } else {
    await buildGallery(output, process.argv[3]);
  }
}
