---
title: "Navigasjon som fungerer med tastatur"
description: "Forutsigbare lenker, knapper og fokus gjør det enklere å finne veien uten mus."
publishDate: 2025-04-07
tags:
  - Rauting
  - uu
  - frontend
draft: false
---

Tempertemper viser at vanlig nettstedsnavigasjon kan ha ganske enkel tastaturbetjening. Problemene kommer fort når vi legger til spesialoppførsel som brukeren ikke forventer.

<a class="raut-source-card" href="https://www.tempertemper.net/blog/how-navigation-should-work-for-keyboard-users" target="_blank" rel="noopener noreferrer">
  <span class="raut-source-card__meta">FAGLIG LESETIPS · tempertemper.net</span>
  <strong class="raut-source-card__title">How navigation should work for keyboard users</strong>
  <span class="raut-source-card__description">Forutsigbare lenker, knapper og fokus gjør det enklere å finne veien uten mus.</span>
  <span class="raut-source-card__action">Les originalartikkelen <span aria-hidden="true">↗</span><span class="sr-only"> (åpnes i ny fane)</span></span>
</a>

## Key takeaways

- Vanlige navigasjonslenker skal kunne nås med Tab og Shift+Tab og åpnes med Enter.
- Bruk lenker for å gå til sider og knapper for å åpne undermenyer. En knapp kan formidle åpen eller lukket tilstand med aria-expanded.
- Når en undermeny åpnes, kan fokus bli på knappen. Brukeren går videre inn i menyen med Tab og kan lukke med Escape.
- En hopp-til-innhold-lenke lar brukeren slippe å gå gjennom navigasjonen på hver side.

## Ding! 💡

Jeg synes dette er en nyttig påminnelse om at en meny ikke trenger å føles avansert for å være gjennomarbeidet. Forutsigbarheten er en kvalitet i seg selv. En konkret kontroll jeg vil ta med meg, er å legge bort musa og følge hele veien fra toppen av siden til innholdet. Da merker jeg fort om designet skaper unødvendige stopp.

---

[Raut#140](https://raut.no/140), 7. april 2025
