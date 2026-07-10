# Weiterentwicklung auf einem anderen Rechner

Diese Anleitung beschreibt, was nötig ist, um NexusChats auf einem neuen Rechner auszuchecken, lokal zu bauen, in Chrome zu laden und sicher weiterzuentwickeln.

## Voraussetzungen

- Git
- Node.js 20 oder neuer
- npm
- Google Chrome oder ein Chromium-basierter Browser
- Zugriff auf das Repository: <https://github.com/adannecker/NexusChats>

Es werden keine `.env`-Dateien, API-Keys, Docker-Container oder Backend-Dienste benötigt.

## Repository einrichten

```bash
git clone https://github.com/adannecker/NexusChats.git
cd NexusChats
npm ci
```

`npm ci` nutzt `package-lock.json` und installiert die Abhängigkeiten reproduzierbar. Wenn die Lockfile bewusst aktualisiert werden soll, nutze stattdessen `npm install`.

## Extension bauen und laden

```bash
npm run build
```

Der fertige Extension-Ordner liegt danach unter `dist/`.

In Chrome:

1. `chrome://extensions` öffnen.
2. Entwicklermodus aktivieren.
3. `Entpackte Erweiterung laden` wählen.
4. Den Ordner `dist` aus diesem Repository auswählen.
5. `https://chatgpt.com` neu laden.

Wenn der Watch-Build läuft oder neu gebaut wurde, muss die entpackte Erweiterung in `chrome://extensions` meist erneut geladen werden.

## Lokale Entwicklung

```bash
npm run dev
```

Der Dev-Befehl baut die Extension im Watch-Modus. Nach Änderungen an Content Script, Background Worker, Manifest, Optionen oder Styles:

1. Build abwarten.
2. Erweiterung in `chrome://extensions` neu laden.
3. ChatGPT-Tab neu laden.

## Qualitätschecks

Vor einem Commit sollte mindestens der komplette Verify-Lauf grün sein:

```bash
npm run verify
```

Einzelne Checks:

```bash
npm run format:check
npm run lint
npm run test
npm run typecheck
npm run build
```

`npm run format` kann genutzt werden, um Prettier-Formatierung automatisch zu korrigieren.

## Wichtige Projektbereiche

- `public/manifest.json`: Manifest V3, Berechtigungen, Content Script, Background Worker und Optionsseite.
- `public/options.html`: statische Optionsseite.
- `src/content/`: Orchestrierung auf `chatgpt.com`.
- `src/background/`: Extension-only APIs, aktuell das Öffnen der Optionsseite.
- `src/options/`: Logik und Styles der Einstellungsseite.
- `src/features/selection/`: Chat-Erkennung und Auswahlzustand.
- `src/features/projects/`: Projekt-Aktionsbereich.
- `src/storage/`: lokale Speicherung über `chrome.storage.local`.
- `src/styles/content.css`: injizierte Styles auf ChatGPT.
- `tests/`: Unit Tests für riskante Logik.

## Lokale Daten und Datenschutz

NexusChats hat kein Backend und überträgt keine Chat-Inhalte an externe Server. Lokal gespeichert werden nur UI-Zustände und Konfigurationen in `chrome.storage.local`, zum Beispiel:

- aktiver Auswahlmodus pro Bereich
- ausgewählte Chat-IDs pro Bereich
- lokal angelegte Tags mit Farben

Diese Daten liegen im jeweiligen Chrome-Profil und werden beim Wechsel auf einen anderen Rechner nicht automatisch aus dem Git-Repository mitgenommen. Für die Weiterentwicklung reicht der Repository-Stand; Testdaten können lokal neu angelegt werden.

## Typische Stolperstellen

- Wenn das Zahnrad die Einstellungen nicht öffnet, Erweiterung und ChatGPT-Tab neu laden. Die Optionsseite wird über den Background Worker geöffnet.
- Content Scripts in Manifest V3 werden hier nicht als ES-Module geladen. Nach einem Build sollte `dist/assets/content.js` nicht mit einem `import` beginnen.
- Die Extension läuft absichtlich nur auf `https://chatgpt.com/*`.
- ChatGPT ändert seine Oberfläche regelmäßig. DOM-Erkennung deshalb über Services und Heuristiken ändern, nicht über zufällige CSS-Klassen.
- Neue gespeicherte Daten müssen in `docs/privacy.md`, `docs/architecture.md` und der Optionsseite transparent dokumentiert werden.

## Empfohlener Arbeitsablauf

```bash
git pull
npm ci
npm run build
npm run dev
```

Vor dem Commit:

```bash
npm run verify
git status
git add -A
git commit -m "feat: describe change"
```

Vor dem Push bei gemeinsam genutzten Branches noch einmal `git pull` oder einen Rebase-Workflow nutzen, damit der lokale Stand aktuell ist.
