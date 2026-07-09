# Roadmap

Diese Roadmap beschreibt die geplante Entwicklung von NexusChats. Sie ist ein Arbeitsdokument und kann sich durch Community-Feedback, ChatGPT-UI-Aenderungen und Sicherheitsanforderungen veraendern.

## Version 1 - Sidebar und Auswahlmodus

Ziel: Eine stabile lokale Basis fuer Chat-Verwaltung schaffen.

Geplant und teilweise umgesetzt:

- robuste Sidebar-Erkennung
- eigener `NexusChats`-Bereich oberhalb der Chatliste
- Auswahlmodus
- Checkboxen neben Chats
- Mehrfachauswahl
- Anzahl ausgewaehlter Chats
- `Alle auswaehlen`
- `Auswahl aufheben`
- lokale Speicherung von UI-Zustaenden
- keine Speicherung von Chat-Inhalten
- keine Bulk-Aktionen mit destruktiver Wirkung

## Version 2 - Organisation

Ziel: Chats lokal strukturieren und schneller wiederfinden.

Geplant:

- Pins
- Favoriten
- Tags
- Farben
- lokale Filter
- lokale Sortier- und Gruppierungsoptionen
- Import und Export lokaler Organisationsdaten
- klare Datenschutzdokumentation fuer jede neue gespeicherte Information

## Version 3 - Bulk-Aktionen und Datenportabilitaet

Ziel: Wiederkehrende Verwaltungsaufgaben schneller und sicherer machen.

Geplant:

- Bulk Delete
- Bulk Archive
- Export
- Backup
- Sicherheitsbestaetigungen fuer destruktive Aktionen
- Undo- oder Wiederherstellungsstrategie, sofern technisch moeglich
- Tests fuer Bulk-Workflows
- klare UI-Zustaende fuer laufende Aktionen und Fehler

## Version 4 - Anpassung und Erweiterbarkeit

Ziel: NexusChats an unterschiedliche Arbeitsweisen anpassbar machen.

Geplant:

- Themes
- lokale Statistiken
- Plugin-System
- dokumentierte Plugin-Schnittstellen
- Berechtigungsmodell fuer Plugins
- deaktivierbare Module
- stabile interne Events

## Version 5 - Weitere KI-Plattformen

Ziel: Die lokale Organisationslogik auf weitere KI-Plattformen uebertragen.

Geplant:

- Plattform-Abstraktion fuer Sidebar- und Chat-Erkennung
- Unterstuetzung weiterer KI-Plattformen
- plattformspezifische Adapter
- gemeinsames lokales Datenmodell fuer UI-Zustaende
- strikte Host-Berechtigungen pro Plattform

## Laufende Aufgaben

- Barrierefreiheit verbessern
- DOM-Heuristiken gegen ChatGPT-UI-Aenderungen haerten
- Testabdeckung erweitern
- Release-Automatisierung pflegen
- Store-Listing vorbereiten
- Community-Prozesse dokumentieren
