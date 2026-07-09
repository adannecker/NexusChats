/**
 * Owns selection-mode state and selected chat IDs. It persists only UI state and
 * intentionally never stores chat titles, prompts, messages, or page text.
 */
import { StorageService, type NexusChatsUIState } from "../../storage/StorageService";

export interface SelectionSnapshot {
  readonly selectedChatIds: ReadonlySet<string>;
  readonly selectedCount: number;
  readonly selectionModeEnabled: boolean;
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
  private readonly selectedChatIds = new Set<string>();
  private readonly subscribers = new Set<SelectionSubscriber>();

  private selectionModeEnabled = false;

  constructor(private readonly storageService: SelectionStorage = new StorageService()) {}

  async initialize(): Promise<void> {
    const uiState = await this.storageService.readUIState();

    this.selectionModeEnabled = uiState.selectionModeEnabled;
    this.selectedChatIds.clear();
    uiState.selectedChatIds.forEach((chatId) => this.selectedChatIds.add(chatId));
    this.notify();
  }

  getSnapshot(): SelectionSnapshot {
    return {
      selectedChatIds: new Set(this.selectedChatIds),
      selectedCount: this.selectedChatIds.size,
      selectionModeEnabled: this.selectionModeEnabled
    };
  }

  subscribe(subscriber: SelectionSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getSnapshot());

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  toggleMode(): void {
    this.setMode(!this.selectionModeEnabled);
  }

  setMode(isEnabled: boolean): void {
    if (this.selectionModeEnabled === isEnabled) {
      return;
    }

    this.selectionModeEnabled = isEnabled;
    this.commit();
  }

  toggleChat(chatId: string): void {
    if (!this.selectionModeEnabled || !chatId) {
      return;
    }

    if (this.selectedChatIds.has(chatId)) {
      this.selectedChatIds.delete(chatId);
    } else {
      this.selectedChatIds.add(chatId);
    }

    this.commit();
  }

  selectAll(chatIds: readonly string[]): void {
    if (!this.selectionModeEnabled) {
      return;
    }

    let changed = false;

    chatIds.forEach((chatId) => {
      if (chatId && !this.selectedChatIds.has(chatId)) {
        this.selectedChatIds.add(chatId);
        changed = true;
      }
    });

    if (changed) {
      this.commit();
    }
  }

  clearSelection(): void {
    if (this.selectedChatIds.size === 0) {
      return;
    }

    this.selectedChatIds.clear();
    this.commit();
  }

  private commit(): void {
    this.persist();
    this.dispatchChangeEvent();
    this.notify();
  }

  private persist(): void {
    void this.storageService.saveUIState({
      selectedChatIds: Array.from(this.selectedChatIds).sort(),
      selectionModeEnabled: this.selectionModeEnabled
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
          selectedCount: this.selectedChatIds.size,
          selectionModeEnabled: this.selectionModeEnabled
        }
      })
    );
  }
}
