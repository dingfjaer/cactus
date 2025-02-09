---
title: Fargeblind og UX
description: Hva er fargeblind, og utfordringer med fargeblindhet i ux
publishDate: 2025-01-13
tags:
  - design
draft: false
---
https://www.whocanuse.com/?bg=076940&fg=ffffff&fs=16&fw=

https://chatgpt.com/share/67850bd9-29a0-8000-a66a-95ea3d96409c

**Fargeblindhet** er en tilstand som påvirker en persons evne til å se visse farger eller skille mellom farger. Dette kan skape utfordringer i hverdagen, spesielt når informasjon formidles kun gjennom fargekoding. Å forstå fargeblindhet og hvordan det kan påvirke design er avgjørende for å skape inkluderende og brukervennlige løsninger.

## **Typer av fargeblindhet**

1. **Rød-grønn fargeblindhet** (vanligst, ca. 8 % av menn og 0,5 % av kvinner):
    
    - **Protanopia**: Manglende evne til å se røde nyanser.
    - **Deuteranopia**: Manglende evne til å se grønne nyanser.
2. **Blå-gul fargeblindhet** (sjeldnere):
    
    - **Tritanopia**: Manglende evne til å se blå og gule nyanser.
3. **Fullstendig fargeblindhet** (ekstremt sjelden):
    
    - **Monokromasi**: Ser kun i nyanser av grått.

## **Utfordringer med fargeblindhet i UX/grafisk design**

Personer med fargeblindhet kan ha problemer med å:

- Skille mellom røde og grønne nyanser (f.eks. i diagrammer eller knapper).
- Oppfatte subtile fargeforskjeller, spesielt i pastelltoner.
- Lese tekst som har lav kontrast mot bakgrunnen.
- Forstå informasjon som utelukkende er formidlet gjennom farger

## **Beste praksis for fargeblind-vennlig design**

1. **Bruk flere visuelle indikatorer**
    
    - Ikke stol kun på farge for å formidle informasjon. Bruk tekst, ikoner, mønstre eller former som tillegg.
    - Eksempel: I en statusindikator, kombiner farge med tekst (f.eks. grønn med "OK", rød med "Feil").
2. **Sørg for høy kontrast**
    
    - Bruk tilstrekkelig kontrast mellom tekst og bakgrunn. Minimumskravene fra WCAG (Web Content Accessibility Guidelines) er:
        - 4.5:1 for vanlig tekst.
        - 3:1 for stor tekst (18 px og oppover).
    - Verktøy som kontrastsjekkere kan hjelpe med dette.
3. **Velg fargeblind-vennlige fargepaletter**
    
    - Unngå å bruke rødt og grønt ved siden av hverandre.
    - Bruk farger som er tydelige for alle, som blå, lilla, eller oransje.
    - Bruk verktøy som **Color Oracle** eller **Sim Daltonism** for å simulere hvordan farger ser ut for fargeblinde.
4. **Bruk teksturer eller mønstre**
    
    - I grafer eller diagrammer, bruk teksturer eller mønstre for å skille mellom seksjoner, i stedet for kun farge.
5. **Test designet**
    
    - Bruk fargeblindhetssimulatorer for å se hvordan designet ditt oppfattes.
    - Test designet på ekte brukere med fargeblindhet hvis mulig.
6. **Unngå dårlige fargekombinasjoner**
    
    - Rød/grønn.
    - Grønn/brun.
    - Blå/lilla.
    - Lysegrønn/lysgrå.
    - Grønn/gul.
7. **Gjør lenker og interaktive elementer tydelige**
    
    - Lenker bør være mer enn bare blå. Kombiner med understrekning eller en annen indikator.
    - Interaktive elementer bør ha klare og tydelige tilstander (hover, aktiv osv.).
8. **Kommuniser viktig informasjon med mer enn farge**
    
    - Hvis noe er "grønt for godkjent" eller "rødt for feil", legg til tekst eller ikoner som støtter denne informasjonen.

## **Verktøy og ressurser**

- **Fargeblindhetssimulatorer:**
    
    - Color Oracle: Simulerer fargeblindhet i sanntid.
    - Sim Daltonism: For macOS.
- **Kontrastsjekkere:**
    
    - Contrast Checker (WebAIM): Sjekk kontrast mellom tekst og bakgrunn.
    - Accessible Colors: Gir fargeanbefalinger.
- **Designverktøy:**
    
    - Figma og Adobe XD har innebygde verktøy for fargeblindhetssimulering.
    - Plugins som **Stark** kan hjelpe med tilgjengelighet.


## Trafikklysene
Trafikklysene er generelt designet med fargeblindhet i tankene, men hvordan de oppfattes avhenger av typen fargeblindhet. Her er en oversikt over hvordan personer med forskjellige typer fargeblindhet kan oppleve trafikklysene:

## **Rød-grønn fargeblindhet (Protanopia og Deuteranopia)**

- **Utfordring**: Det kan være vanskelig å skille rødt fra grønt, siden disse nyansene ser mer like ut.
- **Hva hjelper**:
    - **Posisjonen** på lysene: Trafikklys har en standardisert plassering av fargene, med rødt øverst, gult i midten og grønt nederst (vertikalt) eller rødt til venstre og grønt til høyre (horisontalt). Dette hjelper fargeblinde med å bruke plasseringen som referanse.
    - Lysstyrke og kontrast: Rødt lys er ofte mørkere, mens grønt lys er lysere, noe som gir visuell kontrast selv for fargeblinde.

---

## **Blå-gul fargeblindhet (Tritanopia)**

- **Utfordring**: Blått og gult kan være vanskelig å skille, men dette påvirker vanligvis ikke rød og grønn oppfattelse.
- **Effekt**: Denne typen fargeblindhet har liten til ingen innvirkning på oppfattelsen av trafikklys, fordi de primære fargene (rød, gul og grønn) ikke forveksles med hverandre.

---

## **Fullstendig fargeblindhet (Monokromasi)**

- **Utfordring**: Personer med monokromasi ser verden i gråtoner og må kun stole på lysstyrken eller posisjonen for å tolke trafikklysene.
- **Hva hjelper**:
    - Igjen, plassering og lysstyrke er avgjørende for å forstå trafikklysene.

---

## **Hvordan trafikklys er tilpasset fargeblindhet**

1. **Standardisert plassering**:
    
    - Rødt (stopp) er alltid øverst eller til venstre.
    - Grønt (kjør) er alltid nederst eller til høyre.
2. **Kontrast og lysstyrke**:
    
    - Selv om personer ikke kan se fargene, kan forskjellen i lysstyrke hjelpe.
3. **Former og ikoner** (i enkelte land):
    
    - Noen trafikklys har tilleggssymboler som piler eller figurer for å indikere handling (gå, stopp, sving osv.).

---

## **Utfordringer i praksis**

- I svakt lys eller dårlige værforhold kan lysstyrken bli mindre tydelig.
- Det kan fortsatt være vanskelig for personer med rød-grønn fargeblindhet å tolke signaler hvis de ikke er kjent med plasseringen eller om systemet ikke er standardisert.

---

## **Hvordan forbedre trafikklys ytterligere for fargeblinde**

1. **Legge til former eller tekst**: F.eks. bruke X eller ✔ i stedet for kun farge.
2. **Bruk av LED-teknologi**: Gjør lyset sterkere og enklere å skille.
3. **Utvidet signalering**: Bruke lyd eller vibrasjoner (allerede vanlig i kryss for fotgjengere).

---

Trafikklysene fungerer for de fleste fargeblinde fordi de er designet for å kombinere farge, plassering og lysstyrke. Likevel kan utfordringer oppstå for de med mer alvorlige former for fargeblindhet eller under spesielle forhold.

Test deploy+1