# Roadmap / Todo

Diese Roadmap beschreibt die geplante Entwicklung von NexusChats. Sie ist ein Arbeitsdokument und kann sich durch Community-Feedback, ChatGPT-UI-Änderungen und Sicherheitsanforderungen verändern.

Abgehakte Einträge sind bereits umgesetzt. Offene Einträge können hier direkt während der Entwicklung abgehakt werden.

## Version 1 - Sidebar und Auswahlmodus

Ziel: Eine stabile lokale Basis für Chat-Verwaltung schaffen.

Todo:

- [x] robuste Sidebar-Erkennung
- [x] eigener `NexusChats`-Bereich oberhalb der Chatliste
- [x] Auswahlmodus
- [x] Checkboxen neben Chats
- [x] Mehrfachauswahl
- [x] Anzahl ausgewählter Chats
- [x] `Alle auswählen`
- [x] `Auswahl aufheben`
- [x] kompakte Auswahl-Steuerung mit Switch und Icon-Aktionen
- [x] horizontaler Aktionsbereich in Projektansichten neben `Quellen`
- [x] getrennte Chat-Auswahl für sichtbare Projekt-Chats
- [x] Projekt-Checkboxen links neben Einträgen ohne Höhenänderung
- [x] lokale Speicherung von UI-Zuständen
- [x] keine Speicherung von Chat-Inhalten
- [x] keine Bulk-Aktionen mit destruktiver Wirkung

## Version 2 - Organisation

Ziel: Chats lokal strukturieren und schneller wiederfinden.

Todo:

- [x] Einstellungsseite für transparente Berechtigungs- und Lizenzhinweise
- [x] Konfigurationsseite für Tags mit jeweils eigener Farbe
- [ ] Pins
- [ ] Favoriten
- [ ] Tags
- [ ] Farben
- [ ] lokale Filter
- [ ] lokale Sortier- und Gruppierungsoptionen
- [ ] Import und Export lokaler Organisationsdaten
- [ ] klare Datenschutzdokumentation für jede neue gespeicherte Information

## Version 3 - Bulk-Aktionen und Datenportabilität

Ziel: Wiederkehrende Verwaltungsaufgaben schneller und sicherer machen.

Todo:

- [ ] Bulk Delete
- [ ] Bulk Archive
- [ ] Export
- [ ] Backup
- [ ] Sicherheitsbestätigungen für destruktive Aktionen
- [ ] Undo- oder Wiederherstellungsstrategie, sofern technisch möglich
- [ ] Tests für Bulk-Workflows
- [ ] klare UI-Zustände für laufende Aktionen und Fehler

## Version 4 - Anpassung und Erweiterbarkeit

Ziel: NexusChats an unterschiedliche Arbeitsweisen anpassbar machen.

Todo:

- [ ] Themes
- [ ] lokale Statistiken
- [ ] Plugin-System
- [ ] dokumentierte Plugin-Schnittstellen
- [ ] Berechtigungsmodell für Plugins
- [ ] deaktivierbare Module
- [ ] stabile interne Events

## Version 5 - Weitere KI-Plattformen

Ziel: Die lokale Organisationslogik auf weitere KI-Plattformen übertragen.

Todo:

- [ ] Plattform-Abstraktion für Sidebar- und Chat-Erkennung
- [ ] Unterstützung weiterer KI-Plattformen
- [ ] plattformspezifische Adapter
- [ ] gemeinsames lokales Datenmodell für UI-Zustände
- [ ] strikte Host-Berechtigungen pro Plattform

## Laufende Aufgaben

- [ ] Barrierefreiheit verbessern
- [ ] DOM-Heuristiken gegen ChatGPT-UI-Änderungen härten
- [ ] Testabdeckung erweitern
- [ ] Release-Automatisierung pflegen
- [ ] Store-Listing vorbereiten
- [ ] Community-Prozesse dokumentieren
