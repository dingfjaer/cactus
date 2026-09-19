import test from 'node:test';
import assert from 'node:assert/strict';
import { photoCalendarDate, tintinAge, formatPhotoDate } from '../src/utils/tintin-age.mjs';
import { fetchAlbum } from '../scripts/jottacloud-poc.mjs';

test('calendar age handles birthday, month borrowing, leap year and missing dates', () => {
  for (const [day, age] of [
    ['2025-04-08', '0 d'], ['2025-04-09', '1 d'], ['2025-05-07', '29 d'],
    ['2025-05-08', '1 mnd'], ['2026-04-07', '11 mnd 30 d'], ['2026-04-08', '1 år'],
    ['2026-09-18', '1 år 5 mnd 10 d'], ['2028-03-01', '2 år 10 mnd 22 d'],
    ['2025-04-07', 'Før Tintin ble født'], [null, 'Alder ukjent'], ['2026-02-30', 'Alder ukjent'],
  ]) assert.equal(tintinAge(day), age, day);
});

test('date and age use the same Oslo calendar day across DST and midnight', () => {
  assert.equal(photoCalendarDate('2026-09-17T22:30:00Z'), '2026-09-18');
  assert.equal(photoCalendarDate('2026-03-29T22:30:00Z'), '2026-03-30');
  assert.equal(photoCalendarDate(null), null);
  assert.equal(photoCalendarDate('invalid'), null);
  assert.equal(formatPhotoDate('2026-09-18'), '18.09.2026');
  assert.equal(formatPhotoDate(null), 'Dato ukjent');
});

const photo = { id: 'test', filename: 'test.heic', content: 'image', width: 100, height: 200,
  thumbnail_url: 'https://example.jottacloud.com/thumbs/test', file_url: 'https://example.jottacloud.com/files/test',
  capturedDate: Date.parse('2026-09-18T12:00:00Z'), timestamp: 'unrelated' };

test('album mapping uses capturedDate, filters hidden photos and excludes private metadata', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({title: 'Test', photos: [
    {...photo, gpsCoords: 'private', ownerFullName: 'private'}, {...photo, id: 'hidden', hidden: true},
    {...photo, id: 'deleted', deleted: true}, {...photo, id: 'video', content: 'video'}, {...photo, id: 'unknown', capturedDate: null},
  ]}));
  const album = await fetchAlbum('test');
  assert.equal(album.photos.length, 2);
  assert.equal(album.photos[0].takenAt, '2026-09-18T12:00:00.000Z');
  assert.equal(album.photos[1].takenAt, null);
  assert.ok(!JSON.stringify(album).includes('private'));
});

test('album errors fail the build instead of publishing incomplete data', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', {status: 503}));
  await assert.rejects(fetchAlbum('test'), /HTTP 503/);
  globalThis.fetch = async () => Response.json({title: 'Test', photos: [{...photo, width: 0}]});
  await assert.rejects(fetchAlbum('test'), /Unexpected photo/);
  await assert.rejects(fetchAlbum('../invalid'), /Invalid share/);
});


test('albums above 100 photos are fully paginated with precise string cursors', async t => {
  const pages = [
    Array.from({length: 100}, (_, i) => ({...photo, id: String(i), timestamp: String(1789296919139062229n + BigInt(i))})),
    Array.from({length: 51}, (_, i) => ({...photo, id: String(i+100), timestamp: String(1789296919139062329n + BigInt(i))})),
  ];
  const requests = [];
  t.mock.method(globalThis, 'fetch', async url => {
    requests.push(url);
    return Response.json({title: 'Large album', photos: pages.shift()});
  });
  const album = await fetchAlbum('test');
  assert.equal(album.photos.length, 151);
  assert.equal(album.photos.at(-1).id, '150');
  assert.ok(requests[1].includes('/1789296919139062328?'));
});

test('exact page boundaries, overlaps and empty albums are handled', async t => {
  const pages = [[{...photo, id: 'a', timestamp: '100'}, {...photo, id: 'b', timestamp: '200'}],
    [{...photo, id: 'b', timestamp: '200'}, {...photo, id: 'c', timestamp: '300'}], []];
  t.mock.method(globalThis, 'fetch', async () => Response.json({title: 'Test', photos: pages.shift() ?? []}));
  assert.deepEqual((await fetchAlbum('test', {pageSize: 2})).photos.map(p => p.id), ['a', 'b', 'c']);
  assert.equal((await fetchAlbum('test')).photos.length, 0);
});

test('broken pagination and later-page network errors cannot silently truncate an album', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({title: 'Test', photos: [{...photo, timestamp: '100'}]}));
  await assert.rejects(fetchAlbum('test', {pageSize: 1}), /did not advance/);
  let calls = 0;
  globalThis.fetch = async () => ++calls === 1
    ? Response.json({title: 'Test', photos: [{...photo, timestamp: '100'}]})
    : new Response('', {status: 503});
  await assert.rejects(fetchAlbum('test', {pageSize: 1}), /HTTP 503/);
});

test('mixed galleries opt into videos without baking expiring stream URLs into the page data', async t => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({title: 'Mixed', photos: [
    photo, {...photo, id: 'video', content: 'video', duration: '00:31', video_url: 'https://video-v2.jottacloud.com/expiring.m3u8'},
    {...photo, id: 'hidden-video', content: 'video', hidden: true},
  ]}));
  const images = await fetchAlbum('test');
  assert.equal(images.photos.length, 1);
  const mixed = await fetchAlbum('test', {includeVideos: true});
  assert.deepEqual(mixed.photos.map(p => p.kind), ['image', 'video']);
  assert.equal(mixed.photos[1].duration, '00:31');
  assert.equal('video_url' in mixed.photos[1], false);
});
