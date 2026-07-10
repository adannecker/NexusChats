# Contributing

Danke, dass du zu NexusChats beitragen möchtest.

NexusChats soll langfristig von einer Community gepflegt werden können. Deshalb sind klare Kommunikation, kleine Pull Requests und Datenschutzbewusstsein genauso wichtig wie Code.

## Grundsätze

- Local First respektieren
- Privacy First respektieren
- keine Tracking- oder Werbefunktionen einführen
- keine Cloud-Abhängigkeit für Kernfunktionen einführen
- keine versteckten Premium-Mechanismen einführen
- keine unnötigen Runtime-Abhängigkeiten hinzufügen
- keine zufälligen ChatGPT-CSS-Klassen als stabile Integrationspunkte verwenden

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

Danach kann der Ordner `dist` in Chrome über `chrome://extensions` als entpackte Erweiterung geladen werden.

## Qualitätschecks

Bitte vor jedem Pull Request ausführen:

```bash
npm run verify
```

Wenn ein Check lokal nicht ausgeführt werden kann, dokumentiere den Grund im Pull Request.

## Architekturregeln

- UI und Logik getrennt halten.
- DOM-Erkennung in Detector- oder Service-Klassen kapseln.
- Persistenz nur über Storage-Services.
- Feature-Logik unter `src/features/` organisieren.
- Content-Script-Orchestrierung schlank halten.
- DOM-Updates idempotent schreiben, damit keine doppelten Elemente entstehen.
- Mutationen bündeln, um unnötige Repaints zu vermeiden.

## Datenschutzregeln

Jede neue Speicherung muss im Pull Request beschrieben werden.

Bitte beantworte:

- Welche Daten werden verarbeitet?
- Werden Daten gespeichert?
- Wenn ja, wo und wie lange?
- Wird etwas an externe Server gesendet?
- Ändern sich Manifest-Berechtigungen?

Chat-Inhalte, Prompts, Antworten und persönliche Informationen dürfen nicht ohne vorherige Diskussion gespeichert werden.

## Commit-Stil

Das Repository ist für automatische Versionierung mit Release Please vorbereitet. Verwende Conventional Commits, damit Releases nachvollziehbar erstellt werden können.

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

Ein guter Pull Request enthält:

- klare Beschreibung der Änderung
- Grund für die Änderung
- Screenshots oder kurze Beschreibung bei UI-Änderungen
- ausgeführte Tests
- Datenschutzbewertung
- Hinweise auf offene Risiken

Halte Pull Requests möglichst klein. Große Umbauten sollten vorher als Issue oder Discussion skizziert werden.

## Issues

Bitte nutze die Issue Templates:

- Bug Report
- Feature Request
- Privacy or Security Question

Sicherheitsprobleme mit Ausnutzungsdetails gehören nicht in ein öffentliches Issue. Siehe [SECURITY.md](SECURITY.md).

## Review-Kultur

Reviews sollen freundlich, konkret und lösungsorientiert sein. Technische Kritik ist willkommen; persönliche Angriffe sind es nicht.
