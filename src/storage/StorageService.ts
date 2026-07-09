/**
 * Storage adapter for local extension UI state. It wraps chrome.storage.local
 * and degrades to defaults when the API is unavailable in tests or previews.
 */
export interface NexusChatsUIState {
  readonly selectedChatIds: string[];
  readonly selectionModeEnabled: boolean;
}

const DEFAULT_UI_STATE: NexusChatsUIState = {
  selectedChatIds: [],
  selectionModeEnabled: false
};

const UI_STATE_KEY = "nexuschats.uiState";
const LEGACY_SETTINGS_KEY = "nexuschats.settings";

/**
 * Persists only local UI state: selection-mode enabled and selected chat IDs.
 */
export class StorageService {
  async readUIState(): Promise<NexusChatsUIState> {
    const storageArea = this.getStorageArea();

    if (!storageArea) {
      return { ...DEFAULT_UI_STATE };
    }

    return new Promise((resolve) => {
      storageArea.get([UI_STATE_KEY, LEGACY_SETTINGS_KEY], (items) => {
        if (this.hasRuntimeError()) {
          resolve({ ...DEFAULT_UI_STATE });
          return;
        }

        resolve(this.normalizeUIState(items));
      });
    });
  }

  async saveUIState(uiState: NexusChatsUIState): Promise<void> {
    const storageArea = this.getStorageArea();

    if (!storageArea) {
      return;
    }

    await new Promise<void>((resolve) => {
      storageArea.set(
        {
          [UI_STATE_KEY]: this.sanitizeUIState(uiState)
        },
        resolve
      );
    });
  }

  private normalizeUIState(items: Record<string, unknown>): NexusChatsUIState {
    const storedState = items[UI_STATE_KEY] as Partial<NexusChatsUIState> | undefined;
    const legacySettings = items[LEGACY_SETTINGS_KEY] as
      { selectionModeEnabled?: boolean } | undefined;

    return this.sanitizeUIState({
      selectedChatIds: storedState?.selectedChatIds ?? DEFAULT_UI_STATE.selectedChatIds,
      selectionModeEnabled: Boolean(
        storedState?.selectionModeEnabled ?? legacySettings?.selectionModeEnabled
      )
    });
  }

  private sanitizeUIState(uiState: NexusChatsUIState): NexusChatsUIState {
    return {
      selectedChatIds: Array.from(
        new Set(uiState.selectedChatIds.filter((chatId) => typeof chatId === "string" && chatId))
      ).sort(),
      selectionModeEnabled: Boolean(uiState.selectionModeEnabled)
    };
  }

  private getStorageArea(): chrome.storage.StorageArea | null {
    if (typeof chrome === "undefined" || !chrome.storage?.local) {
      return null;
    }

    return chrome.storage.local;
  }

  private hasRuntimeError(): boolean {
    return Boolean(chrome.runtime?.lastError);
  }
}
