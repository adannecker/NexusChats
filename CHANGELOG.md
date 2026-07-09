# Changelog

Alle nennenswerten Aenderungen an NexusChats werden in dieser Datei dokumentiert.

Das Format orientiert sich an Keep a Changelog, und dieses Projekt verwendet semantische Versionierung, sobald die oeffentliche API stabil genug dafuer ist.

## [0.2.0] - 2026-07-09

### Added

- Vollstaendiger Auswahlmodus fuer erkannte ChatGPT-Sidebar-Chats
- Checkbox neben jedem erkannten Chat im Auswahlmodus
- Mehrfachauswahl mit visueller Hervorhebung
- Anzeige der Anzahl ausgewaehlter Chats
- Buttons `Alle auswaehlen` und `Auswahl aufheben`
- `SelectionManager` fuer Auswahlzustand und lokale UI-Persistenz
- `ChatDetector` fuer robuste Chat-Erkennung ohne volatile CSS-Klassen
- `UIRenderer` fuer idempotente DOM-Aktualisierungen
- `DOMObserver` als MutationObserver-Wrapper mit Render-Coalescing
- `StorageService` fuer lokale UI-Zustaende

### Changed

- Version in Manifest und Package auf `0.2.0` angehoben
- Architektur- und Datenschutzdokumentation auf den Auswahlmodus aktualisiert

## [0.1.0] - 2026-07-09

### Added

- Initiale Open-Source-Projektstruktur
- Vite-, TypeScript-, ESLint- und Prettier-Konfiguration
- Manifest V3 fuer `chatgpt.com`
- Content Script mit MutationObserver
- robuste Sidebar-Erkennung ueber semantische DOM-Heuristiken
- `NexusChats`-Panel mit Button `Auswahlmodus`
- lokaler Settings-Service fuer den zukuenftigen Auswahlmodus
- Architektur-, Datenschutz- und Beitragsdokumentation
