# Privacy

NexusChats ist Local First und Privacy First. Die Erweiterung soll ChatGPT-Unterhaltungen besser verwaltbar machen, ohne Nutzerdaten an externe Server zu uebertragen.

## Kurzfassung

- keine Telemetrie
- keine Analytics
- keine Werbung
- keine Cloud-Synchronisierung
- keine externen API-Aufrufe
- keine Remote-Konfiguration
- keine Uebertragung von Chat-Inhalten
- lokale Speicherung nur fuer UI-Zustaende

## Welche Daten verarbeitet werden

NexusChats verarbeitet im Browser:

- sichtbare Chat-Links in der ChatGPT-Sidebar
- daraus abgeleitete Chat-IDs
- lokalen UI-Zustand des Auswahlmodus

Aktuell gespeicherte lokale UI-Zustaende:

- `selectionModeEnabled`: ob der Auswahlmodus aktiv ist
- `selectedChatIds`: welche Chat-IDs lokal ausgewaehlt sind

## Welche Daten nicht gespeichert werden

NexusChats speichert nicht:

- Chat-Titel
- Prompts
- Antworten
- Nachrichteninhalte
- vollstaendige Chat-URLs
- Account-Daten
- Namen
- E-Mail-Adressen
- Nutzungsstatistiken
- Analytics-Events

## Welche Daten uebertragen werden

Keine.

NexusChats enthaelt keinen Backend-Service und fuehrt keine absichtlichen Netzwerkaufrufe an externe Server aus.

## Berechtigungen

`https://chatgpt.com/*`

Diese Host-Berechtigung begrenzt die Erweiterung auf ChatGPT. NexusChats soll nur dort laufen, wo die UI erweitert wird.

`storage`

Diese Chrome-Berechtigung wird fuer `chrome.storage.local` genutzt. Damit bleiben UI-Einstellungen lokal im Browser erhalten.

## Lokale Speicherung

Alle Einstellungen werden lokal ueber `chrome.storage.local` gespeichert. Sie werden nicht mit NexusChats-Servern synchronisiert, weil es keine NexusChats-Server gibt.

Browser oder Chrome-Profile koennen eigene Synchronisierungsmechanismen besitzen. NexusChats selbst steuert oder nutzt keine externe Synchronisierung.

## Zukuenftige Funktionen

Geplante Funktionen wie Pins, Favoriten, Tags, Farben, Export oder Backup duerfen das Datenschutzmodell nicht stillschweigend veraendern.

Jede neue Speicherung muss dokumentieren:

- welche Daten gespeichert werden
- warum sie gebraucht werden
- ob sie optional ist
- wie sie exportiert oder geloescht werden kann
- ob neue Berechtigungen erforderlich sind

## Datenschutzfragen

Wenn du eine Datenschutzfrage hast, nutze das entsprechende Issue Template oder melde sensible Hinweise privat gemaess [SECURITY.md](../SECURITY.md).
