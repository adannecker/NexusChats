# NexusChats

NexusChats is a free, local-first, privacy-first, open-source Chrome extension for organizing ChatGPT conversations.

The goal is simple and ambitious: NexusChats should become the best free open-source extension for managing ChatGPT conversations without tracking, ads, cloud sync, or hidden premium features.

## Vision

ChatGPT is useful, but long conversation histories quickly become hard to manage. NexusChats adds focused productivity tools directly to the ChatGPT sidebar while keeping all state local in the browser.

Core principles:

- Local First
- Privacy First
- Open Source
- No tracking
- No ads
- No cloud backend
- No hidden premium features
- No transfer of user data to external servers

Read the full product direction in [VISION.md](VISION.md).

## Current Features

Version `0.2.0` includes the first complete selection workflow:

- runs only on `https://chatgpt.com/*`
- detects the ChatGPT sidebar with robust DOM heuristics
- adds a `NexusChats` area above the chat list
- provides an `Auswahlmodus` button
- shows a checkbox next to every detected chat while selection mode is active
- supports multi-select
- highlights selected chats visually
- shows the number of selected chats
- provides `Alle auswaehlen` and `Auswahl aufheben`
- uses a `MutationObserver` for dynamic ChatGPT UI changes
- does not delete, archive, rename, export, or modify chats

## Planned Features

The roadmap is intentionally public so contributors can discuss scope early.

- Pins and favorites
- Tags and colors
- Bulk archive and bulk delete
- Export and backup
- Themes
- Local statistics
- Plugin system
- Support for additional AI platforms

See [ROADMAP.md](ROADMAP.md) for the version plan.

A draft Chrome Web Store listing is maintained in [docs/store-listing.md](docs/store-listing.md).

## Privacy

NexusChats stores only local UI state:

- whether selection mode is active
- which chat IDs are currently selected

NexusChats does not store chat titles, prompts, answers, message contents, full URLs, analytics events, or account information. Nothing is sent to external servers.

More detail is available in [docs/privacy.md](docs/privacy.md).

## Installation

The project is not published to the Chrome Web Store yet. For now, install the local build:

1. Install dependencies and build the extension.

   ```bash
   npm install
   npm run build
   ```

2. Open `chrome://extensions`.
3. Enable developer mode.
4. Select `Load unpacked`.
5. Choose the `dist` folder from this repository.
6. Reload `https://chatgpt.com`.

## Local Development

Requirements:

- Node.js 20 or newer
- npm
- Google Chrome or a Chromium-based browser

Install dependencies:

```bash
npm install
```

Run a watch build for extension development:

```bash
npm run dev
```

After each build, reload the unpacked extension in Chrome if Chrome does not pick up the change automatically.

## Build

Create a production build:

```bash
npm run build
```

The extension-ready output is written to `dist/`.

Quality checks:

```bash
npm run verify
```

## Project Structure

```text
.github/              Issue templates, workflows, release automation
docs/                 Architecture, privacy, and store listing docs
public/               Manifest and static extension assets
src/content/          Entry point, DOMObserver, and UIRenderer
src/features/         Feature modules
src/storage/          Local storage abstractions
src/styles/           Content-script styles
src/utils/            Shared helpers
tests/                Unit tests
```

Key architecture pieces:

- `SidebarService` finds the sidebar and mount position.
- `ChatDetector` detects chat links and extracts only chat IDs.
- `SelectionManager` manages selection state.
- `UIRenderer` renders panel controls, checkboxes, counters, and highlighting.
- `DOMObserver` coalesces DOM changes into scheduled renders.
- `StorageService` persists local UI state with `chrome.storage.local`.

More detail is available in [docs/architecture.md](docs/architecture.md).

## Contributing

Community contributions are welcome. Good contributions are small, focused, documented, and aligned with the privacy model.

Before opening a pull request:

```bash
npm run verify
```

Please read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md) before contributing.

## Releases

The repository is prepared for automated releases with Release Please:

- conventional commits drive version proposals
- release PRs update changelog and versions
- successful releases build the extension
- release assets are uploaded as zip files

See the GitHub workflows in [.github/workflows](.github/workflows).

## FAQ

### Is NexusChats free?

Yes. NexusChats is free and open source.

### Will there be premium features?

No hidden premium features are planned. The project goal is to stay fully open and community-maintained.

### Does NexusChats send my chats to a server?

No. NexusChats has no backend and does not send chat data to external servers.

### What data is stored?

Only local UI state is stored: whether selection mode is active and which chat IDs are selected.

### Does NexusChats modify or delete chats?

No. Version `0.2.0` only adds selection UI. Delete and archive workflows are planned for later versions and must be designed with clear safeguards.

### Why does NexusChats need the `storage` permission?

The permission is used for `chrome.storage.local`, so UI settings can persist locally in the browser.

### Why does the extension only run on `chatgpt.com`?

The narrow host permission keeps the extension scoped to the site it enhances and reduces risk.

## License

NexusChats is licensed under the [MIT License](LICENSE).
