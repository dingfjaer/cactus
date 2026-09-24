---
title: "HTML kan mer enn vi ofte gir det ansvar for"
description: "Innebygde nettleserfunksjoner kan erstatte egen kode, men må fortsatt vurderes og testes."
publishDate: 2026-08-25
tags:
  - Rauting
  - frontend
  - uu
draft: false
---

Chris Burnell samler interaktive eksempler på hva HTML kan gjøre. Oversikten er også tydelig på at innebygde funksjoner kan ha mangler i nettleserstøtte og tilgjengelighet.

<a class="raut-source-card" href="https://chrisburnell.com/html-can-do-that/" target="_blank" rel="noopener noreferrer">
  <span class="raut-source-card__meta">FAGLIG LESETIPS · chrisburnell.com</span>
  <strong class="raut-source-card__title">HTML Can Do That</strong>
  <span class="raut-source-card__description">Innebygde nettleserfunksjoner kan erstatte egen kode, men må fortsatt vurderes og testes.</span>
  <span class="raut-source-card__action">Les originalartikkelen <span aria-hidden="true">↗</span><span class="sr-only"> (åpnes i ny fane)</span></span>
</a>

## Key takeaways

- Popover, details og flere skjemakontroller gir nyttig oppførsel uten at alt må programmeres fra grunnen av.
- Flere details-elementer kan dele et name-attributt slik at bare ett av dem er åpent om gangen.
- loading="lazy" kan utsette lasting av bilder som ikke trengs med en gang. Det må brukes der det passer innholdets rolle.
- Innebygd betyr ikke automatisk problemfritt. Artikkelen påpeker blant annet svakheter ved datalist og enkelte kontroller, og oppfordrer til testing.

## Ding! 💡

Jeg vil bruke oversikten som en vane før jeg legger til et nytt bibliotek i hagen: Finnes en god byggestein allerede? Det kan gi mindre kode å passe på og en mer gjenkjennelig oppførsel. Samtidig vil jeg prøve den konkrete løsningen med tastatur, ulike nettlesere og relevante hjelpemidler. At funksjonen finnes, er starten på vurderingen.

---

[Raut#194](https://raut.no/194), 25. august 2026
