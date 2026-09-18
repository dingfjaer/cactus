# Fjærdinghage

Personlig digital hage på https://dingchen.no, basert på Astro Cactus.

## Kom i gang

Åpne denne mappa i VS Code. Node-versjonen ligger i `.nvmrc`; pnpm-versjonen er låst i `package.json`.

```sh
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

Åpne http://localhost:4321. Utviklingsvisningen inkluderer utkast. Søket fungerer etter `pnpm build` og `pnpm preview`.

## Skrive i Obsidian

Åpne `src/content/post` som hvelv. Opprett et nytt notat i hvelvets rot, gi filen et enkelt navn (for eksempel `en-ny-tanke.md`), og bruk **Templates: Insert template → Template** fra kommandopaletten. Malen fyller inn notatnavn og dagens dato.

- Tittel: maks 60 tegn. Beskrivelse: maks 160 tegn.
- `publishDate` er innleggets opprinnelige dato. Sjekk datoen når et eldre utkast publiseres.
- `updatedDate` er valgfri og brukes når du oppdaterer et publisert innlegg. Den påvirker sorteringen på siden.
- `draft: true` holder innlegget utenfor nettsiden. Sett til `false` når det er klart.
- Bilder legges i `images`. Vanlig Markdown: `![Beskrivelse av bildet](images/bilde.png)`.
- Bruk vanlige Markdown-lenker. Lenker til publiserte innlegg kan være `[Tittel](/posts/en-ny-tanke/)`. Obsidian-notatlenker til `.md` blir ikke automatisk oversatt til nettadresser.
- Wikilenker, `![[innbygginger]]` og Obsidian-callouts har ikke egen støtte på nettsiden. Astro-forhåndsvisningen er fasiten.
- `Templates` er eksplisitt utelatt fra nettstedet, også under utvikling.

Innstillingene for Markdown-lenker, bilder og synlige egenskaper er satt opp lokalt. Obsidian-innstillinger er fortsatt utelatt fra Git. På en ny maskin: slå av wikilenker, velg relative lenker og `images` som vedleggsmappe. Aktiver Templates og velg `Templates` som malmappe.

## Publisere

1. Forhåndsvis med `pnpm dev` (eller VS Code → Terminal → Run Task → Forhåndsvis hagen).
2. Sett `draft: false` på ferdige innlegg.
3. Kjør `pnpm build` (også tilgjengelig som VS Codes byggoppgave). Det sjekker innhold/kode, bygger siden og lager søkeindeksen.
4. Se gjennom endringene i VS Codes Source Control. Commit og push til `main`.
5. Kontroller at **Deploy to GitHub Pages** er grønn i GitHub Actions.

GitHub Actions bygger og publiserer automatisk til GitHub Pages. `public/CNAME` og Astro-konfigurasjonen peker på `dingchen.no`. Bare vellykkede bygg kan publiseres.

Utkast som committes til det offentlige GitHub-repoet er lesbare der selv om de ikke vises på nettsiden.

## Fotogalleriet

`/photos/` viser bildene fra det offentlige Jottacloud-albumet `k0qd6q3j37gn`. Siden har bare et responsivt bildegalleri og den vanlige lys-/mørkmodusbryteren. Den viser ingen bildetekster, nedlastingsknapper eller lenker til Jottacloud.

Legg til eller fjern bilder i albumet og kjør et nytt bygg/deploy for å oppdatere galleriet. Astro henter forhåndsvisningene og lager lokale WebP-bilder i flere størrelser. Den publiserte siden laster dermed bildene fra dingchen.no. Tomt album gir et tomt galleri; feil ved henting stopper bygget og erstatter ikke en fungerende publisering.

Under utprøvingen stopper albumhentingen ved 100 bilder for å unngå et ufullstendig galleri. Paginering må utvides før albumet når denne grensen. Integrasjonen bruker et internt Jottacloud-endepunkt som kan endres.

Etter at kodeendringen er publisert, kan **Deploy to GitHub Pages → Run workflow** hente nye albumendringer uten en ny kode-commit. Ingen tidsplan eller iOS-snarvei er satt opp ennå. Se `scripts/jottacloud-poc.md` for de opprinnelige API-testene.

## Prøv Front Matter i VS Code

Utvidelsen **Front Matter CMS** (`eliostruyf.vscode-front-matter`) bruker de samme Markdown-filene som Obsidian. Ingen konto, database eller flytting av innhold er nødvendig for denne lokale bruken.

1. Åpne hele `cactus`-mappa i VS Code og aktiver den anbefalte utvidelsen.
2. Åpne kommandopaletten (`Cmd+Shift+P`) og velg **Front Matter: Open dashboard**.
3. Se innleggene som kort eller liste, og filtrer på utkast eller emneknagger.
4. Åpne et innlegg. Sidepanelet gir felt for tittel, beskrivelse, datoer, emneknagger og utkast. Brødteksten redigeres fortsatt i Markdown.
5. Start `pnpm dev` for nettsideforhåndsvisning. Bruk innleggslisten på http://localhost:4321/posts/ som fasit, særlig for gamle filnavn med spesialtegn.

Dette er en valgfri redigeringsflate; Obsidian er fortsatt hovedverktøyet. Endringer i Front Matter lagres i samme filer og blir synlige i Obsidian. Å slå av utkast publiserer ikke alene: commit og push kreves fortsatt.

## Teknisk oppsett

Astro 7 med Content Layer, Markdown/MDX, Tailwind 3, RSS, sitemap, delingsbilder og Pagefind-søk. Remark/rehype brukes eksplisitt for å beholde eksisterende innholdsplugins. Gamle innleggsadresser beholdes. Nettapp-manifestet ligger i `public/manifest.webmanifest` og bruker eksisterende ikoner.

- `pnpm check`: innholds- og typekontroll.
- `pnpm build`: full publiseringskontroll med søkeindeks.
- `pnpm preview`: vis siste produksjonsbygg (uten utkast).
- `src/site.config.ts`: tittel, meny og nettstedinnstillinger.
- `src/content.config.ts`: innholdsfelter, innlasting og nettadresser.

Temaet bygger på [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus), MIT-lisens.
