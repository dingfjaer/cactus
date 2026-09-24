import { parseArgs } from 'node:util';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

// Run from anywhere; files always belong to this repository.
const root = fileURLToPath(new URL('../../', import.meta.url));
const { values: args } = parseArgs({ options: Object.fromEntries(
  ['url', 'file', 'slug', 'name', 'alt', 'credit', 'source'].map(key => [key, { type: 'string' }])
)});
if (!!args.url === !!args.file || !args.alt || !args.credit || !args.source ||
    ![args.slug, args.name].every(value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? ''))) {
  throw new Error('Bruk --url ELLER --file, samt --slug, --name, --alt, --credit og --source. Slug/navn: små bokstaver, tall og bindestrek.');
}
if (new URL(args.source).protocol !== 'https:') throw new Error('Kilden må være en HTTPS-lenke.');
const limit = 20 * 1024 * 1024;
let input;
if (args.file) {
  input = await readFile(args.file);
} else {
  const url = new URL(args.url);
  if (url.protocol !== 'https:' || url.hostname !== 'miro.medium.com') {
    throw new Error('Bilde-URL må være en direkte HTTPS-lenke til miro.medium.com.');
  }
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Medium svarte ${response.status}. Lagre bildet manuelt og bruk --file.`);
  if (!/^image\/(png|jpeg|webp|gif|avif)(;|$)/i.test(response.headers.get('content-type') ?? '')) {
    throw new Error('Svaret er ikke et støttet bilde; ingen fil ble lagret.');
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new Error('Bildet overstiger 20 MB.');
    chunks.push(chunk);
  }
  input = Buffer.concat(chunks);
}
if (input.length > limit) throw new Error('Bildet overstiger 20 MB.');
const metadata = await sharp(input, { animated: true, limitInputPixels: 40_000_000 }).metadata();
if (!['png', 'jpeg', 'webp', 'gif', 'avif', 'heif', 'svg'].includes(metadata.format)) {
  throw new Error('Ukjent bildeformat.');
}
const animated = (metadata.pages ?? 1) > 1;
// Preserve animation bytes. Static diagrams use lossless WebP for sharp lines.
const output = animated ? input : await sharp(input, { limitInputPixels: 40_000_000 })
  .rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ lossless: true }).toBuffer();
const extension = animated ? ({ heif: 'avif', jpeg: 'jpg' }[metadata.format] ?? metadata.format) : 'webp';
const hash = createHash('sha256').update(output).digest('hex');
const filename = `${args.name}-${hash.slice(0, 12)}.${extension}`;
const relative = `images/medium/${args.slug}/${filename}`;
const target = path.join(root, 'src/content/post', relative);
await mkdir(path.dirname(target), { recursive: true });
try { await writeFile(target, output, { flag: 'wx' }); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
const record = {
  source: args.source, originalImage: args.url ?? null, credit: args.credit,
  alt: args.alt, localFile: `src/content/post/${relative}`, sha256: hash,
  originalBytes: input.length, storedBytes: output.length, animated,
  importedAt: new Date().toISOString()
};
const records = path.join(root, 'scripts/medium/records', args.slug);
await mkdir(records, { recursive: true });
await writeFile(path.join(records, `${filename}.json`), JSON.stringify(record, null, 2) + '\n');
const escape = value => value.replace(/[\\[\]]/g, '\\$&').replace(/\s+/g, ' ');
console.log(`![${escape(args.alt)}](./${relative})\n\n*${escape(args.credit)}. [Kilde](<${args.source}>).*`);
console.log(`\nLagret ${output.length} byte (${animated ? 'animasjon bevart' : 'WebP, maks 1600 px'}).`);
