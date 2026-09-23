# Raut-innlegg til Fjærdinghage

28 selvstendige notater, skrevet på norsk og kontrollert 23. september 2026. Utvalget er gjort etter gjennomgang av arkivet og 28 utgaver, med vekt på UX, universell utforming, innholdsdesign, frontend, samarbeid og produktutvikling.

## Publisering

Alle innlegg ligger direkte i `src/content/post/` med prefikset `raut-`, og alle har `draft: false`. De bruker hagens eksisterende felter: `title`, `description`, `publishDate`, `tags` og `draft`. Titlene er under 61 tegn og beskrivelsene under 161 tegn.

Hvert innlegg har `Rauting` og to emnetagger. Universell utforming er tagget `uu`. Den eksisterende Astro-konfigurasjonen normaliserer alle tagger til små bokstaver, så samlesiden blir `/tags/rauting/`.

Datoene er hentet fra den enkelte raden i [Raut-arkivet](https://raut.no/utgaver), ikke fra originalartiklenes publiseringsdatoer. Ingen `updatedDate` er satt, slik at opprinnelig sortering beholdes.

Kortene er vanlig HTML i Markdown og bruker `.raut-source-card`-stilene som er lagt til i `src/styles/global.css`. Ta med disse stilene dersom innleggene flyttes til en annen kopi av nettstedet. Kortene støtter lyst og mørkt tema, tydelig tastaturfokus og varsling om at kilden åpnes i ny fane. Det brukes ingen eksterne bilder eller nye avhengigheter.

## Redaksjonelt

Hovedpoengene er selvstendige, korte parafraser av de lenkede originalartiklene. «Hva Chatty tenker at Ding tenker» er KI-formulerte refleksjoner på oppdrag fra Ding, skrevet i jeg-form med utgangspunkt i hagens eksisterende interesser. De inneholder ikke påstander om oppdiktede prosjekter, tester eller arbeidserfaringer. Refleksjonene er skilt fra kildesammendraget.

Artikkelkortet lenker til kilden, mens fotnoten peker til Raut-utgaven som tipset om den. Sporingsparametere er fjernet fra artikkelkortene. `manifest.json` inneholder opprinnelig Raut-lenke, verifisert måladresse, utgave, dato, fil og kontrollgrunnlag.

Designsystemets V1-artikkel har flyttet fra `/bloggen/2025/V1` til `/no/blog/V1`; kortet bruker den fungerende adressen. Cloud Four og PACT-artikkelen ble lest via nettsøk fordi direkte henting ble blokkert. Artiklene om NRKs overganger og indeksen for digital inkludering ble utelatt fordi originalinnholdet ikke kunne kontrolleres tilstrekkelig.

## Innlegg

| Dato fra Raut | Innlegg | Utgave |
| --- | --- | --- |
| 2025-01-13 | [Tilgjengelighet er en praksis, ikke en sluttkontroll](../../src/content/post/raut-tilgjengelighet-er-en-praksis.md) | [Raut #128](https://raut.no/128) |
| 2025-02-03 | [Tilgjengelig frontend starter med riktige byggesteiner](../../src/content/post/raut-tilgjengelig-frontend.md) | [Raut #131](https://raut.no/131) |
| 2025-02-17 | [Når KI tar feil, har grensesnittet også et ansvar](../../src/content/post/raut-design-for-usikre-ki-svar.md) | [Raut #133](https://raut.no/133) |
| 2025-02-17 | [Flytende typografi på brukerens premisser](../../src/content/post/raut-typografi-paa-brukerens-premisser.md) | [Raut #133](https://raut.no/133) |
| 2025-03-10 | [Designsystemet som felles grunn å bygge på](../../src/content/post/raut-designsystemet-som-fellesgrunn.md) | [Raut #136](https://raut.no/136) |
| 2025-03-10 | [Nettleseren som designverktøy](../../src/content/post/raut-design-i-nettleseren.md) | [Raut #136](https://raut.no/136) |
| 2025-03-31 | [PACT: fire spørsmål før du begynner å tegne](../../src/content/post/raut-pact-foer-du-tegner.md) | [Raut #139](https://raut.no/139) |
| 2025-03-31 | [Ikke mist brukeren når skjemaet sendes inn](../../src/content/post/raut-ikke-mist-fokus-ved-innsending.md) | [Raut #139](https://raut.no/139) |
| 2025-04-07 | [Når chat gjør en enkel handling mer tungvint](../../src/content/post/raut-chat-er-ikke-alltid-riktig.md) | [Raut #140](https://raut.no/140) |
| 2025-04-07 | [Navigasjon som fungerer med tastatur](../../src/content/post/raut-navigasjon-med-tastatur.md) | [Raut #140](https://raut.no/140) |
| 2025-05-05 | [Begrensninger som setter kreativiteten i gang](../../src/content/post/raut-kreative-begrensninger.md) | [Raut #143](https://raut.no/143) |
| 2025-05-05 | [Et eget sted på nettet er verdt å ta vare på](../../src/content/post/raut-et-eget-sted-paa-nettet.md) | [Raut #143](https://raut.no/143) |
| 2025-05-26 | [Lyd er også interaksjonsdesign](../../src/content/post/raut-lyd-som-interaksjonsdesign.md) | [Raut #146](https://raut.no/146) |
| 2025-08-25 | [Fra prosjekt til produkt krever en annen styring](../../src/content/post/raut-fra-prosjekt-til-produkt.md) | [Raut #154](https://raut.no/154) |
| 2025-09-01 | [Er vi enige, eller har vi bare sluttet å spørre?](../../src/content/post/raut-enighet-eller-stillhet.md) | [Raut #155](https://raut.no/155) |
| 2025-09-22 | [Din konto, min konto – eller bare konto?](../../src/content/post/raut-din-eller-min-konto.md) | [Raut #158](https://raut.no/158) |
| 2025-09-22 | [Hva ligger bak motstanden mot brukerinnsikt?](../../src/content/post/raut-hvorfor-dropper-vi-brukerinnsikt.md) | [Raut #158](https://raut.no/158) |
| 2025-10-06 | [Brukerens innsats er en kostnad](../../src/content/post/raut-brukerens-innsats-er-en-kostnad.md) | [Raut #160](https://raut.no/160) |
| 2025-10-13 | [Lettere nettsider begynner med brukerreisen](../../src/content/post/raut-lettere-nettsider.md) | [Raut #161](https://raut.no/161) |
| 2025-10-13 | [Tilgjengelige farger trenger ikke være kjedelige](../../src/content/post/raut-farger-og-tilgjengelighet.md) | [Raut #161](https://raut.no/161) |
| 2026-01-12 | [Når tilgjengelighet gjør hverdagen bedre for flere](../../src/content/post/raut-naar-tilgjengelighet-hjelper-flere.md) | [Raut #172](https://raut.no/172) |
| 2026-01-19 | [Klikkbare kort uten knapper inni lenker](../../src/content/post/raut-kort-uten-nestede-klikk.md) | [Raut #173](https://raut.no/173) |
| 2026-03-24 | [Designprosessen kan bli kortere uten å forsvinne](../../src/content/post/raut-designprosessen-kan-komprimeres.md) | [Raut #182](https://raut.no/182) |
| 2026-04-28 | [Et ferdig grensesnitt er ikke et ferdig løst problem](../../src/content/post/raut-mer-enn-produksjon.md) | [Raut #187](https://raut.no/187) |
| 2026-08-18 | [Gjør arbeidet bak skjermbildene synlig](../../src/content/post/raut-synliggjoer-designarbeidet.md) | [Raut #193](https://raut.no/193) |
| 2026-08-25 | [HTML kan mer enn vi ofte gir det ansvar for](../../src/content/post/raut-html-kan-mer.md) | [Raut #194](https://raut.no/194) |
| 2026-09-08 | [Trenger alle nettsider en synlig temabryter?](../../src/content/post/raut-trenger-vi-temabryteren.md) | [Raut #195](https://raut.no/195) |
| 2026-09-22 | [Færre detaljer gir mer rom for omtanke](../../src/content/post/raut-faerre-detaljer-mer-omtanke.md) | [Raut #196](https://raut.no/196) |


## Flytting og justeringer

Innleggene er flyttet fra den lokale prosjektkopien til `/Users/ding/Github/cactus/src/content/post/`. Kortstilene er lagt til i dette prosjektets `src/styles/global.css`.

Alle 28 bruker overskriftene «Key takeaways» og «Hva Chatty tenker at Ding tenker». Kildelinjen har formatet `[Raut#182](https://raut.no/182), 24. mars 2026`.
