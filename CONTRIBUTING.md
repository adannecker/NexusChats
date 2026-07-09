# Contributing

Danke, dass du zu NexusChats beitragen moechtest.

NexusChats soll langfristig von einer Community gepflegt werden koennen. Deshalb sind klare Kommunikation, kleine Pull Requests und Datenschutzbewusstsein genauso wichtig wie Code.

## Grundsaetze

- Local First respektieren
- Privacy First respektieren
- keine Tracking- oder Werbefunktionen einfuehren
- keine Cloud-Abhaengigkeit fuer Kernfunktionen einfuehren
- keine versteckten Premium-Mechanismen einfuehren
- keine unnoetigen Runtime-Abhaengigkeiten hinzufuegen
- keine zufaelligen ChatGPT-CSS-Klassen als stabile Integrationspunkte verwenden

## Entwicklungsumgebung

Voraussetzungen:

- Node.js 20 oder neuer
- npm
- Chrome oder Chromium

Installation:

```bash
npm install
```

Lokale Entwicklung:

```bash
npm run dev
```

Produktionsbuild:

```bash
npm run build
```

Danach kann der Ordner `dist` in Chrome ueber `chrome://extensions` als entpackte Erweiterung geladen werden.

## Qualitaetschecks

Bitte vor jedem Pull Request ausfuehren:

```bash
npm run verify
```

Wenn ein Check lokal nicht ausgefuehrt werden kann, dokumentiere den Grund im Pull Request.

## Architekturregeln

- UI und Logik getrennt halten.
- DOM-Erkennung in Detector- oder Service-Klassen kapseln.
- Persistenz nur ueber Storage-Services.
- Feature-Logik unter `src/features/` organisieren.
- Content-Script-Orchestrierung schlank halten.
- DOM-Updates idempotent schreiben, damit keine doppelten Elemente entstehen.
- Mutationen buendeln, um unnoetige Repaints zu vermeiden.

## Datenschutzregeln

Jede neue Speicherung muss im Pull Request beschrieben werden.

Bitte beantworte:

- Welche Daten werden verarbeitet?
- Werden Daten gespeichert?
- Wenn ja, wo und wie lange?
- Wird etwas an externe Server gesendet?
- Aendern sich Manifest-Berechtigungen?

Chat-Inhalte, Prompts, Antworten und persoenliche Informationen duerfen nicht ohne vorherige Diskussion gespeichert werden.

## Commit-Stil

Das Repository ist fuer automatische Versionierung mit Release Please vorbereitet. Verwende Conventional Commits, damit Releases nachvollziehbar erstellt werden koennen.

Beispiele:

```text
feat(selection): add keyboard range selection
fix(sidebar): avoid duplicate checkbox rendering
docs: expand privacy documentation
test(selection): cover clear selection behavior
```

Wichtige Typen:

- `feat`: neue Funktion
- `fix`: Fehlerbehebung
- `docs`: Dokumentation
- `test`: Tests
- `refactor`: interne Umstrukturierung ohne neues Verhalten
- `chore`: Wartung

## Pull Requests

Ein guter Pull Request enthaelt:

- klare Beschreibung der Aenderung
- Grund fuer die Aenderung
- Screenshots oder kurze Beschreibung bei UI-Aenderungen
- ausgefuehrte Tests
- Datenschutzbewertung
- Hinweise auf offene Risiken

Halte Pull Requests moeglichst klein. Grosse Umbauten sollten vorher als Issue oder Discussion skizziert werden.

## Issues

Bitte nutze die Issue Templates:

- Bug Report
- Feature Request
- Privacy or Security Question

Sicherheitsprobleme mit Ausnutzungsdetails gehoeren nicht in ein oeffentliches Issue. Siehe [SECURITY.md](SECURITY.md).

## Review-Kultur

Reviews sollen freundlich, konkret und loesungsorientiert sein. Technische Kritik ist willkommen; persoenliche Angriffe sind es nicht.
