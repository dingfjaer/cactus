# Infobokser i Markdown

Skriv tre kolon før og etter innholdet. Boksene viser et Phosphor-ikon og
innholdet ditt, uten automatisk tekst som «Tip», «Important» eller «Note».

| Tema | Anbefalt type | Eldre type (virker fortsatt) | Phosphor-ikon | Tailwind-farge |
| --- | --- | --- | --- | --- |
| Spira | `spira` | `tip` | `plant` | `emerald` |
| Rosa | `rosa` | `important` | `flower` | `pink` |
| Vipa | `vipa` | `note` | `bird` | `sky` |
| Løva | `lova` | `caution` | `leaf` | `amber` |
| Tinsta | `tinsta` | `warning` | `paw-print` | `orange` |

Ikon og kant bruker nyanse 600 i lys modus og 400 i mørk modus.
Bakgrunnen bruker nyanse 500 med omtrent 5 % dekkevne.
Skriv `lova` uten ø i selve direktivet.

```md
:::spira
**Spira:** Innlegg og tanker fra den digitale hagen.
:::

:::rosa
**Rosa:** Bilder jeg synes er fine og morsomme.
:::

:::vipa
**Vipa:** Designarbeid og visuelle prosjekter.
:::

:::lova
**Løva:** Illustrasjoner, tegninger og malerier.
:::

:::tinsta
**Tinsta:** Bilder og videoer av Tintin.
:::
```

En Løva-boks som tidligere brukte `:::tip`, må endres til `:::lova`.
`tip` er fortsatt knyttet til Spira. Tilsvarende gir `warning` nå Tinsta
med oransje pote, og `caution` gir Løva med ravgult løvblad.

## Valgfri egen tittel

Egne titler vises fortsatt når du oppgir dem uttrykkelig:

```md
:::spira[En liten tanke]
Innholdet i boksen.
:::
```

Uten egen tittel har boksen et tilgjengelig temanavn for skjermlesere,
mens den synlige tittellinjen bare inneholder ikonet.

## Vedlikehold

- Navn, ikonvalg, fargefamilier og kobling til eldre typer: `src/data/admonitions.ts`.
- Markdown og titler: `src/plugins/remark-admonitions.ts`.
- Utseende: admonition-delen i `tailwind.config.ts`.
- Lokale SVG-filer og MIT-lisens: `src/assets/admonitions/`.

Ikonene er fra [Phosphor Icons, regular](https://github.com/phosphor-icons/core/tree/main/assets/regular).
De pakkes inn i stilarket ved bygging, uten eksterne ikonkall i nettleseren.
