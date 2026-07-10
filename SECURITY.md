# Security Policy

NexusChats arbeitet lokal im Browser und soll keine Nutzerdaten an externe Server übertragen. Sicherheits- und Datenschutzmeldungen werden deshalb mit hoher Priorität behandelt.

## Unterstützte Versionen

Während der frühen Entwicklung wird nur die aktuelle Hauptlinie unterstützt. Sicherheitsfixes werden in der jeweils neuesten Version veröffentlicht.

| Version          | Status           |
| ---------------- | ---------------- |
| Aktuelle Version | Unterstützt      |
| Ältere Versionen | Nicht garantiert |

## Sicherheitsproblem melden

Bitte melde Sicherheitsprobleme nicht öffentlich, wenn dadurch Nutzer gefährdet werden könnten.

Bevorzugte Wege:

1. Verwende GitHub private vulnerability reporting, falls es im Repository aktiviert ist.
2. Falls kein privater Kanal verfügbar ist, öffne ein minimales Issue ohne technische Ausnutzungsdetails und bitte um einen privaten Kontaktweg.

Bitte gib, soweit sicher möglich, folgende Informationen an:

- betroffene Version
- betroffene Browser-Version
- kurze Beschreibung
- erwartetes Verhalten
- tatsächliches Verhalten
- Schritte zur Reproduktion ohne sensible Chat-Inhalte
- Einschätzung, ob Daten offengelegt, gespeichert oder übertragen werden könnten

## Relevante Sicherheitsbereiche

- unbeabsichtigte Datenübertragung
- zu breite Manifest-Berechtigungen
- unsichere DOM-Injektion
- Speichern sensibler Chat-Inhalte
- Cross-site scripting durch Host-Seiten-Inhalte
- Remote-Code-Ausführung
- manipulative oder verdeckte UI-Aktionen
- unsichere Release-Artefakte

## Erwartete Reaktionsweise

Maintainer sollten:

- Meldungen bestätigen
- Reproduktion prüfen
- Risiko einschätzen
- Fix vorbereiten
- Release erstellen
- Changelog und Security-Hinweise aktualisieren

## Projektversprechen

- keine Telemetrie
- keine Werbung
- keine Remote-Code-Ausführung
- keine versteckten Netzwerkaufrufe
- keine Serverabhängigkeit für Kernfunktionen
- enge Host-Berechtigungen
- lokale Speicherung nur dokumentierter UI-Zustände
