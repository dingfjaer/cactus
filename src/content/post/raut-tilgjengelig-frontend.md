---
title: "Tilgjengelig frontend starter med riktige byggesteiner"
description: "HTML, skjemafelt, fokus og bevegelse: små grunnvalg med stor betydning for brukeropplevelsen."
publishDate: 2025-02-03
tags:
  - Rauting
  - uu
  - frontend
draft: false
---

Martijn Hols går gjennom tilgjengelighetsgrep som bør være en vanlig del av frontendarbeidet. Mange av dem handler om å bruke funksjonalitet nettleseren allerede har.

<a class="raut-source-card" href="https://martijnhols.nl/blog/accessibility-essentials-every-front-end-developer-should-know" target="_blank" rel="noopener noreferrer">
  <span class="raut-source-card__meta">FAGLIG LESETIPS · martijnhols.nl</span>
  <strong class="raut-source-card__title">Accessibility essentials every front-end developer should know</strong>
  <span class="raut-source-card__description">HTML, skjemafelt, fokus og bevegelse: små grunnvalg med stor betydning for brukeropplevelsen.</span>
  <span class="raut-source-card__action">Les originalartikkelen <span aria-hidden="true">↗</span><span class="sr-only"> (åpnes i ny fane)</span></span>
</a>

## Key takeaways

- Bruk lenker til navigasjon og knapper til handlinger. Et klikkbart div-element får ikke den samme betjeningen automatisk.
- Skjemafelt trenger tydelige, tilknyttede etiketter. Plassholdertekst forsvinner når brukeren skriver og kan ikke erstatte dem.
- Synlig tastaturfokus, støtte for større tekst og respekt for redusert bevegelse må følge med det visuelle designet.
- Semantisk HTML er et godt utgangspunkt. ARIA må brukes målrettet, og løsningen trenger fortsatt manuell testing.

## Ding! 💡

For meg er dette et godt argument for å diskutere oppførsel samtidig som utseende. En knapp er ikke ferdig beskrevet når farge og radius er bestemt. Jeg vil også vite hvordan den får fokus, hva den heter for hjelpemidler og hva som skjer etter aktivering. Det gjør samtalen mellom design og utvikling langt mer konkret.

---

[Raut#131](https://raut.no/131), 3. februar 2025
