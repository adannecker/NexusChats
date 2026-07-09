# Store Listing Draft

Dieses Dokument bereitet ein spaeteres Chrome Web Store Listing vor. Es ist ein Arbeitsdokument und sollte vor einer Veroeffentlichung mit dem aktuellen Funktionsumfang abgeglichen werden.

## Name

NexusChats

## Kurzbeschreibung

Local-first productivity tools for organizing ChatGPT conversations.

## Ein-Satz-Beschreibung

NexusChats adds local, private, open-source organization tools to the ChatGPT sidebar.

## Lange Beschreibung

NexusChats is a free, local-first, privacy-first, open-source Chrome extension for organizing ChatGPT conversations.

The extension adds a small NexusChats area to the ChatGPT sidebar. The current version provides a selection mode with checkboxes, multi-select, visual highlighting, a selected-count indicator, and controls to select all visible chats or clear the current selection.

NexusChats does not include ads, tracking, analytics, cloud sync, or hidden premium features. It does not send chat content or settings to external servers.

Current features:

- local sidebar tools for ChatGPT
- selection mode
- checkboxes next to detected chats
- multi-select
- selected chat counter
- select all
- clear selection
- local-only UI state

Planned features:

- pins
- favorites
- tags
- colors
- bulk archive and delete
- export and backup
- themes
- plugin system

## Datenschutz-Hinweis fuer Store

NexusChats processes visible ChatGPT sidebar links locally in the browser to provide organization UI. It stores only local UI state, such as whether selection mode is active and which chat IDs are selected. It does not collect, sell, transmit, or share user data.

## Berechtigungsbegruendung

`storage`

Used to store local UI settings in the browser.

`https://chatgpt.com/*`

Used so the extension can add organization controls to the ChatGPT sidebar.

## Kategorie

Productivity

## Sprache

English primary, German project documentation available.

## Zielgruppe

- heavy ChatGPT users
- researchers
- developers
- writers
- students
- knowledge workers
- privacy-conscious users

## Screenshots Checkliste

Vor Store-Einreichung erstellen:

- ChatGPT sidebar with NexusChats panel
- selection mode inactive
- selection mode active with checkboxes
- several selected chats with highlighted state
- selected-count and action buttons

Screenshots duerfen keine echten privaten Chat-Inhalte enthalten.

## Support

Support should point to:

- GitHub Issues for bugs and feature requests
- SECURITY.md for sensitive security or privacy reports
- docs/privacy.md for privacy details

## Keywords

ChatGPT, productivity, local first, privacy, open source, sidebar, conversation management, tags, pins, export, backup
