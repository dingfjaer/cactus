---
title: "Klikkbare kort uten knapper inni lenker"
description: "CSS subgrid kan bevare et samlet kortdesign samtidig som handlingene får ryddig HTML-struktur."
publishDate: 2026-01-19
tags:
  - Rauting
  - frontend
  - uu
draft: false
---

Noah Liebman viser hvordan subgrid kan løse et vanlig kortproblem: Hele raden skal være en lenke, men den har også en egen handlingsknapp.

<a class="raut-source-card" href="https://noahliebman.net/2025/08/using-subgrid-to-avoid-nested-interactive-elements/" target="_blank" rel="noopener noreferrer">
  <span class="raut-source-card__meta">FAGLIG LESETIPS · noahliebman.net</span>
  <strong class="raut-source-card__title">Using subgrid to avoid nested interactive elements</strong>
  <span class="raut-source-card__description">CSS subgrid kan bevare et samlet kortdesign samtidig som handlingene får ryddig HTML-struktur.</span>
  <span class="raut-source-card__action">Les originalartikkelen <span aria-hidden="true">↗</span><span class="sr-only"> (åpnes i ny fane)</span></span>
</a>

## Key takeaways

- En knapp inni en lenke kan gi ugyldig struktur og problemer med fokus og hjelpemidler.
- La lenken og knappen være søsken i HTML. Da får hver handling sitt eget tydelige element.
- Grid og subgrid kan plassere elementene slik at de fortsatt oppleves som del av samme kort, uten at tekst og knapp overlapper.
- Start med meningsfull struktur og legg på visuell plassering etterpå. Utseendet trenger ikke diktere en problematisk elementstruktur.

## Ding! 💡

Dette er relevant når jeg samler artikler i hagen. Et kort med én oppgave kan være én lenke. Hvis jeg senere legger til lagring eller deling, må de få egne handlinger som er lette å nå og forstå. Jeg liker at eksemplet viser en vei til å beholde uttrykket uten å legge usynlig kompleksitet på tastaturbrukeren.

---

[Raut#173](https://raut.no/173), 19. januar 2026
