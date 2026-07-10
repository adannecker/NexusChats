/**
 * Owns selection-mode state and selected chat IDs. It persists only UI state and
 * intentionally never stores chat titles, prompts, messages, or page text.
 */
import { StorageService, type NexusChatsUIState } from "../../storage/StorageService";

export type SelectionScope = "sidebar" | "project";

export interface ScopedSelectionSnapshot {
  readonly selectedChatIds: ReadonlySet<string>;
  readonly selectedCount: number;
  readonly selectionModeEnabled: boolean;
}

export interface SelectionSnapshot extends ScopedSelectionSnapshot {
  readonly scopes: Readonly<Record<SelectionScope, ScopedSelectionSnapshot>>;
}

export type SelectionSubscriber = (snapshot: SelectionSnapshot) => void;

export interface SelectionStorage {
  readUIState(): Promise<NexusChatsUIState>;
  saveUIState(uiState: NexusChatsUIState): Promise<void>;
}

/**
 * Provides the complete selection-mode API used by UI controls and chat-row
 * interactions.
 */
export class SelectionManager {
  private readonly selectedChatIdsByScope: Record<SelectionScope, Set<string>> = {
    project: new Set<string>(),
    sidebar: new Set<string>()
  };
  private readonly subscribers = new Set<SelectionSubscriber>();

  private readonly selectionModeEnabledByScope: Record<SelectionScope, boolean> = {
    project: false,
    sidebar: false
  };

  constructor(private readonly storageService: SelectionStorage = new StorageService()) {}

  async initialize(): Promise<void> {
    const uiState = await this.storageService.readUIState();

    this.selectionModeEnabledByScope.sidebar = uiState.selectionModeEnabled;
    this.selectionModeEnabledByScope.project = uiState.projectSelectionModeEnabled;
    this.selectedChatIdsByScope.sidebar.clear();
    this.selectedChatIdsByScope.project.clear();
    uiState.selectedChatIds.forEach((chatId) => this.selectedChatIdsByScope.sidebar.add(chatId));
    uiState.projectSelectedChatIds.forEach((chatId) =>
      this.selectedChatIdsByScope.project.add(chatId)
    );
    this.notify();
  }

  getSnapshot(): SelectionSnapshot {
    const sidebar = this.getScopeSnapshot("sidebar");
    const project = this.getScopeSnapshot("project");

    return {
      ...sidebar,
      scopes: {
        project,
        sidebar
      }
    };
  }

  getScopeSnapshot(scope: SelectionScope): ScopedSelectionSnapshot {
    const selectedChatIds = this.selectedChatIdsByScope[scope];

    return {
      selectedChatIds: new Set(selectedChatIds),
      selectedCount: selectedChatIds.size,
      selectionModeEnabled: this.selectionModeEnabledByScope[scope]
    };
  }

  subscribe(subscriber: SelectionSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getSnapshot());

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  toggleMode(scope: SelectionScope = "sidebar"): void {
    this.setMode(!this.selectionModeEnabledByScope[scope], scope);
  }

  setMode(isEnabled: boolean, scope: SelectionScope = "sidebar"): void {
    if (this.selectionModeEnabledByScope[scope] === isEnabled) {
      return;
    }

    this.selectionModeEnabledByScope[scope] = isEnabled;
    this.commit();
  }

  toggleChat(chatId: string, scope: SelectionScope = "sidebar"): void {
    const selectedChatIds = this.selectedChatIdsByScope[scope];

    if (!this.selectionModeEnabledByScope[scope] || !chatId) {
      return;
    }

    if (selectedChatIds.has(chatId)) {
      selectedChatIds.delete(chatId);
    } else {
      selectedChatIds.add(chatId);
    }

    this.commit();
  }

  selectAll(chatIds: readonly string[], scope: SelectionScope = "sidebar"): void {
    const selectedChatIds = this.selectedChatIdsByScope[scope];

    if (!this.selectionModeEnabledByScope[scope]) {
      return;
    }

    let changed = false;

    chatIds.forEach((chatId) => {
      if (chatId && !selectedChatIds.has(chatId)) {
        selectedChatIds.add(chatId);
        changed = true;
      }
    });

    if (changed) {
      this.commit();
    }
  }

  clearSelection(scope: SelectionScope = "sidebar"): void {
    const selectedChatIds = this.selectedChatIdsByScope[scope];

    if (selectedChatIds.size === 0) {
      return;
    }

    selectedChatIds.clear();
    this.commit();
  }

  private commit(): void {
    this.persist();
    this.dispatchChangeEvent();
    this.notify();
  }

  private persist(): void {
    void this.storageService.saveUIState({
      projectSelectedChatIds: Array.from(this.selectedChatIdsByScope.project).sort(),
      projectSelectionModeEnabled: this.selectionModeEnabledByScope.project,
      selectedChatIds: Array.from(this.selectedChatIdsByScope.sidebar).sort(),
      selectionModeEnabled: this.selectionModeEnabledByScope.sidebar
    });
  }

  private notify(): void {
    const snapshot = this.getSnapshot();
    this.subscribers.forEach((subscriber) => subscriber(snapshot));
  }

  private dispatchChangeEvent(): void {
    if (typeof document === "undefined") {
      return;
    }

    document.dispatchEvent(
      new CustomEvent("nexuschats:selection-changed", {
        detail: {
          projectSelectedCount: this.selectedChatIdsByScope.project.size,
          projectSelectionModeEnabled: this.selectionModeEnabledByScope.project,
          selectedCount: this.selectedChatIdsByScope.sidebar.size,
          selectionModeEnabled: this.selectionModeEnabledByScope.sidebar
        }
      })
    );
  }
}
