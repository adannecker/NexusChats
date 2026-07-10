# Architecture

NexusChats ist als Manifest-V3-Erweiterung mit einem Vite-gebauten Content Script aufgebaut.

## Build

- `public/manifest.json` wird unverändert nach `dist/manifest.json` kopiert.
- `src/content/index.ts` wird zu `dist/assets/content.js` gebaut.
- `src/styles/content.css` wird zu `dist/assets/content.css` extrahiert.
- Chrome lädt die gebauten Assets über das Manifest.

## Laufzeitmodule

`src/content/NexusChatsContentApp.ts`

Der Orchestrator startet die Erweiterung, prüft den Host, verbindet Services und Features, startet den DOMObserver und stößt Render-Durchläufe an.

`src/features/sidebar/SidebarService.ts`

Der Service erkennt die ChatGPT-Sidebar über semantische Container, sichtbare Chat-Links und Layout-Heuristiken. Er bestimmt außerdem die Mount-Position oberhalb der Chatliste.

`src/features/selection/ChatDetector.ts`

Der Detector findet sichtbare Konversationslinks innerhalb der Sidebar und in geöffneten Projektlisten. Er extrahiert nur die Chat-ID. Chat-Titel, Chat-Texte und URLs werden nicht gespeichert.

`src/features/projects/ProjectActionsService.ts`

Der Service erkennt den Projektbereich über den sichtbaren `Quellen`-/`Sources`-Control und liefert den Mount-Punkt für den horizontalen Projekt-Aktionsbereich sowie den Projekt-Root für die Chat-Erkennung.

`src/features/selection/SelectionManager.ts`

Der Manager verwaltet getrennte Auswahl-Scopes für Sidebar und Projektliste, Mehrfachauswahl, `Alle auswählen`, `Auswahl aufheben` und Change-Events. Er kennt keine DOM-Struktur und keine UI-Details.

`src/content/UIRenderer.ts`

Der Renderer erzeugt das `NexusChats`-Panel und den horizontalen Projekt-Aktionsbereich, rendert Checkboxen neben Chat-Einträgen, hebt ausgewählte Chats hervor und aktualisiert die jeweiligen Zähler. DOM-Updates sind idempotent, damit keine doppelten Elemente entstehen.

`src/options/index.ts`

Die Optionsseite zeigt Berechtigungen, Datenschutzgrenzen, GitHub- und Lizenzhinweise und verwaltet lokale Tag-Konfigurationen. Tags und Farben sind bewusst gekoppelt: Jeder Tag hat genau eine Farbe.

`src/background/index.ts`

Der Background-Service-Worker öffnet Extension-Seiten wie die Optionsseite über `chrome.runtime.openOptionsPage`. Content Scripts senden dafür nur eine Runtime-Nachricht und navigieren nicht direkt auf `chrome-extension://`-URLs.

`src/content/DOMObserver.ts`

Der Observer kapselt `MutationObserver`, ignoriert NexusChats-eigene DOM-Änderungen und bündelt Host-Page-Änderungen per `requestAnimationFrame`.

`src/storage/StorageService.ts`

Der Storage-Service kapselt `chrome.storage.local`. Gespeichert werden nur lokale UI-Zustände und lokale Konfiguration: Auswahlmodi aktiv ja/nein, ausgewählte Chat-IDs pro Scope und Tag-Farb-Definitionen.

`src/utils/`

Utilities enthalten kleine, wiederverwendbare Funktionen für DOM-Zugriff, Scheduling und URL-Grenzen.

## DOM-Strategie

ChatGPT verwendet eine dynamische Oberfläche. NexusChats behandelt die Host-Seite deshalb als veränderlich:

- DOM-Mounting ist idempotent.
- Ein `MutationObserver` stößt nur geplante Render-Durchläufe an.
- NexusChats-eigene DOM-Mutationen werden vom Observer ignoriert.
- Checkboxen werden pro Chat-Link nur einmal erzeugt.
- Stale Checkboxen und Hervorhebungen werden entfernt, wenn Chats verschwinden oder der Auswahlmodus deaktiviert wird.
- Es werden keine zufälligen ChatGPT-CSS-Klassen als Integrationspunkte verwendet.

## Datenschutzgrenze

Der Auswahlmodus speichert keine Chat-Inhalte. Lokal gespeichert werden nur:

- `selectionModeEnabled`
- `selectedChatIds`
- `projectSelectionModeEnabled`
- `projectSelectedChatIds`
- `tags`

Die IDs werden für lokale UI-Auswahl benötigt. Tag-Namen und Farben werden vom Nutzer lokal konfiguriert. Titel, Nachrichten, Prompts, Antworten und URLs bleiben ungespeichert.

## Erweiterbarkeit

Neue Features sollen jeweils ein eigenes Modul unter `src/features/` erhalten. UI, Storage und Fachlogik bleiben getrennt, damit spätere Beiträge leichter geprüft und getestet werden können.
