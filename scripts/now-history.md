# Hva skjer nå: innhold og historikk

## Oppdatere innhold

Rediger `title` og eventuelt `detail` i `src/data/now.ts`. Behold `key`-verdiene.
Commit og publiser via `main` som vanlig. Bare temaer der innholdet faktisk er
endret får nye hendelser; en publisering av andre deler av nettstedet gjør ingenting
med historikken. Å endre tilbake til et tidligere innhold er en ny hendelse.

Widgetens «Historikk» åpner `/now/`. Fem temaer vises i kolonner på desktop og
som fem stablede rader med felles horisontal rulling på mobil. Nyeste hendelser
kommer først. Samme publisering er plassert på samme rad/kolonne på tvers av temaer;
tomme plasser betyr at temaet ikke ble endret da. Tintins alder er ikke historikkført.

Startoppføringen i `src/data/now-history-seed.json` er dagens fem temaer, med
brukerbestemt dato **27. september 2026 kl. 18:25 i Europe/Oslo** (16:25 UTC).
Dette er en manuelt datert startoppføring, ikke en verifisert Git-publisering;
derfor er `sourceCommit` null. Ikke oppdater denne filen når du endrer nå-innholdet.

## Automatisk publisering

`.github/workflows/deploy.yml` leser historikken fra Git-branchen `now-history`,
som bare inneholder `now-history.json`. Finnes branchen ikke ennå, brukes
startoppføringen. Før bygg lager `scripts/now-history.mjs prepare` en kandidat i
`.astro/now-history.json`. Nye endringer får tidspunktet dette publiseringsbygget
forberedes, samt kildecommit. Datoene vises alltid i norsk tid, inkludert sommertid.

Etter vellykket GitHub Pages-deploy lagrer `persist` kandidaten på historikkbranchen.
Feilet bygg/deploy lagrer ikke nye hendelser. Første vellykkede deploy lagrer også
startoppføringen når ingen temaer er endret. `main` og arbeidskopiens indeks endres
ikke, og ingen ekstra publisering trigges av historikkcommiten. Deploy-jobben trenger
`contents: write`; GitHub-regler må tillate boten å opprette/oppdatere `now-history`.

Behold historikkbranchen: den er den varige historikken. Ved lokal sikkerhetskopiering
må den også hentes. Ikke slett eller force-push den. Scriptet nekter å overskrive
ugyldige data eller en historikk som uventet endres under deploy.

Hvis lagring feiler **etter** Pages-deploy, kan nettstedet være publisert selv om
workflowen er rød. Kjør den feilede jobben på nytt før neste publisering. Gjentakelse
av samme lagring er trygg. Ved meldingen om samtidig endret historikk, undersøk
branchen før du starter en ny full workflow; ikke omgå kontrollen med force-push.

## Lokal forhåndsvisning og kontroll

- `pnpm now:sync` henter publisert historikk til den ignorerte `.astro`-mappen.
- Uten cache viser lokal preview den daterte startoppføringen. Lokale avvik fra
  sist hentet historikk vises som «Ikke publisert», uten oppdiktet tidspunkt.
- `pnpm build` alene publiserer eller arkiverer ingenting. I CI er forberedt cache
  påkrevd, slik at manglende historikk ikke går stille videre til produksjon.
- Node 24: `node --experimental-strip-types --test tests/now-history.test.ts tests/now-calendar.test.mjs`.
  Testene bruker en separat midlertidig lokal Git-remote, aldri prosjektets GitHub.

Implementert og testet lokalt 2026-11-01. GitHub Actions/deploy er ikke kjørt som
del av denne oppgaven; faktisk første lagring på GitHub gjenstår ved publisering.
