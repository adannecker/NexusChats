# Security Policy

NexusChats arbeitet lokal im Browser und soll keine Nutzerdaten an externe Server uebertragen. Sicherheits- und Datenschutzmeldungen werden deshalb mit hoher Prioritaet behandelt.

## Unterstuetzte Versionen

Waehrend der fruehen Entwicklung wird nur die aktuelle Hauptlinie unterstuetzt. Sicherheitsfixes werden in der jeweils neuesten Version veroeffentlicht.

| Version           | Status           |
| ----------------- | ---------------- |
| Aktuelle Version  | Unterstuetzt     |
| Aeltere Versionen | Nicht garantiert |

## Sicherheitsproblem melden

Bitte melde Sicherheitsprobleme nicht oeffentlich, wenn dadurch Nutzer gefaehrdet werden koennten.

Bevorzugte Wege:

1. Verwende GitHub private vulnerability reporting, falls es im Repository aktiviert ist.
2. Falls kein privater Kanal verfuegbar ist, oeffne ein minimales Issue ohne technische Ausnutzungsdetails und bitte um einen privaten Kontaktweg.

Bitte gib, soweit sicher moeglich, folgende Informationen an:

- betroffene Version
- betroffene Browser-Version
- kurze Beschreibung
- erwartetes Verhalten
- tatsaechliches Verhalten
- Schritte zur Reproduktion ohne sensible Chat-Inhalte
- Einschaetzung, ob Daten offengelegt, gespeichert oder uebertragen werden koennten

## Relevante Sicherheitsbereiche

- unbeabsichtigte Datenuebertragung
- zu breite Manifest-Berechtigungen
- unsichere DOM-Injektion
- Speichern sensibler Chat-Inhalte
- Cross-site scripting durch Host-Seiten-Inhalte
- Remote-Code-Ausfuehrung
- manipulative oder verdeckte UI-Aktionen
- unsichere Release-Artefakte

## Erwartete Reaktionsweise

Maintainer sollten:

- Meldungen bestaetigen
- Reproduktion pruefen
- Risiko einschaetzen
- Fix vorbereiten
- Release erstellen
- Changelog und Security-Hinweise aktualisieren

## Projektversprechen

- keine Telemetrie
- keine Werbung
- keine Remote-Code-Ausfuehrung
- keine versteckten Netzwerkaufrufe
- keine Serverabhaengigkeit fuer Kernfunktionen
- enge Host-Berechtigungen
- lokale Speicherung nur dokumentierter UI-Zustaende
