# Privacy

NexusChats ist Local First und Privacy First. Die Erweiterung soll ChatGPT-Unterhaltungen besser verwaltbar machen, ohne Nutzerdaten an externe Server zu übertragen.

## Kurzfassung

- keine Telemetrie
- keine Analytics
- keine Werbung
- keine Cloud-Synchronisierung
- keine externen API-Aufrufe
- keine Remote-Konfiguration
- keine Übertragung von Chat-Inhalten
- lokale Speicherung nur für UI-Zustände

## Welche Daten verarbeitet werden

NexusChats verarbeitet im Browser:

- sichtbare Chat-Links in der ChatGPT-Sidebar
- sichtbare Chat-Links in geöffneten ChatGPT-Projektlisten
- daraus abgeleitete Chat-IDs
- lokalen UI-Zustand der Auswahlmodi
- lokal angelegte Tag-Namen und Farben

Aktuell gespeicherte lokale UI-Zustände:

- `selectionModeEnabled`: ob der Sidebar-Auswahlmodus aktiv ist
- `selectedChatIds`: welche Sidebar-Chat-IDs lokal ausgewählt sind
- `projectSelectionModeEnabled`: ob der Projekt-Auswahlmodus aktiv ist
- `projectSelectedChatIds`: welche Projekt-Chat-IDs lokal ausgewählt sind
- `tags`: lokal angelegte Tags mit je einer Farbe

## Welche Daten nicht gespeichert werden

NexusChats speichert nicht:

- Chat-Titel
- Prompts
- Antworten
- Nachrichteninhalte
- vollständige Chat-URLs
- Account-Daten
- Namen
- E-Mail-Adressen
- Nutzungsstatistiken
- Analytics-Events

## Welche Daten übertragen werden

Keine.

NexusChats enthält keinen Backend-Service und führt keine absichtlichen Netzwerkaufrufe an externe Server aus.

## Berechtigungen

`https://chatgpt.com/*`

Diese Host-Berechtigung begrenzt die Erweiterung auf ChatGPT. NexusChats soll nur dort laufen, wo die UI erweitert wird.

`storage`

Diese Chrome-Berechtigung wird für `chrome.storage.local` genutzt. Damit bleiben UI-Einstellungen lokal im Browser erhalten.

## Lokale Speicherung

Alle Einstellungen werden lokal über `chrome.storage.local` gespeichert. Sie werden nicht mit NexusChats-Servern synchronisiert, weil es keine NexusChats-Server gibt.

Browser oder Chrome-Profile können eigene Synchronisierungsmechanismen besitzen. NexusChats selbst steuert oder nutzt keine externe Synchronisierung.

## Zukünftige Funktionen

Geplante Funktionen wie Pins, Favoriten, Tags, Farben, Export oder Backup dürfen das Datenschutzmodell nicht stillschweigend verändern.

Jede neue Speicherung muss dokumentieren:

- welche Daten gespeichert werden
- warum sie gebraucht werden
- ob sie optional ist
- wie sie exportiert oder gelöscht werden kann
- ob neue Berechtigungen erforderlich sind

## Datenschutzfragen

Wenn du eine Datenschutzfrage hast, nutze das entsprechende Issue Template oder melde sensible Hinweise privat gemäß [SECURITY.md](../SECURITY.md).
