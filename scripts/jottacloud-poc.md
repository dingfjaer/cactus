# Jottacloud → Astro: proof of concept

**Oppdatering:** Galleriet er nå integrert i `src/pages/photos.astro`. Det bruker Astro til å lage lokale, responsive WebP-bilder ved bygging og deler nettstedets tema. Beskrivelsen nedenfor dokumenterer den første isolerte testen. Se prosjektets README for dagens publiseringsflyt.

Testet 18. september 2026 med det offentlige albumet [Test Astro](https://jottacloud.com/share/k0qd6q3j37gn), som inneholdt to bilder.

## Resultat

Anonym server-side henting fungerer. Node 24 hentet album-JSON uten Authorization, cookies, API-nøkkel eller Referer. Et isolert bygg med repoets Astro 7.3.2 genererte `/photos/index.html` fra et direkte kall til `fetchAlbum()` i Astro frontmatter. Begge bildene ble deretter kontrollert i nettleseren og var ferdig lastet. Det ordinære dingchen.no-nettstedet er ikke endret eller publisert.

## Endepunkt og data

```text
GET https://api.jottacloud.com/photos/v1/public/k0qd6q3j37gn/?order=ASC&limit=100&comments=false
```

Responsen inneholder `title`, albumets `id`, `lastModified` og `photos[]`. Hvert bilde har blant annet `id`, `filename`, `width`, `height`, `mimetype`, `timestamp`, `thumbnail_url` og `file_url`.

| Bruk | Adresse | Verifisert svar |
| --- | --- | --- |
| Liten thumbnail | `thumbnail_url + '.s'` | 200, image/jpeg, begge bilder |
| Stor forhåndsvisning | `thumbnail_url + '.l'` | 200, image/jpeg, begge bilder |
| Original/nedlasting | `file_url` | 200, image/heic, begge bilder |
| Jottacloud-visningsside | `https://jottacloud.com/share/{shareId}/{photo.id}` | Første bilde åpnet i albumets nettleservisning |

Originalene var 324 176 og 2 374 888 byte. Store JPEG-forhåndsvisninger var 250 164 og 333 402 byte. Nettleseren rapporterte henholdsvis 1798×1832 og 1080×1920 for JPEG-forhåndsvisningene. Originaldimensjonene i JSON kan avvike litt fra forhåndsvisningens dimensjoner.

`thumbnail_url` og `file_url` peker på `uc-*.jottacloud.com` med ugjennomsiktige tokens. URL-ene samsvarte ved gjentatte hentinger i denne økten og med bildene på albumsiden. Dette beviser **ikke** at URL-ene er permanente, eller hva som skjer etter at delingen oppheves. De skal hentes fra API-et på nytt ved hvert bygg. Scriptet lagrer derfor JPEG-forhåndsvisningene lokalt under ID-baserte filnavn; original-lenkene er fremdeles eksterne.

## Hvordan API-et ble identifisert

Albumsiden ble åpnet uten innlogging i nettleseren. DOM-en viste de to filnavnene og `.s`/`.l`-adressene. Den offentlig leverte JavaScript-filen `https://jottacloud.com/webapp_static/js/jotta-libs.de96456e.js` inneholdt klientkode med base `https://api.jottacloud.com/photos/v1` og GET-stien `${publicAlbum ? 'public' : 'albums'}/${id}/…`, med `order`, `limit` og `comments` som parametere. Dette ble brukt til et ekte anonymt HTTP-kall, og svaret matchet albumet.

Nettleserverktøyet eksponerte ikke Network-panelet eller Resource Timing, og Chrome var ikke tilgjengelig gjennom nettleserkoblingen. Det finnes derfor ingen HAR/nettverksopptak fra den kjørende appen. REST-kallet er identifisert i den leverte klientkoden og testet separat; det er ikke dokumentert her at akkurat dette REST-kallet er den nåværende UI-ens eneste datakilde. Klientkoden inneholder også gRPC-baserte fotokall.

## Kjør scriptet

Fra dingchen.no-repoet, med prosjektets Node 24:

```sh
node scripts/jottacloud-poc.mjs /tmp/jottacloud-gallery
```

Valgfritt tredje argument er en annen offentlig share-ID. Scriptet skriver `index.html`, lokale JPEG-er, `album.json` med utvalgte gallerifelter og `verification.json`. Originalene lastes for HTTP-/formatkontroll, men lagres ikke. Kjør dette kun mot album du ønsker å vise offentlig.

Det er bevisst ingen endring i package.json, meny, eksisterende sider eller publiseringsoppsett. Scriptet krever ingen nye pakker. Det feiler ved nettverksfeil, uventet JSON, ugyldige bildefiler eller 100 bilder, slik at et ufullstendig album ikke publiseres stille. Paginering er ikke testet med dette tobildersalbumet.

## Minimal Astro-bruk

`fetchAlbum` kan importeres i `src/pages/photos.astro`:

```astro
---
import { fetchAlbum } from '../../scripts/jottacloud-poc.mjs';
export const prerender = true;
const album = await fetchAlbum();
---
<h1>{album.title}</h1>
{album.photos.map(photo => (
  <a href={photo.page}>
    <img src={photo.preview} alt={photo.filename}
      width={photo.width} height={photo.height} loading="lazy" />
  </a>
))}
```

Det isolerte testbygget brukte denne dataflyten med en enkel gallerimal. [Astros dokumentasjon](https://docs.astro.build/en/guides/data-fetching/) beskriver at `fetch()` i en statisk sides frontmatter kjøres under build.

## Før fast bruk

- Nytt eller fjernet bilde krever et nytt bygg. Ingen automatisk trigger eller tidsplan er satt opp i denne testen.
- For fast bruk anbefales lokale JPEG-kopier ved bygging, slik testscriptet demonstrerer. Et nytt vellykket bygg bør bare publisere bilder som fortsatt finnes i albumet. Kopier i en gammel publisering forsvinner ikke automatisk når albumdelingen endres.
- Dette er et internt endepunkt identifisert i klientkode, uten påvist offentlig kontrakt eller garanti om stabilitet. Varig URL-levetid og store album er ikke bevist.
- API-et returnerer også GPS/EXIF og eierdata. Disse feltene er utelatt fra generert JSON/HTML. Originale HEIC-filer kan fremdeles inneholde metadata.
- Fjern/gjør tydelig PoC-grensen på 100 først etter at API-paginering er testet. Bruk beskrivende alternativ tekst i den endelige fotosiden; testen bruker filnavn.
