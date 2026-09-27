# Prosjektkontekst: Fjærdinghage / Digital hage med Astro / Cactus

Sist endret i dokumentet: 2026-09-27  
Dokumentversjon: 2 — samordnet med instruksjonspakken  
Eier: Ding Chen / Ding Chen Fjær  
Nettsted: `dingchen.no`  
Autoritativ prosjektmappe: `/Users/ding/Github/cactus`  
Plassering: `/Users/ding/Github/cactus/PROJECT_CONTEXT.md`  
Kodebasen verifisert ved denne dokumentoppdateringen: Delvis – 3D-modellen og Om-siden, se §6.2 og §6.5

> Dokumentets bakgrunn bygger på samtaler og tidligere prosjektkontekst, ikke en
> full teknisk revisjon. Historiske ønsker og rapporterte leveranser er ikke bevis
> på implementasjon. Originalrepoet og instruksjonsfilene er nå lest lokalt;
> verifisert implementasjon og kontroll av 3D-modellen på Om-siden er beskrevet i §6.5.
> Øvrige funksjonsstatuser er ikke revidert. Publiseringsstatus står i §6.5.

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

### 6.2 Om-siden, CV og portefølje

Verifisert 2026-09-27: `src/pages/about.astro` viser nå den interaktive
3D-logoen øverst i innholdet, i full nettleserbredde uten ramme eller avrundede
hjørner. Eksisterende header/navigasjon, `/images/about.png` og lenkene til
CV og portefølje er bevart. Bildet står under modellen og skal bearbeides senere.

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

## 7. Idéer og backlog — ikke en bestilling på implementering

I idédumpen 2026-09-26 sa brukeren uttrykkelig at ideene skulle samles, men at
arbeid ikke skulle utføres uten tydelig beskjed. Rekkefølgen nedenfor er ikke
en prioritert utviklingsplan. Fullføringsstatus er ikke kontrollert i repoet.

| Idé / behov | Rammer og uavklarte punkter |
| --- | --- |
| Forrige/neste i hvert innlegg | Håndter første og siste innlegg og ta hensyn til festede artikler. Om rekkefølgen skal følge dato eller den visuelt sorterte listen, er ikke avklart. |
| Forrige/neste i fullskjerm for bilder og video | Kun ikoner er ønsket. Brukeren skrev «Accordions-ikon»; konkret ikonvalg må bekreftes i design/kode. |
| «Hva skjer nå»-seksjon | Kan ligge på forsiden eller Om-siden. Kan vise bok, artist, serie eller det Ding holder på med. Plassering og oppdateringsmåte er ikke bestemt. |
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
