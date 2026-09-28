# Gallerienes presentasjon

Brukerens valg: Gallerier og stor medievisning skal ikke ha «Åpne i Jottacloud»-lenker eller andre lenker til medieleverandøren. Dette gjelder også feiltilstander; tilby ny lasting på nettstedet.

Rosa, Tinsta, Vipa og Løva deler PhotoGallery med Alle/Bilder/Videoer-filter. Videoer bruker 16:9-kort uten bildetekster; avspilleren viser hele originalformatet. Tinstas dagsalder beregnes i Europe/Oslo fra 2025-04-08 og oppdateres i nettleseren. Laurel-maskene er eksportert fra SF Symbols laurel.leading og laurel.trailing.


## Fleksibel bildelayout (2026-09-28)

Rosa, Vipa og Løva bruker nå samme kolonneprinsipp som `photos.astro` i
Alle/Bilder-visningen: naturlig bildehøyde uten beskjæring, 16 px mellomrom og
opptil tre kolonner fra 1024 px, to fra 640 px og én på mobil. Antall kolonner
begrenses av antall synlige medier, også etter filtrering. Leserekkefølgen går
nedover hver kolonne, som i `photos.astro`. Sidens eksisterende bredde og navigasjon
beholdes. `src/utils/gallery-layout.ts` beregner responsive bildestørrelser for
kolonnene. Tinsta beholder sitt rutenett, bildedato, alder og kant-til-kant-visning
på mobil. Videoer-filteret beholder 16:9-kort på alle fire sider.

Kontrollert lokalt: Rosa ved 1280/800/390 px (3/2/1 kolonner, ingen overbredde),
Løva med 68 bilder i tre naturlige kolonner, Vipas bilde-/videofilter og Rosas
store bildevisning med Escape. Tinsta beholder tre gridkolonner på desktop og
390 px kant-til-kant-bilder med dato/alder på mobil. `pnpm check` bestod med
0 feil, 0 advarsler og 3 eksisterende hint. Ingen full produksjonsbuild eller
fysisk mobiltest i denne oppgaven.

Implementert lokalt, ikke committet eller publisert i denne oppgaven.


## Forrige/neste i fullskjerm (2026-09-28)

`MediaViewer.astro` viser Phosphor-chevroner med forrige/neste og posisjonstall.
Navigasjonen bruker bare synlige medier i det aktive filteret og følger galleriets
DOM-/leserekkefølge. Knappene deaktiveres ved første/siste element, uten rundgang.
Venstre/høyre piltast virker også; native videokontroller beholder sine egne
piltaster. Escape lukker og setter fokus tilbake på mediet som sist ble vist.
Bytte stopper gammel video, avbryter nettverksforespørsel og rydder HLS-spilleren;
forsinkede svar får ikke erstatte det nyvalgte mediet. Body-scroll forblir låst
mens dialogen er åpen. Gjelder også Tinsta og `photos.astro`.

Lokalt kontrollert i Vipa: første/siste bilde, filtrerte bilder, piltaster, Escape,
og video til bilde under lasting. To videoer ble klare for avspilling; bytte
mellom videoer og mobilkontroller ved 390 px er kontrollert. Lukking fjerner
videoelementet, gjenoppretter scrolling og fokuserer siste åpnete medieknapp.
Ingen publisering utført i denne oppgaven.
