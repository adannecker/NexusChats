# Architecture

NexusChats ist als Manifest-V3-Erweiterung mit einem Vite-gebauten Content Script aufgebaut.

## Build

- `public/manifest.json` wird unveraendert nach `dist/manifest.json` kopiert.
- `src/content/index.ts` wird zu `dist/assets/content.js` gebaut.
- `src/styles/content.css` wird zu `dist/assets/content.css` extrahiert.
- Chrome laedt die gebauten Assets ueber das Manifest.

## Laufzeitmodule

`src/content/NexusChatsContentApp.ts`

Der Orchestrator startet die Erweiterung, prueft den Host, verbindet Services und Features, startet den DOMObserver und stoesst Render-Durchlaeufe an.

`src/features/sidebar/SidebarService.ts`

Der Service erkennt die ChatGPT-Sidebar ueber semantische Container, sichtbare Chat-Links und Layout-Heuristiken. Er bestimmt ausserdem die Mount-Position oberhalb der Chatliste.

`src/features/selection/ChatDetector.ts`

Der Detector findet sichtbare Konversationslinks innerhalb der Sidebar und extrahiert nur die Chat-ID. Chat-Titel, Chat-Texte und URLs werden nicht gespeichert.

`src/features/selection/SelectionManager.ts`

Der Manager verwaltet Auswahlmodus, Mehrfachauswahl, `Alle auswaehlen`, `Auswahl aufheben` und Change-Events. Er kennt keine DOM-Struktur und keine UI-Details.

`src/content/UIRenderer.ts`

Der Renderer erzeugt das `NexusChats`-Panel, rendert Checkboxen neben Chat-Eintraegen, hebt ausgewaehlte Chats hervor und aktualisiert den Zaehler. DOM-Updates sind idempotent, damit keine doppelten Elemente entstehen.

`src/content/DOMObserver.ts`

Der Observer kapselt `MutationObserver`, ignoriert NexusChats-eigene DOM-Aenderungen und buendelt Host-Page-Aenderungen per `requestAnimationFrame`.

`src/storage/StorageService.ts`

Der Storage-Service kapselt `chrome.storage.local`. Gespeichert werden nur lokale UI-Zustaende: Auswahlmodus aktiv ja/nein und ausgewaehlte Chat-IDs.

`src/utils/`

Utilities enthalten kleine, wiederverwendbare Funktionen fuer DOM-Zugriff, Scheduling und URL-Grenzen.

## DOM-Strategie

ChatGPT verwendet eine dynamische Oberflaeche. NexusChats behandelt die Host-Seite deshalb als veraenderlich:

- DOM-Mounting ist idempotent.
- Ein `MutationObserver` stoesst nur geplante Render-Durchlaeufe an.
- NexusChats-eigene DOM-Mutationen werden vom Observer ignoriert.
- Checkboxen werden pro Chat-Link nur einmal erzeugt.
- Stale Checkboxen und Hervorhebungen werden entfernt, wenn Chats verschwinden oder der Auswahlmodus deaktiviert wird.
- Es werden keine zufaelligen ChatGPT-CSS-Klassen als Integrationspunkte verwendet.

## Datenschutzgrenze

Der Auswahlmodus speichert keine Chat-Inhalte. Lokal gespeichert werden nur:

- `selectionModeEnabled`
- `selectedChatIds`

Die IDs werden fuer lokale UI-Auswahl benoetigt. Titel, Nachrichten, Prompts, Antworten und URLs bleiben ungespeichert.

## Erweiterbarkeit

Neue Features sollen jeweils ein eigenes Modul unter `src/features/` erhalten. UI, Storage und Fachlogik bleiben getrennt, damit spaetere Beitraege leichter geprueft und getestet werden koennen.
