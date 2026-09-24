---
title: "Ikke mist brukeren når skjemaet sendes inn"
description: "Å deaktivere send-knappen kan gi fokusproblemer. Håndter innsendingen og tilbakemeldingen som en helhet."
publishDate: 2025-03-31
tags:
  - Rauting
  - uu
  - ux
draft: false
---

Chris Ferdinandi tar for seg et vanlig mønster: Send-knappen deaktiveres mens skjemaet venter på svar. Et grep som virker ryddig visuelt, kan gjøre betjeningen vanskeligere.

<a class="raut-source-card" href="https://gomakethings.com/articles/dont-disable-buttons/" target="_blank" rel="noopener noreferrer">
  <span class="raut-source-card__meta">FAGLIG LESETIPS · gomakethings.com</span>
  <strong class="raut-source-card__title">Don’t disable buttons</strong>
  <span class="raut-source-card__description">Å deaktivere send-knappen kan gi fokusproblemer. Håndter innsendingen og tilbakemeldingen som en helhet.</span>
  <span class="raut-source-card__action">Les originalartikkelen <span aria-hidden="true">↗</span><span class="sr-only"> (åpnes i ny fane)</span></span>
</a>

## Key takeaways

- Et deaktivert element kan ikke få tastaturfokus. Dynamisk deaktivering kan derfor forstyrre orienteringen til den som nettopp brukte knappen.
- Håndter gjentatte innsendinger i logikken for skjemaet, fremfor å stole på knappens visuelle tilstand.
- Artikkelen viser en innsendingstilstand på selve skjemaet, som kontrolleres før en ny handling starter.
- Fortell at innsendingen pågår, og hva resultatet blir. Statusmeldinger må også være tilgjengelige for skjermlesere.

## Ding! 💡

Jeg vil se på ventetiden som en del av brukerreisen. Brukeren trenger svar på om handlingen ble registrert, om noe fortsatt skjer og hva neste steg er. En grå knapp sier lite om alt dette. I en gjennomgang av et skjema ville jeg derfor fulgt fokus og status fra før innsending til både vellykket svar og feil.

---

[Raut#139](https://raut.no/139), 31. mars 2025
