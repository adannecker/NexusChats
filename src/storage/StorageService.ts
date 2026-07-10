/**
 * Storage adapter for local extension UI state. It wraps chrome.storage.local
 * and degrades to defaults when the API is unavailable in tests or previews.
 */
export interface NexusChatsUIState {
  readonly projectSelectedChatIds: string[];
  readonly projectSelectionModeEnabled: boolean;
  readonly selectedChatIds: string[];
  readonly selectionModeEnabled: boolean;
}

export interface NexusChatsTagDefinition {
  readonly color: string;
  readonly id: string;
  readonly name: string;
}

export interface NexusChatsConfigurationState {
  readonly tags: NexusChatsTagDefinition[];
}

const DEFAULT_UI_STATE: NexusChatsUIState = {
  projectSelectedChatIds: [],
  projectSelectionModeEnabled: false,
  selectedChatIds: [],
  selectionModeEnabled: false
};

const DEFAULT_CONFIGURATION_STATE: NexusChatsConfigurationState = {
  tags: []
};

const COLOR_PATTERN = /^#[0-9a-f]{6}$/iu;
const CONFIGURATION_STATE_KEY = "nexuschats.configuration";
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

  async readConfigurationState(): Promise<NexusChatsConfigurationState> {
    const storageArea = this.getStorageArea();

    if (!storageArea) {
      return { ...DEFAULT_CONFIGURATION_STATE };
    }

    return new Promise((resolve) => {
      storageArea.get([CONFIGURATION_STATE_KEY], (items) => {
        if (this.hasRuntimeError()) {
          resolve({ ...DEFAULT_CONFIGURATION_STATE });
          return;
        }

        resolve(this.normalizeConfigurationState(items));
      });
    });
  }

  async saveConfigurationState(configurationState: NexusChatsConfigurationState): Promise<void> {
    const storageArea = this.getStorageArea();

    if (!storageArea) {
      return;
    }

    await new Promise<void>((resolve) => {
      storageArea.set(
        {
          [CONFIGURATION_STATE_KEY]: this.sanitizeConfigurationState(configurationState)
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
      projectSelectedChatIds:
        storedState?.projectSelectedChatIds ?? DEFAULT_UI_STATE.projectSelectedChatIds,
      projectSelectionModeEnabled: Boolean(
        storedState?.projectSelectionModeEnabled ?? DEFAULT_UI_STATE.projectSelectionModeEnabled
      ),
      selectedChatIds: storedState?.selectedChatIds ?? DEFAULT_UI_STATE.selectedChatIds,
      selectionModeEnabled: Boolean(
        storedState?.selectionModeEnabled ?? legacySettings?.selectionModeEnabled
      )
    });
  }

  private sanitizeUIState(uiState: NexusChatsUIState): NexusChatsUIState {
    return {
      projectSelectedChatIds: this.sanitizeChatIds(uiState.projectSelectedChatIds),
      projectSelectionModeEnabled: Boolean(uiState.projectSelectionModeEnabled),
      selectedChatIds: this.sanitizeChatIds(uiState.selectedChatIds),
      selectionModeEnabled: Boolean(uiState.selectionModeEnabled)
    };
  }

  private sanitizeChatIds(chatIds: readonly string[]): string[] {
    return Array.from(
      new Set(chatIds.filter((chatId) => typeof chatId === "string" && chatId))
    ).sort();
  }

  private normalizeConfigurationState(
    items: Record<string, unknown>
  ): NexusChatsConfigurationState {
    const storedState = items[CONFIGURATION_STATE_KEY] as
      Partial<NexusChatsConfigurationState> | undefined;

    return this.sanitizeConfigurationState({
      tags: storedState?.tags ?? DEFAULT_CONFIGURATION_STATE.tags
    });
  }

  private sanitizeConfigurationState(
    configurationState: NexusChatsConfigurationState
  ): NexusChatsConfigurationState {
    const seenTagIds = new Set<string>();
    const rawTags = Array.isArray(configurationState.tags) ? configurationState.tags : [];
    const tags = rawTags
      .map((tag) => ({
        color: this.sanitizeColor(tag?.color ?? ""),
        id: this.sanitizeIdentifier(tag?.id ?? ""),
        name: this.sanitizeTagName(tag?.name ?? "")
      }))
      .filter((tag) => {
        if (!tag.id || !tag.name || seenTagIds.has(tag.id)) {
          return false;
        }

        seenTagIds.add(tag.id);
        return true;
      });

    return { tags };
  }

  private sanitizeColor(color: string): string {
    const normalizedColor = color.trim().toLowerCase();

    return COLOR_PATTERN.test(normalizedColor) ? normalizedColor : "#14b8a6";
  }

  private sanitizeIdentifier(value: string): string {
    return value
      .trim()
      .replace(/[^a-z0-9_-]/giu, "")
      .slice(0, 64);
  }

  private sanitizeTagName(value: string): string {
    return value.trim().replace(/\s+/gu, " ").slice(0, 40);
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
