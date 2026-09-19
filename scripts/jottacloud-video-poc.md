# Jottacloud-video → dingchen.no: PoC

Testet 19. september 2026. Album: https://jottacloud.com/share/hjq801c0qqam («Delt videoer», fem videoer).

## Konklusjon

Ja: videoene kan spilles i en Astro-side uten Jottacloud-innlogging. HLS direkte i HTML5-video og HLS via hls.js er verifisert i Codex sin innebygde nettleser. HLS-adressene har imidlertid et signert utløpstidspunkt omtrent **fem timer etter API-hentingen**. De må derfor hentes ved avspilling, ikke skrives permanent inn i et statisk Astro-bygg.

Anbefaling for den personlige siden: behold bildeintegrasjonen som bygger lokale WebP-varianter; bruk de samme albumdataene til videokort med lokalt optimaliserte postere. Hent fersk HLS-adresse ved klikk og spill med native HLS eller hls.js. Dette er en brukbar eksperimentell løsning uten ny tjeneste, men et uoffisielt API gjør Jottacloud mindre egnet som garantert langsiktig videoleverandør. For viktig eller større publisering: behold Jotta som originalarkiv og lever web-versjoner fra eget objektlager/CDN eller en videotjeneste.

## Anonyme kall

Alle HTTP-testene brukte GET uten cookies, Authorization eller Referer. Origin ble satt til `https://dingchen.no` i CORS-testene.

```text
GET https://api.jottacloud.com/photos/v1/public/hjq801c0qqam/?order=ASC&limit=100&comments=false
  → photos[].video_url
GET https://video-v2.jottacloud.com/variantPlaylist/{signed-token}.m3u8
  → to kvalitetsvarianter
GET https://video-v2.jottacloud.com/playlist/{signed-token}.m3u8?q=hd|sd
  → VOD-spilleliste med ca. 2-sekunders segmenter
GET https://video-v2.jottacloud.com/segment/{signed-token}/hd/segment_0.ts
  → MPEG-TS-video

photos[].file_url      → https://uc-*.jottacloud.com/pubio/{opaque-token}
photos[].thumbnail_url → https://uc-*.jottacloud.com/thumbs/{opaque-token}
poster                → thumbnail_url + '.l'
thumbnail             → thumbnail_url + '.s' (samme mønster som bildeintegrasjonen)
```

Det er påvist **HLS**, ikke DASH. Ingen MPD-adresse ble eksponert i albumresponsen eller manifestkjeden som ble undersøkt. Ingen separat transkodet MP4-adresse ble eksponert; `file_url` er originalfilen.

Klientfilen `https://jottacloud.com/webapp_static/js/jotta-libs.4d54f36a.js` inneholder GET-rutingen mellom `public` og `albums` med `order`, `limit`, `comments`, samt videoskjema med `video_url`, `codec` og `duration`. Det offentlig tilgjengelige albumet viste de samme fem filene uten innlogging. Kallkjeden ovenfor er utført og kontrollert separat; verktøyet ga ikke et HAR-opptak av Jottaclouds egen app. Den nåværende UI-en kan også bruke gRPC. Jottas egen spiller viste først «Kunne ikke spille innholdet» i testnettleseren, mens den isolerte spilleren fungerte; årsaken til UI-feilen er ikke fastslått.

## Filer og kvaliteter

| Fil | Original | Størrelse | HLS HD / SD i manifest |
| --- | --- | --- | --- |
| Baby Goats.mov | ProRes (`apcn`), QuickTime | 633,8 MB | 1280×720 / 853×480 |
| Ding - Figmanimert 4k.mov | HEVC (`hvc1`), QuickTime | 23,4 MB | 1347×720 / 898×480 |
| IMG_7941.MOV | HEVC (`hvc1`), QuickTime | 22,7 MB | 720×720 / 480×480 |
| IMG_7940.MOV | HEVC (`hvc1`), QuickTime | 22,6 MB | 720×720 / 480×480 |
| IMG_0504.MP4 | HEVC (`hevc`), MP4 | 35,7 MB | 332×720 / 221×480 |

Alle HLS-manifestene annonserte `avc1.420029,mp4a.40.2` (H.264/AAC), båndbredde 4 128 000 og 1 464 000 bit/s. Dette er annonserte verdier; faktisk dekodet størrelse kan avvike litt (stående SD-video rapporterte 220×476). Selv 4K-originalen eksponerte bare 720/480 i dette manifestet. MP4-filens `mimetype` var tom i albumdataene, mens HTTP-responsen korrekt sa `video/mp4`; ikke stol bare på JSON-feltet.

## HTTP, CORS og stabilitet

| Ressurs | Resultat for alle fem videoer | Betydning |
| --- | --- | --- |
| Album-JSON | 200, `Access-Control-Allow-Origin: *`, `Cache-Control: no-store` | Kan hentes anonymt direkte fra nettleser |
| HLS master + HD-playlist | 200, `application/vnd.apple.mpegurl`, CORS `*`, `no-store` | Fungerer med JavaScript-spiller |
| Første HD-segment | 200, `video/MP2T`, CORS `*` | Segmenthenting fungerer; Range ble ignorert og hele segmentet returnert |
| Original, `Range: bytes=0-1023` | 206, korrekt `Content-Range`, `Accept-Ranges: bytes` | Direkte filtilgang og byte-spoling fungerer |
| Original | `Content-Disposition: attachment`, ingen ACAO | Nedlastingslenke fungerer; JS-fetch/crossorigin-media blokkeres |
| Poster `.l` | 200, JPEG, CORS `*` | Egnet som video-poster; 72–166 kB i utvalget |

`.s` er kjent fra bilde-PoC-en; i denne videotesten ble `.l` testet for alle fem.

`file_url` og `thumbnail_url` var identiske mellom de to albumhentingene. Det beviser ikke varig levetid. `video_url` endret seg. JWT-payloaden inneholdt et `exp`-tall i millisekunder: respons 08:40:02 UTC → utløp 13:40:02 UTC. Samme signerte token fulgte playlist og segmenter. Vi ventet ikke fem timer for å måle faktisk avvisning etter utløp; implementasjonen må likevel behandle dette som tidsbegrensede adresser. Ikke prøv å fjerne eller endre signaturen.

## Faktisk nettlesertest

PoC-en ble bygget statisk med repoets Astro 7.3.2 og servert fra `http://127.0.0.1:8766`, altså en annen origin enn Jotta. Den henter albumdata med `credentials: 'omit'`.

- Baby Goats, native `<video src="…m3u8">`: `loadedmetadata`, `canplay`, `playing`; 70,233 s. Spoling til 35,12 s fungerte, med 1280×720 etter kvalitetsbytte.
- Samme video med hls.js 1.7.3: avspilling i 1280×720 og spoling til 35,12 s fungerte.
- IMG_0504, native HLS med `autoplay muted playsinline`: startet etter lasting uten eget trykk på spill. 22,533 s.
- IMG_0504, direkte original **uten** `crossorigin`: avspilling i 1180×2556 og spoling til 11,24 s fungerte. `attachment` hindret altså ikke denne nettleserens mediaelement.
- Samme original **med** `crossorigin="anonymous"`: feilet, med mediafeil 4. Dette samsvarer med manglende ACAO.

Dette er ikke en full Chrome/Firefox/Safari/iPhone-matrise, og alle fem videoer ble ikke spilt i alle modi. HTTP-kjeden ble testet for alle fem; avspilling ble testet på de to nevnte. Lydkvalitet, iOS-fullskjerm, batterisparing og langtidsutløp er ikke verifisert. HEVC/ProRes-originaler er ikke et robust formatvalg på tvers av nettlesere, selv om HEVC-MP4-en fungerte her.

Native HLS-støtte må detekteres; ellers brukes [hls.js med MSE](https://github.com/video-dev/hls.js). Native HLS finnes blant annet i Safari. Vanlig cross-origin video kan fungere uten CORS når `crossorigin` utelates, men JS-/canvas-bruk har andre begrensninger. Se [video-elementet](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video).

Bruk normalt `controls playsinline preload="none"` og last ved klikk i galleriet. PoC-en bruker `preload="metadata"` etter eksplisitt lasting for å kunne måle format og varighet. `muted` og `playsinline` er riktig utgangspunkt for ønsket autoplay, men [nettleserens autoplay-regler](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay) kan fortsatt blokkere det. Ikke autostart alle videoer i et blandet galleri.

## Anbefalt arkitektur

1. Ved bygging: hent albumdata, normaliser til `type: image | video`, ID, tittel, størrelse, varighet og poster. Filtrer bort skjulte/slettede elementer. Unngå å publisere rå eier-/GPS-/EXIF-data.
2. Bilder: dagens `astro:assets`-flyt henter JPEG-preview og bygger lokale responsive WebP-filer. Besøkende er da ikke avhengige av Jotta for hver bildefremvisning.
3. Video: bygg lokal poster og et videokort. Ved klikk hentes ferskt offentlig album; finn valgt ID og bruk `video_url`. Native HLS først, ellers lazy-load hls.js. Ved utløp/feil, tilby ny lasting og synlig lenke til Jottas visningsside. Produksjonskode bør gjøre ett avgrenset forsøk på URL-fornyelse og bevare avspillingsposisjonen.
4. `/photos` kan forbli bilder; `/videos` kan være et filter over samme mediemodell. Et mixed media gallery kan gjenbruke kort og sortering uten å blande bildeoptimalisering og videoavspilling.

Dette fungerer med statisk GitHub Pages: ingen egen server er nødvendig så lenge offentlig API-CORS fortsetter å fungere. Et senere serverendepunkt kan skjule Jottas detaljer og cache en kort stund, men video-byte bør fortsatt gå direkte til avspilleren. Automatisk publisering av nye/fjernede kort krever nytt bygg; avspilling fornyer bare URL-en. Kopierte postere/bilder fjernes ikke automatisk når Jotta-deling oppheves.

Ulemper ved Jotta som leverandør: uoffisielt endepunkt uten påvist stabil kontrakt, femtimers tokens, bare observerte 720/480-varianter, ekstra API-avhengighet og ukjent trafikk-/hotlinking-policy. Ingen kommersiell leveringsgaranti eller tillatelse er fastslått. Ikke legg de store originalvideoene i Git-historikken. Ved behov for mer robust levering: synk utvalgte videoer til web-kopier i objektlager/CDN og behold Jotta som originalarkiv/publiseringskø.

## Leveranse og kjøring

Den minimale siden er `src/pages/videos-poc.astro` i dingchen.no-repoet. Den endrer ingen menyer, eksisterende gallerier eller avhengighetsfiler. Den er ikke publisert. `noindex` er satt, men er ikke tilgangskontroll. Den har valg for native HLS, hls.js og original med/uten CORS. hls.js lastes fra en versjonslåst CDN-import for PoC; pakk den lokalt i en produksjonsimplementasjon.

Fra repoet: `pnpm dev`, åpne `/videos-poc`. Den isolerte testen i dette arbeidsområdet kan bygges med `site/node_modules/.bin/astro build --root jottacloud-video-poc/astro-test` med Node 24. `python3 jottacloud-video-poc/probe.py` gjentar HTTP-testene og lagrer utvalgte mediefelter i `media.json` og HTTP-bevis i `http-checks.json`. Proben lagrer ikke fullstendige originalfiler; én HLS-segmentrespons per video kan være rundt 1 MB. Det isolerte bygget lykkes. Repoets `astro check` kontrollerte 62 filer med 0 feil, 0 advarsler og 6 eksisterende hint i andre filer. Full produksjonsbygging og publisering er ikke utført som del av denne avgrensede testen.

## Rettelse etter brukertest 19. september kl. 10:52

Første PoC krevde et separat trykk på «Last valgt video». Bytte av video i listen lastet ikke kilden, og Spill-knappen var aktiv uten kilde. Dette ga en tom spiller etter vanlig valg av video. Siden er rettet: første video og senere valg lastes automatisk med poster; Spill aktiveres når videoen er klar. Status og lastingsfeil vises tydelig, mens tekniske testvalg er samlet under en utvidbar seksjon. Gamle asynkrone svar kan ikke overskrive et nyere videovalg.

Alle fem videoer er nå startet fra den rettede siden i nettleseren. Figmanimert-videoen er også visuelt kontrollert med ulike videobilder og avspillingstid over åtte sekunder. Begge korte MOV-klipp samt stående MP4 ble kontrollert med fremadgående avspillingstid eller avsluttet avspilling. Den isolerte Astro-byggingen bestod på nytt.
