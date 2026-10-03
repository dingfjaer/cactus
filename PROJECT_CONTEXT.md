# Prosjektkontekst: Fjærdinghage / Digital hage med Astro / Cactus

Sist endret i dokumentet: 2026-10-03
Dokumentversjon: 2 — samordnet med instruksjonspakken  
Eier: Ding Chen / Ding Chen Fjær  
Nettsted: `dingchen.no`  
Autoritativ prosjektmappe: `/Users/ding/Github/cactus`  
Plassering: `/Users/ding/Github/cactus/PROJECT_CONTEXT.md`  
Verifisering er avgrenset per funksjonsområde nedenfor. Siste tillegg gjelder Dingo med terningstyrt antall i alle hagefanene, se §6.15.

> Dokumentets bakgrunn bygger på samtaler og tidligere prosjektkontekst, ikke en
> full teknisk revisjon. Historiske ønsker og rapporterte leveranser er ikke bevis
> på implementasjon. Originalrepoet og instruksjonsfilene er nå lest lokalt;
> verifisert implementasjon og kontroll av 3D-modellen på Om-siden er beskrevet i §6.5.
> Øvrige funksjonsstatuser er ikke revidert. Publiseringsstatus står i §6.5 og §6.9.

## 1. Start her i en ny samtale

Les prosjektets `AGENTS.md` og dette dokumentet før prosjektspesifikt arbeid.
Følg også tilgjengelige globale instruksjoner. Les så de faktiske filene som
oppgaven gjelder. En kjent filsti eller et minne er ikke lest filinnhold.

Instruksjonsfilene styrer arbeidsmåten; dette dokumentet forklarer prosjektet.
Hvis kode og dokumentasjon avviker, undersøk om funksjonen er uferdig eller
om beskrivelsen er utdatert. Ikke forkast et uttrykkelig brukerønske uten grunn.

### Dokumentstruktur og hovedkilde

| Dokument | Rolle |
| --- | --- |
| `/Users/ding/.codex/AGENTS.md` | Generelle arbeidsregler på tvers av Codex-prosjekter. |
| `/Users/ding/Github/cactus/AGENTS.md` | Cactus-spesifikke regler, mappevalg, kontroll og kontekstvedlikehold. |
| `/Users/ding/Github/cactus/PROJECT_CONTEXT.md` | Hovedversjonen av denne prosjektkonteksten, tiltenkt versjonskontroll med koden. |
| Opplastede prosjektkilder i ChatGPT | Kopier av prosjektets `AGENTS.md` og `PROJECT_CONTEXT.md`; ikke en egen fasit. |
| Prosjektinstruksjoner i ChatGPT | Oppstartsregel som peker til dokumentene og presiserer tilgang og vedlikehold. |

Navnene `GLOBAL_INSTRUCTIONS.md` og `PROJECT_INSTRUCTIONS.md` ble foreslått
for opplastede kopier tidligere i samtalen. Det samordnede oppsettet bruker
ikke disse ekstra navnene: den globale originalen ligger lokalt, og prosjektets
to originalfiler lastes opp med sine faktiske navn når en opplastet reserve trengs.

### Riktig arbeidsmappe er avgjørende

Autoritativ lokal mappe er `/Users/ding/Github/cactus`, brukerbekreftet
2026-09-24. `~/.codex/.chatgpt-projects/.../site` er identifisert som en utdatert
kopi og skal ikke brukes som arbeidsprosjekt. Følg kontrollreglene i `AGENTS.md`.

Hvis riktig mappe er utilgjengelig, si fra. En opplastet kilde kan støtte
samtale og separate forslag, men ikke bekrefte at kode i originalrepoet er lest
eller endret. En annen arbeidskopi må avtales, ikke velges i stillhet.

### Chat, Work, Git og dokumentasjon

Brukeren ønsker kontinuitet i nye samtaler i både Chat og Work og ved lokalt
Codex-arbeid. Repoets kontekst skal være hovedkilden. Den skal vurderes etter
hver vesentlige oppgave og oppdateres når neste økt trenger ny informasjon.

Relevante dokumentendringer skal følge kodeendringene i en avtalt commit.
Konteksten er en nåsituasjon og beslutningsoversikt, ikke en detaljert Git-logg.
Oppdatering av globale regler krever egen avtale og skjer sjeldnere.

Ingen automatisk synkronisering med opplastede ChatGPT-filer er satt opp eller
verifisert her. Ikke påstå at push, deploy eller en ny fil i repoet oppdaterer
prosjektinnstillinger eller opplastede kopier. Samtalebeslutninger uten repo-tilgang
må leveres som et forslag til hoveddokumentet og senere innarbeides der.

## 2. Formål og avgrensning

Fjærdinghage er Dings personlige digitale hage: et nettsted for artikler,
refleksjoner, bilder, illustrasjoner, design og egne prosjekter. Det skal være
personlig, utforskende og i utvikling, ikke bare en tradisjonell CV- eller
porteføljeside. Navnet og språkbruken bygger på hage- og vekstmetaforer og har
forbindelse til navnet Fjærdingheim.

Nettstedet skal også kunne introdusere Ding faglig. Den visuelle porteføljen
skal ikke alene måtte forklare hele arbeidsprosessen eller alle kundeoppdrag.
Mer inngående gjennomgang kan skje i en samtale eller kaffeprat.

Dette repoet gjelder nettstedet. Appene «Ding Ding!», «På tide» og «På tur» er
separate utviklingsprosjekter, selv om de kan vises som porteføljeinnhold her.
Ikke bland inn appenes kode, backlog eller instruksjoner i nettstedets arbeid.

## 3. Teknisk grunnlag og arbeidsflyt

| Område | Kjent fra prosjektet | Må kontrolleres i repoet |
| --- | --- | --- |
| Rammeverk og grunnmal | Astro med Cactus som utgangspunkt | Installerte versjoner og lokale tilpasninger |
| Styling | Tailwind CSS og Cactus-temavariabler | Gjeldende konfigurasjon og faktiske komponentstiler |
| Tekstinnhold | Markdown / MDX | Innholdsmapper, collections og frontmatter-schema |
| Publisering | GitHub Pages og eget domene `dingchen.no` | Gjeldende workflow, branch, `site`, `base` og siste vellykkede deploy |
| Medier | Jottacloud-delte album er valgt som retning for enklere bildepublisering; video utforskes | Hentemetode, metadata, caching og når nye medier blir synlige |
| Lokal arbeidsflyt | Kodebasen har vært på MacBook Air; brukeren ønsker å kunne fortsette fra flere enheter | Faktisk tilgang, Git-status og synkronisering i den aktuelle økten |

GitHub Pages er et uttrykkelig plattformvalg; ikke bytt til Netlify eller en
annen hostingtjeneste som en uuttalt del av en oppgave.

Ikke anta at prosjektet fortsatt tilsvarer en ren Cactus-mal. Les eksisterende
løsninger før endringer. Versjonsnumre, pakkebehandler og byggkommandoer skal
hentes fra gjeldende `package.json`, lockfil og konfigurasjon, ikke fra gamle
feilmeldinger eller en ny mal. Ikke installer eller oppgrader avhengigheter bare
for å gjøre repoet likt en nyere standardmal.

### Kjente kodehenvisninger, ikke et verifisert filkart

| Henvisning | Kilde og betydning |
| --- | --- |
| `about.astro` | Filen brukeren arbeidet med ved endring av Om-siden. Kontroller faktisk plassering. |
| `@/layouts/Base.astro` | `PageLayout`-import i kode brukeren limte inn. Bevar eksisterende layout og navigasjon. |
| `import.meta.env.BASE_URL` | Tidligere brukt som grunnlag for lenker. Kontroller eksisterende mønster og byggoppsett. |
| `about.png` i en `images`-mappe | Bildet brukeren ønsket på Om-siden. `/images/about.png` ble foreslått; faktisk plassering må kontrolleres. |
| `@/assets/about-astro.png` og `cactusTech` | Eldre import og innholdsstruktur i Om-koden; ikke dokumentasjon på hva som fortsatt brukes. |
| `dings-apps.pdf` | Filnavn i brukerens lenkeeksempel for hobbyprosjekter med iOS-apper. Eksistens og publisert plassering er ikke kontrollert. |

Dette er ikke en komplett prosjektstruktur. Oppdag reelle mapper og komponenter
før du oppretter nye filer med navn fra tidligere forslag.

## 4. Innhold, sider og navigasjon

Forsiden og «Alt som gror» har, ifølge brukerens beskrivelse, lister over
artikler. Om-siden, CV og porteføljen inngår også i nettstedet. Bevar eksisterende
header og navigasjon ved lokale sideendringer.

### Avtalt målstruktur for «Alt som gror»

| Fane | Innhold | Rute omtalt i tidligere kontekst; ikke verifisert |
| --- | --- | --- |
| Spira | Alle artikler / innlegg | Eksisterende artikkelliste; eksakt rute må kontrolleres. |
| Rosa | Dings egne bilder | `/posts/rosa` |
| Tinsta | Bilder av Tintin, med bildedato og alder | `/posts/tinsta` |
| Vipa | Apper og design; et visuelt bibliotek | `/posts/vipa` |
| Løva | Illustrasjoner, tegninger og maling | `/posts/lova` — visningsnavnet beholder «ø». |

Dette er brukerens ønskede struktur fra 2026-09-18. Brukeren ba om implementering,
men fullført integrasjon av alle fanene er ikke bekreftet i grunnlaget for denne
filen. Kontroller eksisterende løsning før du lager faner eller ruter på nytt.

## 5. Visuell retning og interaksjon

Uttrykket skal være personlig og tiltalende, med små «lovable» detaljer.
Revelogoen, headernavnet «Fjærdinghage» og hagemetaforen er sentrale elementer.
Brukeren vil utforske mikroanimasjoner uten å ødelegge eksisterende struktur.

Bevar nettstedets etablerte farger, typografi og lenkestil når en oppgave ikke
ber om noe annet. Brukeren viste spesielt til klassene
`text-accent sm:hover:underline` ved utforming av lenker.

En mørk bakgrunnsvariabel brukeren fant i koden var:

```css
--theme-bg: 200deg 6% 10%;
```

Dette er en kodehenvisning fra samtalen, ikke en bekreftelse på alle gjeldende
temafarger. Les den aktuelle stildefinisjonen før verdien gjenbrukes eller endres.

Bilder i galleriene skal etter brukerens ønske kunne gå helt ut til kanten på
mobil. Om-bildet skal ha naturlig høyde og kunne scrolle, ikke presses inn i en
fast skjermhøyde. Eksperimenter med 3D-logoen skal først skje på en separat side.

## 6. Funksjonsområder og kjent status

### 6.1 Jottacloud: bilde- og videogallerier

Målet er en enklere publiseringsflyt: Ding velger bilder og legger dem i et delt
Jottacloud-album, og nettstedet presenterer dem uten at hvert bilde må legges inn
manuelt i en artikkel. Brukeren ønsker å beholde eksisterende fotoarkiv og unngå
enda en bildeservice eller et ekstra abonnement.

I samtalen 2026-09-18 beskrev brukeren bildekonseptet og mekanismen som fungerende.
Det er en brukerbekreftet konsepttest, ikke en verifisering av dagens kode eller
produksjonsløsning. Video via Jottacloud ble deretter bedt utforsket.

Brukeren ga delte testalbum for både bilder og video i samtalene 2026-09-18.
Delingslenkene er ikke gjengitt i denne repo-klare versjonen, for å unngå å spre
medietilgang gjennom dokumentasjon som kan bli offentlig. Bruk prosjektets
bekreftede albumkonfigurasjon eller be om det aktuelle testalbumet ved behov.
Det er ikke verifisert hvilket album hver fane bruker.

For Tinsta skal bildedato og Tintins alder vises. Tidligere prosjektkontekst oppgir fødselsdatoen
`2025-04-08`; kontroller mot prosjektets eksisterende data før implementasjon. Alderen som hører til et bilde, skal knyttes til opptaksdatoen,
ikke til datoen siden åpnes. Brukeren bekreftet at bildedato finnes i
Jottacloud-data. Det er ikke fastslått her hvilket felt dagens kode bruker.

Ved videre arbeid må hentemetode, opptaksdato kontra opplastingsdato, eventuell
manglende metadata, bilde- og videovisning og oppdateringsflyt kontrolleres.
Ikke anta en bestemt API-kontrakt, varige direkte medie-URL-er eller umiddelbar
publisering bare fordi et delt album fungerer i nettleseren. Det er ikke
bekreftet her om løsningen henter ved bygging, i nettleseren eller på annen måte.

Verifisert layoutjustering lokalt 2026-09-28: Rosa, Vipa og Løva bruker nå
naturlige bildehøyder i CSS-kolonner som `photos.astro`, med 1/2/3 kolonner etter
skjermbredde og antall synlige medier. Tinstas rutenett er beholdt. Endringen ligger
i `PhotoGallery.astro` og `src/utils/gallery-layout.ts`; detaljer finnes i
`scripts/gallery-ui.md` og eksisterende albumdokumentasjon i
`scripts/garden-galleries.md`. Ikke committet/publisert i denne oppgaven.

### 6.2 Om-siden, CV og portefølje

Verifisert lokalt 2026-09-29: `src/pages/about.astro` starter med
`AboutNavigation.astro`, en navigasjonskomposisjon til CV og portfolio. Deretter
følger navneseksjonen (§6.7) og portrettavsløringen (§6.8). 3D-seksjonen er fjernet
fra Om-siden etter bestilling 2026-09-29; `#about-top` ligger nå rundt navigasjonen.
De tidligere CV-/porteføljelenkene nederst er beholdt. `/images/about.png` er
bevart som fil, men brukes ikke lenger på siden. Porteføljesiden beholder
3D-modellen og deler navne- og portrettkomponentene med Om-siden. Den nye
navigasjonen er bare på Om-siden. Appoversikten er beskrevet i §6.12.

Navigasjonen er implementert lokalt, ikke committet/publisert i denne oppgaven:

- Grunnlag: fire referansebilder, de to originale profilillustrasjonene og ni
  avleste rammer fra den 17,8 sekunder lange prototypevideoen i brukerens mappe
  `navigasjon til cv og portfolio i about`. Illustrasjonene er kopiert uendret til
  `public/about-navigation/profile-default.png` og `profile-hover.png`.
- SVG-komposisjonen bruker selvhostet Radley, skrå «ding», loddrett «chen»,
  «cv» med venstrepil, «portfolio» med høyrepil og et rundt portrett.
  Faktiske lenker bruker BASE_URL og går til `/cv/` og `/portfolio/`.
- Standardportrettet får `grayscale(1)` og `mix-blend-mode: luminosity` i CSS.
  Ved hover kryssoppløses det til eksporten med nebula, rev og DC-logo over
  350 ms. Nebula-effekten ligger i PNG-eksporten, ikke i en ny animert shader.
  Samtidig får d/c, lenkene og pilene prosjektets aksentfarge. Bakgrunn og
  tekst følger eksisterende temavariabler: mørk/lys flate, gul/lilla aksent.
- Pilene er skjult i standardtilstanden på enheter med hover og tones inn/ut
  over 450 ms ved hover på navigasjonen eller tastaturfokus.
- På enheter uten hover starter navigasjonen i standardtilstanden. Etter 1,5 s
  tones portrett, aksentfarger og piler inn over 600 ms med ease-in-out. Den ferdige
  tilstanden blir stående. CSS-animasjonene starter ved hver ny sideinnlasting,
  inkludert refresh; en pageshow-lytter starter dem på nytt ved retur fra nettleserens
  sidecache (bfcache). Lenker virker også før animasjonen er ferdig.
- Tastaturfokus gir samme tilstand og en synlig fokusramme rundt lenken.
  Redusert bevegelse viser den ferdige mobiltilstanden direkte uten ventetid eller
  animasjon. Ingen nye pakker eller endringer i headeren.
  Mobilautostart er kontrollert med Astro-sjekken (0 feil/0 advarsler), og desktop
  er kontrollert uten automatisk animasjon eller konsollfeil. Selve touch-avspillingen
  og retur via bfcache er ikke prøvd på en fysisk mobil.
- Kontroll: Astro 0 feil, 0 advarsler, 3 eksisterende hint. Begge bildekopier er
  sammenlignet byte for byte. Nettlesertest ved 1280 × 900 i lyst og mørkt tema
  bekreftet standard/hover, Radley, temafarger og begge lenkemål. Tab-fokus og Enter
  til CV er prøvd. 390 og 320 px er kontrollert; ingen overbredde i navigasjonen,
  og lenkenes trykkflater er minst 44 px høye ved 320 px. Fysisk touch, skjermleser
  og OS-styrt redusert bevegelse er ikke testet. Eksisterende mørkt tema gjenopprettes
  etter kontrollen. Publiseringshistorikk for tidligere seksjoner står i §6.9.

Brukerens ønskede Om-side fra 2026-09-21 består av eksisterende header/layout,
et stort `about.png`-bilde i full nettleserbredde og to lenker under bildet.
Lenkene skal stå på hver sin sentrerte linje, ha avstand til bildet og bruke
nettstedets eksisterende stil. Målene er `/cv` og `/portfolio`.

Brukeren ønsket å lime bilde- og lenkedelen inn i den opprinnelige `about.astro`
for å beholde navigasjonen. Fjerning av `cactusTech` førte til en compiler-feil.
Ved opprydding må både deklarasjoner, imports og referanser i markup undersøkes;
ikke anta at feilen fortsatt finnes eller at en bestemt retting allerede er gjort.

På porteføljesiden ønskes en liten brødtekst med budskapet: Her vises først og
fremst visuelt innhold; arbeidsmetode og kundeoppdrag gjennomgås bedre i en
samtale eller kaffeprat. Endelig ordlyd og publisert versjon er ikke bekreftet her.

### 6.3 Festet velkomstartikkel

Brukeren ba 2026-09-24 om å feste «Velkommen til Fjærdingheim» øverst uavhengig
av publiseringsdato, både på forsiden og i «Alt som gror». Et lite `📌`-ikon
ble uttrykkelig ønsket.

Kontroller om dette allerede er implementert, hvor sorteringen skjer, og om
begge listene bruker samme logikk. Ikke anta at et bestemt frontmatter-felt
finnes. Behovet gjelder plassering i listen, ikke en endring av artikkelens dato.

### 6.4 Mikroanimasjon: rev + klikk + sommerfugl

Brukeren ville først utforske en fugl eller sommerfugl som flyr over siden ved
klikk på logo/header eller ved refresh. Den konkrete testen som ble valgt
2026-09-18, var klikk på reven som utløser en flyvende sommerfugl.

Status: valgt eksperiment og diskutert kode; faktisk repo-integrasjon og testing
er ikke bekreftet her. Ikke behandle refresh-trigger, automatisk avspilling eller
fugl som endelig valgte løsninger. Bevar eventuell eksisterende lenkefunksjon
på logoen når interaksjonen undersøkes.

### 6.5 Interaktiv 3D-logo: rev + DC

Nåstatus 2026-09-29: 3D-seksjonen er fjernet lokalt fra Om-siden (§6.2), men
beholdt på porteføljesiden og `/logo-test/`. Det følgende beskriver den tidligere
integrasjonen og kontrollen av selve komponenten.

Dette er det siste konkrete visuelle eksperimentet, diskutert 2026-09-27.
Brukeren leverte en SVG som grunnlag etter at tidligere visninger ikke viste
reven slik forventet.

Kravene er tydelige:

- Bare reven og DC-grafikken skal være ett samlet, interaktivt 3D-objekt.
- Bakgrunnen skal være stillestående: mørk bakgrunn med gradients, rutenett og
  runde/avrundede former. Ikke roter hele komposisjonen som ett flatt kort.
- Bruk den faktiske SVG-en som grunnlag; ikke erstatt logoen med en ny tolkning.
- Forsøket ble først lagt på en egen testside. Brukeren bestilte deretter
  integrasjon øverst på Om-siden, med eksisterende bilde bevart. En eventuell
  ny porteføljeside er fortsatt ikke bestilt.

Implementert lokalt 2026-09-27 på `main` i `/Users/ding/Github/cactus`:

- `src/pages/about.astro` viser modellen kant til kant øverst i innholdet.
  `src/pages/logo-test.astro` beholder en separat testvisning. Begge bruker
  `Base.astro` med eksisterende header og navigasjon. Porteføljesiden er ikke endret.
- Alle modellkontroller ligger i en lukket `details`-meny bak én ikonknapp.
  Klikk/Enter åpner menyen; Escape, nytt klikk eller klikk utenfor lukker den.
  Dra-hintet og de små hjelpetekstene er fjernet. Skjermleseretiketter og
  usynlige statusmeldinger er bevart.
- Meny, zoom, nullstilling, Escape og lukking utenfor er kontrollert i nettleseren.
  Full bredde uten horisontal rulling er verifisert ved 1280 og 390 piksler;
  det eksisterende bildet lastes fortsatt. Ingen konsollfeil observert.
  Temabytte ble ikke utført i denne deloppgaven: automatisk godkjenningskontroll
  avviste endring av den vedvarende brukerinnstillingen.
- `src/components/DingLogo3D.astro` og `src/scripts/ding-logo-3d.js` integrerer
  visningen fra originalfilen `/Users/ding/Desktop/DingLogo-3D-forhandsvisning.html`.
- `public/logo-3d/ding-logo.glb` er byte-identisk med
  `/Users/ding/Desktop/DingLogo-rev-DC.glb`. Bakgrunn og SVG-reserve er hentet
  fra HTML-filens innebygde SVG-er til samme mappe. Original-SVG-en som separat
  fil er ikke lest i denne oppgaven; grafikken er ikke tegnet på nytt.
- Modellen lastes separat ved behov. Visningen bruker WebGL 2, med den leverte
  programvarerendereren og SVG-reserven som alternativer. Ingen nye avhengigheter.
- Rotasjon ved dra, vinkelvalg, zoom, dybde, automatisk rotasjon og nullstilling
  er kontrollert i Codex-nettleseren med WebGL 2. Tastaturstyrt zoom og Home er
  prøvd. Desktop- og mobilbredde (390 px), samt lyst og mørkt tema, er inspisert.
  Fysisk berøring på mobil, redusert bevegelse og fallback uten WebGL er ikke
  testet i denne økten.
- Hover og pekerlys oppdatert 2026-09-27: responsen følger logoens størrelse,
  med inntil 6°/5° tilt og 8/6 piksler forskyvning. Dette gjør responsen synlig
  rett forfra; den første varianten ga svært lite utslag over selve logoen.
  Et mykt lys følger pekeren på front og kanter, avgrenset til selve modellen.
  Bakgrunnen står stille. Tilt og lys glir tilbake ved pekerutgang og pauses
  under dra og automatisk rotasjon. Berøring og redusert bevegelse gir ikke hover.
- Verifisert i WebGL-nettleseren fra nyinnlastet/nullstilt modell før dra:
  synlig forskyvning og lysrefleks ved ulike pekerposisjoner. Deretter er dra og
  nullstilling kontrollert; ingen konsollfeil observert. Isolerte tester bestod
  for den faktiske modellmatrisen og lysparametrene fra null, retur, bevart
  dra-vinkel, berøring, redusert bevegelse og animasjonsstopp. Programvarerendererens
  lys og alfamaske er testet på syntetisk geometri, ikke en fysisk mobil.
  `pnpm run check` bestod på nytt med 0 feil og 3 eksisterende hint.
- Lokal `pnpm run build` bestod under arbeidet med Om-siden, med Node 24.10.0
  og pnpm 10.18.3. Astro-kontrollen ga 0 feil, 0 advarsler og 3 hint i
  eksisterende filer; 118 sider ble bygget,
  og Pagefind-indekseringen fullførte. Prosjektets `.nvmrc` angir 24.21.0,
  mens tilgjengelig Node 24.10.0 oppfyller `package.json` sitt krav `>=24 <25`.
  Lokal server på `127.0.0.1:4325` ble verifisert med arbeidsmappe i originalrepoet.

Publisert 2026-09-27 kl. 23:29 norsk tid fra commit
`6beb28cf6d8d22b21f2b88ddd8cfe82b5791a4c4` til https://dingchen.no/about/.
GitHub Actions-kjøring https://github.com/dingfjaer/cactus/actions/runs/36351772238
fullførte både bygg og GitHub Pages-deploy med `success`. Den publiserte siden
ble åpnet i nettleseren: 3D-modellen ble klar, ikonmenyen åpnet, og ingen
konsollfeil ble observert. Eksisterende bilde og CV-/porteføljelenker er bevart.

Publiseringsflyten er fortsatt `.github/workflows/deploy.yml` ved push til
`main` i `dingfjaer/cactus`. Repoet hadde en eksisterende endring i `AGENTS.md`;
den er bevart lokalt og holdt utenfor commit. Prosjektkonteksten følger arbeidet.

### 6.6 Skriving og publisering fra mobil

Brukeren ønsker å kunne skrive og redigere artikler fra mobil. Første prioritet
er praktisk skriving og redigering; umiddelbar publisering er ikke nødvendig.
En god publiseringsflyt direkte fra mobilen kan komme senere.

Ingen endelig mobilredaktør, CMS, Git-integrasjon eller automatisert flyt er
bekreftet valgt. Ikke innfør en bestemt tjeneste som om den allerede var avtalt.

### 6.7 Interaktiv navneseksjon på Om- og porteføljesiden

Navneanimasjonen er justert lokalt 2026-09-29. Endringen er ikke committet eller
publisert i denne oppgaven. Begge sider bruker samme `AboutName.astro`,
`src/scripts/about-name.js` og den nye tidsmodulen `src/scripts/name-reading.mjs`.

- Radley Regular ligger selvhostet i `public/about-name/` med OFL-lisens fra
  https://github.com/google/fonts/tree/main/ofl/radley. Rev og fjær kommer fra
  brukerens originale SVG-er. 顶, 陈 og 羽 bruker en selvhostet tegnvariant av
  Zhi Mang Xing med OFL-lisens fra Google Fonts. Ingen nye avhengigheter.
- Den tidligere 22-trinns scrollsekvensen er erstattet av automatisk avspilling.
  På desktop starter den når navneseksjonen nærmer seg toppen (18 % av viewporten).
  Ding, Chen og Fjær starter med omtrent 2,3 sekunders mellomrom. Hver bokstav,
  illustrasjon og markering beveger seg over 1,8 sekunder med ease-in/ease-out;
  detaljene overlapper. Hele avspillingen tar ca. 8,5 sekunder uten videre scrolling.
- Leseretningen og innholdet er beholdt: regnbue gjennom ding med rev og 顶,
  «i toppen av et fjell», «what does the fox say», chen med 陈, «1990», «Wuhan»,
  «Norge», «2014», fjær med fjærillustrasjon/羽, «gift med en norsk mann», «Fjær».
  Alle tekstmarkeringer bruker den samme tykke gule flaten. Bokstavene beholder
  regnbuen frem til desktop-morphen, der fargen tones til svart før sammensetting.
- Fra 900 × 700 px står komposisjonen midlertidig fast. Den gamle lesestrekningen
  på flere skjermhøyder er fjernet; det gjenstår 195svh til morph og overgang.
  Morphen blir tilgjengelig først når siste «Fjær»-markering er ferdig. Starten
  forankres til scrollposisjonen på dette tidspunktet, med tilsvarende ekstra
  plass hvis brukeren allerede har scrollet. Dermed starter ikke morphen av seg
  selv ved slutten av avspillingen. Native scrolling avskjæres ikke.
- Videre scrolling krymper c loddrett opp i d. Deretter løftes den samlede logoen
  rett opp langs d-ens senterakse til 16 px fra toppen. Morphen reverseres ved
  scrolling opp; den ferdige navneavspillingen beholdes. Når hele navneseksjonen
  er nedenfor viewporten igjen, klargjøres en ny inngang ovenfra.
- På mobil/lav skjerm ruller teksten normalt. Hver av de tre navnedelene spiller
  automatisk når den blir synlig; deler utenfor skjermen venter. Ingen bokstavmorph
  på mobil: den ferdige logoen vises etter siste markering ved seksjonens slutt.
  Rask scrolling forbi en del fullfører den, slik at oversprungne animasjoner
  ikke forsinker senere innhold. Skjult fane pauser navneavspillingen.
- Scrollstyrt morph beholder ca. 320 ms utjevning. Animasjonsløkken stopper når
  avspillingen er ferdig og scrollvisningen har tatt igjen posisjonen, eller når
  avspillingen venter på neste synlige del. Lyttere/observer ryddes ved avmontering.
- `src/assets/about-name/type.json` inneholder d/c fra Radley og målkonturer fra
  `public/logo-3d/poster.svg`. Konturene interpoleres under sammensetting, og en
  liten inset stiller c rett under målet. `public/about-name/monogram.svg` bruker
  originalgrafikken med tett viewBox.
- Snarveispilene er beholdt: 96 × 96 px, ned til venstre for opp. Ned hopper over
  gjenværende navneavspilling, spiller desktop-morphen i ca. 2,2 sekunder og flytter
  til portrettet over ca. 0,9 sekunder, med 10 % av det røde bildet avslørt.
  Mobil går direkte til samme portrettposisjon med ferdig logo. Egen scrolling,
  berøring, pekertrykk, navigasjonstaster eller resize avbryter snarveiavspillingen.
  Opp går til dokumentets topp. Fokus følger hoppet; pilene har skjermleseretiketter.
- Redusert bevegelse viser ferdige markeringer og svarte bokstaver uten automatisk
  avspilling, sticky scrollrom eller bokstavflytting. Innholdet finnes også uten JS.
- Kontroll 2026-09-29: seks automatiserte tester i `tests/name-reading.test.mjs`
  dekker overlapp/easing, ferdig avspilling uten scrolling, mobilens synlighetsstyring,
  pause, morph etter siste markering, reversering, ny inngang, rask scrolling,
  redusert bevegelse og snarveiens morph/10-prosentlanding. Astro-kontrollen bestod
  med 0 feil, 0 advarsler og 3 eksisterende hint. Nettlesertest på Om-siden ved
  1280 × 720 bekreftet full avspilling uten videre scrolling, ventende morph,
  scrollstyrt sammensetting og reversering. Porteføljesiden ved 390 × 844 bekreftet
  at Fjær venter utenfor viewporten, deretter fullfører avspilling og viser ferdig
  logo uten bokstavflytting. Snarveien lander fortsatt på 10 % portrettavsløring.
  Ingen nye konsollfeil ble observert. Preview på port 4325 er bekreftet å kjøre
  fra originalrepoet. Fysisk mobil, OS-styrt redusert bevegelse og produksjonsbygg
  er ikke testet i denne justeringen.

Publiseringshistorikk for de delte seksjonene står i §6.9. Brukerens eksisterende
endring i `AGENTS.md` er bevart. Denne justeringen omfatter ikke commit eller deploy.

### 6.8 Portrett med scrollstyrt avsløring

Implementert lokalt 2026-09-28 i `src/components/AboutPortrait.astro` og
`src/scripts/about-portrait.js`, etter beskrivelsen og de to bildene. Videoen
brukeren nevnte fulgte ikke med meldingen; ingen video er undersøkt.

- Originalene `/Users/ding/Desktop/portrait 1.png` og `portrait 2.png` er kopiert
  uendret til `src/assets/about-portrait/portrait-1.png` og `portrait-2.png`.
  Begge er 2048 × 2732. Astro lager responsive WebP-varianter; begge lag lastes
  på forhånd for å unngå forsinkelse når den skjulte tegningen avsløres.
- Det hvite bildet ligger under det røde. En horisontal avsløringskant går fra
  toppen til bunnen med en svak skygge langs kanten. Bildene flyttes ikke
  i forhold til hverandre. Hele tegningen er synlig uten beskjæring.
- Seksjonen går helt ut til kantene. Bildet står midlertidig fast og sentrert
  i høyden, med 180svh scrollrom. De første/siste 10 prosentene holder hvert
  sluttbilde; mellom disse avsløres rødt med myk start/slutt og ca. 320 ms
  utjevning. Scrolling oppover reverserer avsløringen. Native scrolling bevares.
- Uten JavaScript eller med redusert bevegelse vises det ferdige røde portrettet
  uten ekstra scrollrom. Scroll-, resize- og pageshow-lyttere ryddes ved avmontering,
  og animasjonsløkken stopper når bildet har tatt igjen scrollposisjonen.
- Kontrollert i lokal preview ved 1280 × 720 og 390 × 844: hvitt utgangspunkt,
  delvis og full rød avsløring, reversering, samsvarende bilderektangler og ingen
  horisontal overbredde. Mobilens logo forblir ferdig mens portrettet avsløres.
  Begge originalkopier er sammenlignet byte for byte. Isolerte tester bestod for
  sekvensrekkefølge, reversering, endepunkter og redusert bevegelse.
  Fysisk touch og OS-styrt redusert bevegelse er ikke kontrollert.
- Endelig `pnpm check`: 0 feil, 0 advarsler, 3 eksisterende hint. `pnpm build`
  fullførte med exit 0, inkludert bildeoptimalisering og Pagefind. Endringen til
  forhåndslasting ble deretter kontrollert i endelig Astro-sjekk og lokal preview.
  Ingen nye konsollfeil observert. Preview kjører fra originalrepoet.

### 6.9 Felles introduksjon på Om- og porteføljesiden

Historikk 2026-09-28 (Om-siden er senere endret lokalt, se §6.2):
Etter brukerens bestilling viste både `/about/` og `/portfolio/`
3D-logoen, navnehistorien og portrettavsløringen. `DingLogo3D`, `AboutName` og
`AboutPortrait` gjenbrukes direkte. Det er ikke laget separate kopier av
animasjonskode eller medier. Senere komponentendringer påvirker derfor begge
sidene. Brukeren vil arbeide videre med porteføljelenkene senere; lenketekster,
adresser og kaffetekst er beholdt. Den festede logoen går til toppen av siden
brukeren er på. Lokal kontroll: Astro 0 feil/0 advarsler/3 eksisterende hint;
tidslinjetestene bestod. Lenkeadresser og tekst er sammenlignet med forrige
versjon og bevart. Desktop-preview bekrefter riktig rekkefølge, full
portrettavsløring og lenkene under. Commit/push/deploy er bestilt; fullført
status er nå verifisert. GitHub-workflowen kjørte komplett produksjonsbygg
og Pagefind før deploy.

Publisert 2026-09-28: kodecommit `1ff2f1ef785698a9aed5c2453df2918606e45c42`.
GitHub Pages-kjøring https://github.com/dingfjaer/cactus/actions/runs/36413347975
fullførte med `success` for både build og deploy. `/about/` og `/portfolio/`
på https://dingchen.no svarte HTTP 200, og HTML for navne- og portrettkomponentene
er identisk på de to offentlige sidene. Nettleserkontroll på porteføljesiden
bekreftet innlastet 3D-modell, aktive animasjonskomponenter, begge portrettbildene
og de opprinnelige lenkene under. Mobilbredde 390 px er kontrollert lokalt uten
horisontal overbredde. Dokumentasjonsoppfølgingen endrer bare denne filen og
publiseres med `[skip ci]`; koden på nettsiden forblir den verifiserte committen.

### 6.10 Innleggsnavigasjon og «Hva skjer nå»

Implementert lokalt 2026-09-28, ikke committet/publisert i denne oppgaven:

- Enkeltinnlegg får samme `Paginator.astro` som `/posts/`, med Forrige/Neste
  under artikkelen. `posts/[...slug].astro` bruker `sortPostsPinnedFirst`:
  festede innlegg først og gjeldende dato-/oppdateringssortering innad i gruppene.
  Første/siste innlegg får bare lenken som finnes. Produksjon utelater kladder
  gjennom eksisterende `getAllPosts`. Skjermleserlenkene inkluderer artikkeltittel.
- Fullskjermgallerienes chevroner følger det aktive filteret og håndterer begge
  ender. Video og HLS ryddes ved bytte. Se `scripts/gallery-ui.md`.
- `NowWidget.astro` ligger over artikkellisten på forsiden. Den viser seks temaer
  fra `src/data/now.ts`: Driver med, Hører på, Leser, Ser på, Sett ferdig og Tintin.
  Uttrykket er et responsivt glasskort inspirert av brukerens musikkspillerbilde.
  Originale Phosphor-SVG-er ligger i `src/assets/phosphor/`, med MIT-lisens og kilde.
- Temaene byttes hvert sjuende sekund, med Forrige, Pause/Play og Neste.
  Hover, tastaturfokus og skjult fane pauser timeren midlertidig. Redusert bevegelse
  starter uten automatisk bytte. Uten JavaScript vises temaene som statisk innhold.
  Kontroller og fokus har skjermleseretiketter; automatisk bytte leses ikke opp.
- Årsindikatoren viser kalenderdagsbasert fremdrift i inneværende år. Hover/fokus
  viser dagens dato. `now-calendar.mjs` bruker Europe/Oslo, håndterer skuddår og
  deler Tintins eksisterende aldersberegning. Dato og alder oppdateres hvert minutt
  og når fanen blir synlig igjen, uten å kreve nytt bygg.
- Astro-kontroll bestod med 0 feil, 0 advarsler og 3 eksisterende hint. 11 kalender-
  og galleritester bestod, inkludert Oslo-årsskifte, sommertid og skuddår.
  Separat test av faktisk innleggsrute/datamodul bekreftet pinned-sortering,
  oppdateringsdato, produksjonsfiltrering av kladder, første/siste og ett/ingen innlegg.
  Nettleseren bekreftet første, mellomliggende og siste artikkel, samt widgetens
  innhold, temabytte, pause, datovisning og mobilbredde 390 px uten overbredde.
  Fysisk mobil og OS-styrt redusert bevegelse er ikke testet.

### 6.11 På tur-case i porteføljen

Integrert lokalt 2026-09-29 på `/portfolio/pa-tur/`, ikke committet eller publisert
som del av denne oppgaven. Kilden er brukerens leveranse i
`/Users/ding/Jottacloud/DingApps/Fjaerdinghage/filer for dingchenno Astro/pa-tur/`.

- `src/pages/portfolio/pa-tur.astro` bruker eksisterende `Base.astro` med `wide`.
  Nettstedets header, navigasjon, tema og footer er beholdt. Case-designet beholder
  sitt mørke prosjektpanel og lyse leseflate, også når nettstedet bruker mørkt tema.
- Over casen ligger et sentrert tekstkort med stiplet gullramme og brukerens
  fire avsnitt om AI-generert design. Kortet ligger i sidefilen, uten å endre
  den leverte case-komponenten.
- `src/components/pa-tur/` inneholder levert `index.html`, `case.css`, `case.js`
  og Astro-komponenten `PaTurCase.astro`. HTML/CSS/JS er kopiert uendret.
  Adapteren henter innhold mellom CASE-markørene, erstatter indre main med article,
  og tilpasser mediestier og retur til portfolio gjennom BASE_URL. Et lokalt
  stiltillegg gjenoppretter originale h3-vekter etter Tailwinds reset.
- Alle 15 ferdige WebP-bilder og MP4-opptaket ligger byte-identisk i
  `public/pa-tur/`. Ingen nye pakker. Video lastes på forespørsel, uten autoplay.
  Brukerens eksisterende originalmappe `public/images/På tur case Portfolio/`
  er ikke endret, fjernet eller brukt som ekstra mediekopi i siden.
- `portfolio.astro` har ny intern lenke over de tidligere lenkene:
  «Showcase av På tur-appen. Gjett hvem som laget den?» Eksisterende innhold er bevart.
- Kontroll: Astro 0 feil, 0 advarsler og 3 eksisterende hint. Original HTML/CSS/JS,
  alle 16 medier, unike ID-er, mediereferanser og ankermål er kontrollert. Lokal
  preview på port 4325 kjører fra originalrepoet. Desktop 1280 × 720 er sammenlignet
  med den leverte frittstående siden. Fast prosjektpanel, ankerlenker, bildeforstørrelse,
  fokusretur/Escape, kartvalg, porteføljelenke og retur er prøvd. MP4-videoen ble
  avspilt helt til slutt (ca. 8,9 sekunder) uten avspillingsfeil.
- Mobilbredde 390 px er inspisert med kartvalg og bildeforstørrelse uten overbredde.
  Ved 320 px holder case-innholdet seg innenfor viewporten; nettstedets eksisterende
  footer har fortsatt ca. 15 px overbredde. Den er ikke endret her. Kontrollen brukte
  nettstedets mørke tema. Fysisk mobil, OS-styrt redusert bevegelse, skjermleser og
  fullt produksjonsbygg er ikke testet i denne integrasjonen.

### Claudes gjennomgang av På tur

Integrert lokalt 2026-09-29 på `/portfolio/pa-tur-gjennomgang/`. Kilden er den
brukerleverte `PaTur-gjennomgang.html` fra iCloud-mappen `CoDing`. Den beskriver
versjon 0.3 (build 17), lest 1. september 2026; påstandene i rapporten er bevart
som historisk innhold, ikke kontrollert mot dagens separate app-repo.

- `src/components/pa-tur-review/index.html` er en byte-identisk originalkopi.
  `PaTurReview.astro` henter innholdet etter style-blokken; dokumentmetadata og
  originalens lang-script kjøres ikke. `review.css` inneholder originalstilene
  avgrenset til komponenten, med liste-/lenkestiler tilpasset Tailwind-reset,
  egen klasse i stedet for Tailwinds `prose` og tilpasning til smale skjermer.
- Sidefilen bruker eksisterende `Base.astro` med `wide`. Rapporten beholder
  Fraunces, Archivo og IBM Plex Mono fra Google Fonts, egne temafarger, ti
  seksjoner, fast innholdsmeny og SVG-diagram. Nettstedets temavalg styrer også
  rapporten. Returlenker går til På tur-casen.
- Nederst på `/portfolio/pa-tur/` ligger brukerens «Fun fact»-tekst med samme
  `case-note`-klasse og stiplede gullramme som boksen øverst. Setningen «Jeg ba
  Claude gjennomgå kode Codex(ChatGPT) har laget.» lenker til gjennomgangen.
- Kontroll: Astro 0 feil, 0 advarsler, 3 eksisterende hint (89 filer). Originalen
  er sammenlignet byte for byte; unike ID-er og alle ti ankermål er kontrollert.
  Lokal nettleserkontroll i lyst/mørkt tema, desktop 1280 × 900 og mobil 390 × 844:
  ingen overbredde på gjennomgangssiden, tabeller og diagram ruller internt,
  innholdsanker via Enter og lenkene mellom case/gjennomgang fungerer. Begge
  tekstbokser har identisk ramme/padding, og bunnboksen er visuelt kontrollert.
  Fysisk touch, skjermleser og fullt produksjonsbygg er ikke testet. Mørkt tema
  gjenopprettet. Ingen commit, push eller deploy utført i denne oppgaven.

### 6.12 Enkel oversikt over iOS-appene

Implementert lokalt 2026-09-29 på `/portfolio/ios-apper/`, ikke committet eller
publisert i denne oppgaven. `src/pages/portfolio/ios-apper.astro` bruker eksisterende
`Base.astro` med `wide` og nettstedets lyse/mørke temafarger.

- Beskrivelsene av Ding Ding!, På tur og På tide er hentet fra originalens én-sides
  `dings-apps.pdf` i brukerens `ios-apper`-mappe. PDF-en er både tekstlest og visuelt
  kontrollert. Innholdet presenteres som korte avsnitt uten nye funksjonspåstander.
- Oversiktsbildet fra `ios-apper/oversikt.png` ligger rett under ingressen og
  over første skillelinje, i full innholdsbredde og uten beskjæring. Responsive
  WebP-varianter i 640/1280/2080 px ligger i `public/ios-apper/`.
- Tre skjermbilder per app er valgt fra undermappene: Ding Ding! 1287/1284/1285,
  På tur 1257/1259/1268, På tide 1282/1278/1280. WebP-varianter i bredde 480/960 px
  ligger i `public/ios-apper/`, med srcset, lazy loading og beskrivende alt-tekster.
  Originalene er uendret; ingen nye pakker.
- Desktop viser tre bilder ved siden av hverandre. Mobil viser en horisontal,
  skrollbar bilderekke med neste bilde delvis synlig. Eksisterende `MediaViewer`
  gir bildeforstørrelse, neste/forrige og Escape per app. På tur har også lenke
  til den eksisterende casen. Tilbakelenken går til portfolio.
- «Hobbyprosjekter: iOS-apper bygget med AI (2026)» på `portfolio.astro` går nå
  til den interne siden i samme fane. PDF-filen er beholdt.
- Kontroll: Astro 0 feil, 0 advarsler, 3 eksisterende hint (87 filer). Lokal preview
  på port 4325 er bekreftet å kjøre fra originalrepoet. Desktop 1280 × 900 og
  mobil 390 × 844 er visuelt kontrollert i lyst/mørkt tema. Alle ni bilder lastet;
  ingen horisontal overbredde ved 390 px. Porteføljelenke og retur, bildeblaing,
  siste-bilde-grense, Enter, Escape og fokusretur er prøvd. Om-siden er kontrollert
  uten modell/canvas og med bevart `#about-top`. Fysisk touch, skjermleser og fullt
  produksjonsbygg er ikke testet. Mørkt tema er gjenopprettet etter kontrollen.

### 6.13 Faglige lesetips fra Raut og Medium

Seks innlegg fra [Raut #197](https://raut.no/197) er lagt til lokalt 2026-10-02,
med avsluttende dokumentasjonskontroll 2026-10-03. Samlingen har nå 34 Raut-innlegg
under `src/content/post/`. Kilder, filnavn og kontrollgrunnlag finnes i
`scripts/raut/manifest.json`; innleggsliste og redaksjonelle valg står i
`scripts/raut/README.md`. Tidligere Medium-arbeid er dokumentert i `scripts/medium/`.

- Raut-datoen er nyhetsbrevets utsendelsesdato; #197 er kontrollert til 2026-09-29
  både på utgaven og i arkivet. Innleggene har `draft: false`, `Rauting` og to
  emnetagger, eksisterende HTML-kildekort, «Key takeaways» og «Ding! 💡».
  Refleksjonene er KI-formulert på Dings oppdrag. Ingen bilder er lagt til.
- Den personlige skillen `hage-lesetips` er opprettet i
  `~/.codex/skills/hage-lesetips/` og er nå synlig i Codex sin skill-liste.
  Den støtter samme flyt fra Raut, Medium og leselister, med originalkildelesing,
  dublettkontroll og registrering av utilgjengelig innhold. Vanlig automatisk
  valg er aktivert; eksplisitt bruk er `$hage-lesetips` fulgt av lenken.
  Skillen er lokal for denne Mac-en og er ikke versjonskontrollert i cactus.
- Kontroll: Astro-sjekk med Node 24 og prosjektets pnpm ga 0 feil, 0 advarsler
  og 3 eksisterende hint. Alle seks filer er kontrollert for frontmatter, dato,
  tagger og doble kildelenker. Alle seks sider er åpnet i lokal nettleser, med
  riktig dato, kildekort og overskrifter. Eksempelinnlegget er visuelt kontrollert
  i lyst og mørkt tema på desktop. Preview på port 4325 er verifisert mot originalrepoet.
  Skill-validatoren og kontroll av UI-metadata bestod. Mobil og fullt
  produksjonsbygg er ikke kjørt i denne innholdsoppgaven.
- Ingen commit, push eller deploy er utført for dette tillegget. Brukerens
  eksisterende endring i `AGENTS.md` er bevart.

### 6.14 FigPal-peker og stickers

Implementert lokalt 2026-10-03. `src/components/FigPalPicker.astro` ligger i
felles `Header.astro`, til venstre for søk, med Phosphor Cursor Click-ikon.
Ni originale figurer fra Dings FigPals-mappe ligger i `public/figpals/`.
Mushroom er standard; valgt figur eller «Vanlig peker» huskes i localStorage.
Velgeren bruker nettstedets temafarger og kan betjenes med tastatur.

`src/scripts/figpals.ts` viser figuren som peker ved musebruk og legger en sticker
på klikkstedet. Over lenker, knapper og andre klikkbare kontroller skjules
FigPal-pekeren og vanlig håndpeker vises, også over ikoner inni kontrollene.
Stickers følger dokumentets scrollposisjon, animeres mykt inn/ut
og fjernes etter fem sekunder; maksimalt 30 er aktive samtidig. På berøring
brukes bare stickers, uten en svevende musepeker. Tekstmarkering, dragging,
inputfelter, canvas og dialoger unngår stickers. Lenker beholder normal oppførsel.
Redusert bevegelse slår av sticker-animasjonen, men beholder femsekundersgrensen.

Kontrollert i lokal preview fra originalrepoet: figurbytte, standardfigur,
lagret valg etter oppdatering/navigasjon, «Vanlig peker», tastatur/Escape,
femsekundersgrense, scrollforankring, lys/mørk meny og header/velger ved desktop,
390 og 320 px. Søkedialogen åpner fortsatt. Alle ni SVG-ene lastes.
Astro-sjekk: null feil, tre eksisterende hints. Fysisk berøringsenhet og
redusert-bevegelse-innstilling er ikke nettlesertestet. Full produksjonsbuild og
publisering er ikke utført for denne endringen.

### 6.15 Spira: innholdstyper, Underveis og Dingo i hagefanene

Implementert lokalt 2026-10-03. Spira på `/posts/` har filtrene **Alle**,
**NerDing** og **KI-oppsummert**, med synlig forklaring for de to siste. Filteret er en enkel tekstrad med
strek i aksentfargen under aktivt valg, uten boks eller fylt bakgrunn.
Innholdstype beskriver hva teksten tilbyr leseren, ikke om KI har vært involvert
i språkvask. Emneknaggene og de andre hagefanene er beholdt.
NerDing har beskrivelsen «Egne tanker, små oppdagelser og notater i vekst.»
Navnet brukes også internt: `contentType: nerding` i schema, innlegg og maler,
og `?type=nerding` i URL-er. `src/utils/spira.ts` har ett eksplisitt alias for
det tidligere filternavnet, slik at eldre lenker og lagrede utvalg fortsatt kan
leses. Nye URL-er og lagrede filtre bruker `nerding`. Nettleserkontroll
bekreftet sju NerDing-innlegg, oppdatering av eldre filterlenke til ny URL og
bevaring av et gyldig lagret utvalg. Preview-cachen ble regenerert etter
schema-endringen. Innleggenes brødtekst er uendret.

- Frontmatter: `contentType: nerding` (standard) eller
  `contentType: ki-oppsummert`. De 63 publiserte innleggene er klassifisert:
  7 personlige tekster/notater i NerDing; 54 Raut-/Medium-lesetips, «The Courage
  to design» og «Fargeblind og UX» i KI-oppsummert. Bare metadata er endret.
  Nye lesetips/sammendrag skal få eksplisitt `contentType: ki-oppsummert`.
- `inProgress: true` gir **🌱 Underveis** ved datoen i alle innleggsoversikter,
  og en forklaring i artikkelhodet. Brukeren valgte «Hobbyskam» og
  «Hva abonnerer jeg på og hvor mye jeg betaler hver måned». Dette er uavhengig
  av innholdstype og `draft`; kladder blir ikke publisert av dette merket.
  Begge vanlige innleggsmalene viser de nye feltene.
- `SpiraExplorer.astro` og `src/scripts/spira.ts` forbedrer den eksisterende
  serverrenderte, paginerte oversikten. Uten JavaScript finnes fortsatt den
  vanlige listen og sidelenkene. Med JavaScript filtreres hele det publiserte
  arkivet, med ti innlegg per side, festede først og eksisterende datosortering.
- **🎲 Dingo** og «Trekk på nytt» viser først en stor, sentrert 3D-terning
  i omtrent 1,6 sekunder, før det nye utvalget vises. Terningen bruker
  temafargene. Redusert bevegelse gir en kort, statisk visning; Escape avbryter
  uten å endre utvalget. Doble klikk starter ikke flere samtidige trekninger.
  Dingo kaster nå en rettferdig sekssidet terning (nettleserens kryptografiske
  tilfeldighetskilde med rejection sampling) og trekker 1–6 unike innlegg fra
  valgt filter. Antallet følger terningens faktiske forside ved landing. Alle
  innlegg har lik sjanse; finnes færre enn kastet, vises alle tilgjengelige. Festede får verken prioritert plass eller knappenål i
  Dingo. «Trekk på nytt» trekker igjen; «Tilbake til nyeste» gjenoppretter
  den vanlige rekkefølgen innenfor filteret. `src/utils/spira.ts` har trekningen
  og valideringen av lagrede utvalg.
- Rosa, Vipa, Løva og Tinsta har samme Dingo-knapp, animasjon og 1–6-regel.
  `PhotoGallery.astro` / `src/scripts/gallery-dingo.ts` trekker innenfor
  Alle/Bilder/Videoer. «Trekk på nytt» kaster på nytt, «Tilbake til alle» viser
  det aktive filterets komplette innhold. Tomme filtre deaktiverer trekning.
  Utvalget og filteret huskes per galleri i sessionStorage i samme fane;
  filterbytte avslutter Dingo. Mediefremviseren blar bare i utvalget, i trukket
  rekkefølge. Tinstas dato/alder og galleriutforming er bevart.
- Felles `DingoRoll.astro` / `src/scripts/dingo-roll.ts` viser kastet, lar den
  valgte siden lande vendt mot leseren og viser «Du kastet N!». `src/utils/dingo.ts`
  har terningkast og tilfeldig utvalg uten duplikater. Redusert bevegelse viser
  resultatet statisk i 0,5 sekunder. Sidebytte og Escape avbryter ventende trekning.
- Filter, sidenummer og Dingo-modus ligger i URL-en. Utvalget ligger i
  nettleserhistorikken og sessionStorage, og beholdes ved tilbakeknapp,
  oppdatering og retur via Spira/Alt som gror i samme fane. Utgåtte eller
  feilaktige lagrede utvalg valideres mot det aktive, publiserte utvalget.
- `ThemeProvider.astro` bruker mørkt tema ved første besøk eller utilgjengelig
  lagring. Et eksplisitt lagret lyst/mørkt valg respekteres; OS-temabytte
  overstyrer ikke brukerens valg. Innleggstitler i `PostPreview.astro` har
  understreking og fargeendring ved hover, men ingen understreking i standardtilstanden.
  Tastaturfokus har egen markering. Artikkelens vanlige lenker
  beholder sin tidligere stil.

Kontroll: Astro 0 feil, 0 advarsler, 3 eksisterende hints (101 filer). Åtte tester i
`scripts/spira.test.ts` og `scripts/dingo.test.ts` verifiserer alle seks kast,
rettferdig talltrekning, små/tomme utvalg, ingen duplikater, lagret utvalg,
overgang fra eldre filternavn til NerDing og
førstegangs-/lagret tema (også når lagring blokkeres). Kjør med Node 24:
`node --experimental-strip-types --test scripts/spira.test.ts scripts/dingo.test.ts`.
Lokal nettleserkontroll bekreftet begge filtre, terningstyrt antall funn, ny trekning,
retur fra artikkel via historikk og meny, oppdatering, paginering, festet innlegg,
Underveis-forklaring og titler uten understreking på forsiden/Spira.
Desktop og 390/320 px er kontrollert, uten sideveis overbredde i Spira.
Terningkastet er kontrollert sentrert på desktop og ved 390 px: begge knapper,
nytt utvalg etter animasjonen, tilbakeført tastaturfokus og avbrudd med Escape.
Alle fire gallerier er kontrollert med kast som samsvarer med synlig antall;
Vipas videofilter, Rosas tomme videofilter, refresh, gjenoppretting av hele
galleriet og fullskjermblaing bare i utvalget er prøvd. Tinstas dato/alder er
bevart, uten overbredde ved 390 px. Terningen er visuelt kontrollert i begge temaer.
Redusert bevegelse er implementert, men ikke kontrollert i nettleseren.
Lyst/mørkt tema og tastatur er prøvd. Førstegangsvalg er testet mot selve
ThemeProvider-scriptet; fysisk mobil og fullt produksjonsbygg er ikke testet.
Preview på port 4325 kjører fra originalrepoet. Astros utdaterte utviklingscache
måtte regenereres etter schema-endringen. Kontrollene ovenfor gjelder lokal
implementasjon; GitHub Pages-deploy er ikke verifisert for Dingo-utvidelsen.

### 6.16 Felles knapp til toppen

`src/components/BackToTop.astro` brukes i `Base.astro` og de selvstendige
sidene `photos.astro`, `design.astro` og `videos-poc.astro`. Den gamle lokale
knappen/scriptet i `BlogPost.astro` er erstattet av den felles komponenten.
En rund ikonknapp med chevron opp vises nede til høyre når headeren er passert
(artikkelhodet på innlegg, 320 px på sider uten header). Den skjules ved toppen
og er da ikke fokuserbar. Klikk/Enter flytter fokus tilbake til toppen og
scroller mykt; redusert bevegelse bruker direkte hopp og ingen overgang.
Størrelsen er 44 px på mobil og 48 px på desktop, med nettstedets temafarger.
På Om-/porteføljesiden skjules den mens navneseksjonens egne snarveier er synlige,
slik at pilene ikke overlapper. Lyttere ryddes ved navigasjon.

Kontrollert lokalt 2026-10-03: skjult/synlig tilstand, tastatur og retur til toppen
på Rosa ved mobilbredde, én knapp på artikkel ved desktop, ingen overlapp med
Om-sidens snarveier, og funksjon på designsidens selvstendige mal. Astro-sjekk:
0 feil, 0 advarsler, 3 eksisterende hints. Fysisk mobil, redusert bevegelse i
nettleseren og full produksjonsbuild er ikke testet. GitHub Pages-deploy er
ikke verifisert for dette tillegget.

## 7. Idéer og backlog — ikke en bestilling på implementering

I idédumpen 2026-09-26 sa brukeren uttrykkelig at ideene skulle samles, men at
arbeid ikke skulle utføres uten tydelig beskjed. Rekkefølgen nedenfor er ikke
en prioritert utviklingsplan. Fullføringsstatus er ikke kontrollert i repoet.

| Idé / behov | Rammer og uavklarte punkter |
| --- | --- |
| Porteføljeinspirasjon | Helena Zhang ble nevnt som referanse. Ingen presis referanselenke er lagret i dette dokumentet. |
| Animert illustrasjon | RedNote ble nevnt som inspirasjon; konkret eksempel må finnes igjen ved arbeid. |
| Hobbyprosjekter med webapper | Erling ble nevnt som inspirasjon; ikke en ferdig funksjonsbeskrivelse. |

3D-logoen, galleriutvidelsen, festet artikkel og mikroanimasjonen er beskrevet
separat ovenfor fordi det finnes mer konkrete samtaler om dem. Dette dokumentet
gir heller ikke en ny bestilling om å implementere disse nå.

## 8. Historiske fallgruver — ikke en liste over aktive feil

Tidligere prosjektkontekst beskriver problemer med Astro/MDX-avhengigheter og
versjonskonflikter, GitHub Pages-baneoppsett og deploy, installasjons-/rettighetsproblemer
i en Jottacloud-synkronisert kodemappe og en CI-feil rundt Sharp/pnpm.
En innholdsfeil i januar 2025 gjaldt manglende frontmatter-felt som `title`,
`description` og `publishDate` for `obsidian/workspace`.

Disse punktene er historikk fra 2024–2025. Ikke endre nåværende schema,
installasjonsregler, byggoppsett eller avhengigheter på dette grunnlaget alene.
Les gjeldende konfigurasjon og en aktuell feilmelding først. Gamle Astro-versjoner
og gamle prosjektstier skal ikke brukes som fasit for dagens repo.

## 9. Første kontroll ved neste tilgang til repoet

Prioriteten er å fylle kunnskapshull som er relevante for den konkrete oppgaven,
ikke å gjennomføre en uoppfordret full ombygging.

1. Kontroller riktig Git-rot, branch og arbeidsstatus. Les faktisk `AGENTS.md`
   og eventuell kontekstfil som allerede finnes; ikke overskriv nyere innhold.
2. Les `package.json`, lockfil, Astro-konfigurasjon og relevante workflows for
   å finne gjeldende versjoner, kommandoer og publiseringsoppsett.
3. Finn aktuelle sider, komponenter, innholdskilder og assets. Sammenlign med
   ønsket funksjon før du oppretter noe som kanskje allerede finnes.
4. Kontroller endringen med prosjektets egne tilgjengelige sjekker og korrekt
   preview. Oppgi hva som faktisk er kontrollert, og hva som fortsatt er utestet.
5. Oppdater dette dokumentet med presise filstier, implementasjonsstatus og
   testresultater for arbeidet som faktisk ble utført.

Et commitnummer, en bestått build eller en vellykket deploy må ikke fylles inn
uten at resultatet er observert. En løs prototype eller en opplastet ZIP er ikke
bevis på at nettstedets repo eller publiserte side er oppdatert.

## 10. Vedlikehold, kilder og dokumentstatus

Vurder dette dokumentet etter hver vesentlige oppgave. Endre bare det som faktisk
har endret seg eller er blitt verifisert. Eksempler er nye funksjoner, fastlagte
ruter, avklarte datakilder, designbeslutninger, løste feil og publiseringsflyt.
En liten tekstretting eller avstandsjustering trenger normalt ikke et eget punkt.

Oppdater datoen øverst ved reelle innholdsendringer. Merk status per område:
ønsket, planlagt, implementert, testet eller publisert. Ikke endre alle uavklarte
statuser fordi én del av repoet er kontrollert. Hold begrunnelser som forhindrer
at tidligere feil gjentas, men fjern detaljer som ikke lenger hjelper neste økt.

Repoets fil er hovedversjonen. Oppdater eventuelle opplastede prosjektkopier
separat når de skal brukes og ingen verifisert live-tilgang finnes. Ikke overskriv
nyere repoarbeid med en eldre nedlastet eller opplastet kontekstfil.

### Samtalegrunnlag

| Dato | Samtale / grunnlag | Bidrag |
| --- | --- | --- |
| 2024–2025 | Historikk bevart i tidligere prosjektkontekst | Teknisk bakgrunn og historiske fallgruver, ikke dagens status. |
| 2026-09-17 | Skrive artikler på mobil | Redigering først; publiseringsflyt kan komme senere. |
| 2026-09-18 | Astro bildegalleri forslag | Jottacloud-retning, bildekonsept og videoeksperiment. |
| 2026-09-18 | Utvidelse av Alt som gror | Faner, bildedato og Tintins alder. |
| 2026-09-18 | Utforsk mikroanimasjoner | Valgt test: rev + klikk + sommerfugl. |
| 2026-09-21 | Skriv fullskjermsbilde Astro | Om-siden, lenker, eksisterende layout og opprydding. |
| 2026-09-24 | Fest artikkel øverst | Velkomstartikkel på forsiden og Alt som gror. |
| 2026-09-25 | Forbedre portfoliotekst | Porteføljens budskap og visuelle innhold. |
| 2026-09-26 | Idé og bugdump | Idébank; ikke start implementasjon uten tydelig beskjed. |
| 2026-09-27 | Interaktiv 3D modell | Original-SVG, rev+DC, statisk bakgrunn og separat testside. |
| 2026-09-27 | Denne samtalen om kontekst og instruksjoner | Bekreftede filstier, globale/prosjektspesifikke regler og Git som hovedkilde. |

Historiske assistentsvar og tidligere dokumentversjoner er rapportert historikk,
ikke selvstendig bevis på endringer eller beståtte tester. Konkrete repoopplysninger
skal etter hvert erstattes eller suppleres med verifiserte filhenvisninger.

### Status for denne leveransen

2026-09-27: Andre dokumentversjon laget som del av en separat filpakke. Oppstart,
filnavn og vedlikehold er samordnet med nye globale og prosjektspesifikke regler.
Testalbumenes delingslenker er utelatt fra repo-dokumentasjonen. Innholdet om
nettstedet er bevart med tydelige forbehold om hva som ikke er verifisert.

Ved opprettelsen av den separate filpakken var installasjon ikke bekreftet.
Senere 2026-09-27 er alle tre originaldokumentene lest fra de angitte Mac-stiene.
3D-modellen er implementert på Om-siden og denne konteksten er oppdatert.
Se §6.5 for kontroller og publiseringsstatus. GitHub-/ChatGPT-innstillinger er ikke endret.
