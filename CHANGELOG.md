# Changelog

Alle nennenswerten Änderungen an NexusChats werden in dieser Datei dokumentiert.

Das Format orientiert sich an Keep a Changelog, und dieses Projekt verwendet semantische Versionierung, sobald die öffentliche API stabil genug dafür ist.

## [0.2.0] - 2026-07-09

### Added

- Vollständiger Auswahlmodus für erkannte ChatGPT-Sidebar-Chats
- Checkbox neben jedem erkannten Chat im Auswahlmodus
- Mehrfachauswahl mit visueller Hervorhebung
- Anzeige der Anzahl ausgewählter Chats
- Buttons `Alle auswählen` und `Auswahl aufheben`
- `SelectionManager` für Auswahlzustand und lokale UI-Persistenz
- `ChatDetector` für robuste Chat-Erkennung ohne volatile CSS-Klassen
- `UIRenderer` für idempotente DOM-Aktualisierungen
- `DOMObserver` als MutationObserver-Wrapper mit Render-Coalescing
- `StorageService` für lokale UI-Zustände

### Changed

- Version in Manifest und Package auf `0.2.0` angehoben
- Architektur- und Datenschutzdokumentation auf den Auswahlmodus aktualisiert

## [0.1.0] - 2026-07-09

### Added

- Initiale Open-Source-Projektstruktur
- Vite-, TypeScript-, ESLint- und Prettier-Konfiguration
- Manifest V3 für `chatgpt.com`
- Content Script mit MutationObserver
- robuste Sidebar-Erkennung über semantische DOM-Heuristiken
- `NexusChats`-Panel mit Button `Auswahlmodus`
- lokaler Settings-Service für den zukünftigen Auswahlmodus
- Architektur-, Datenschutz- und Beitragsdokumentation
