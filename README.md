# Lær C++

En lille læringsapp på dansk til grundlæggende C++. Den kører direkte i browseren som statiske filer – ingen server, ingen build-trin – og virker på både mobil og computer.

## Indhold

Seks korte lektioner: variabler, datatyper, if/else, løkker, funktioner og arrays. Hver lektion har:

- en kort forklaring
- et C++-eksempel vist med tydelig monospace-skrift
- 1-2 små opgaver (multiple choice eller et svarfelt), hvor appen straks viser, om svaret er rigtigt

Når alle opgaver i en lektion er løst, markeres den som gennemført (✓). Fremskridtet gemmes i browserens `localStorage`, og kan nulstilles med knappen nederst.

## Filer

- `index.html` – siden
- `style.css` – layout (responsivt til mobil)
- `lessons.js` – lektionsdata og logik (svartjek, fremskridt)
- `app.js` – visning og interaktion
- `lessons.test.js` – tests af logikken

## Kørsel

Åbn `index.html` i en browser, eller host mappen på GitHub Pages.

Tests: `node --test`
