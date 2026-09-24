> Historisk dokumentasjon av bildeprøven. Fra 24. september 2026 brukes ingen bilder i Medium-innleggene.

# Medium → lesetips i hagen

Prøve: Helena Zhang, «Icon Grids & Keylines Demystified», 16. mars 2020.

## Resultat og begrensning

Notatet ligger i `src/content/post/medium-ikonrutenett.md`, med `draft: false`, originalens dato, kildekort, takeaways og tydelig merket KI-refleksjon. Det er et kort norsk lesetips, ikke en kopi av artikkelen.

Originalteksten kunne leses via nettsøk. Direkte HTML-henting fikk HTTP 403 fra Medium, og nettleserverktøyet ble blokkert av en utilgjengelig administrativ tilgangssjekk. Originalbildene er derfor **ikke hentet**. Den publiserte prinsippskissen er laget spesielt for hagen og merket som egen illustrasjon. Den må ikke omtales som Helena Zhangs bilde.

## Praktisk arbeidsflyt for neste artikkel

1. Velg et lite antall illustrasjoner som forklarer hovedpoengene. Ta med kilde og fotograf/illustratør. Avklar brukstillatelse ved gjenpublisering; kreditering er ikke en lisens.
2. Bruk bildets direkte adresse fra Medium (`miro.medium.com`), eller lagre bildet fra nettleseren hvis automatisk henting er blokkert. Scriptet prøver ikke å omgå innlogging eller tilgangskontroller.
3. Importer bildet med kommandoen under og lim den ferdige Markdown-blokken inn i notatet. Skriv en konkret norsk alt-tekst og en kort bildetekst som knytter bildet til hovedpoenget.

Fra prosjektmappen, med Node 24:

```sh
node scripts/medium/import-image.mjs \
  --file /full/sti/til/lagret-bilde.png \
  --slug artikkelnavn \
  --name beskrivende-bildenavn \
  --alt 'Hva bildet viser, forklart kort på norsk.' \
  --credit 'Illustrasjon: navn på opphavsperson' \
  --source 'https://forfatter.medium.com/artikkel'
```

For direkte nedlasting: bytt ut `--file ...` med `--url 'https://miro.medium.com/den-faktiske-bildeadressen'`. Bruk nøyaktig adressen fra det valgte bildet; ikke artikkeladressen eller et skjermbilde av hele nettsiden.

## Lagring

- Bilder lagres under `src/content/post/images/medium/<slug>/`. Markdown bruker relative lenker, slik at fil og bilder kan flyttes sammen og Astro kan behandle dem som lokale ressurser.
- Statiske bilder blir tapsfri WebP, maksimalt 1600 piksler brede. Dette passer godt til diagrammer med tekst og tynne streker. Størrelsen er et kompromiss; behold en større original separat ved behov for detaljstudier.
- Animerte bilder beholdes byte for byte i originalformatet. Dermed blir ikke en demonstrasjon redusert til første bilde.
- Filnavnet inkluderer et innholdsfingeravtrykk. Gjentatt import av samme resultat lager ikke ekstra kopier. Et endret bilde får ny fil; eksisterende lenker overskrives ikke.
- Kildeadresse, bildeadresse, kreditering, alt-tekst, byteantall og fingeravtrykk lagres i `scripts/medium/records/`.
- Importen avviser feilsider, ukjente bildeformater, bilder over 20 MB og omdirigeringer. Den krever ingen nye pakker; Sharp finnes allerede i prosjektet.

Denne første prøven bekrefter lokal bildebehandling og Markdown-lagring. Automatisk nedlasting av **denne artikkelens originalbilder** gjenstår når en tilgjengelig bildeadresse eller bildefil foreligger.
