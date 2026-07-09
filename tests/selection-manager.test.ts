/**
 * Unit tests for selection-state behavior and local-only UI persistence.
 */
import { describe, expect, it } from "vitest";

import {
  SelectionManager,
  type SelectionStorage
} from "../src/features/selection/SelectionManager";
import type { NexusChatsUIState } from "../src/storage/StorageService";

class MemorySelectionStorage implements SelectionStorage {
  readonly savedStates: NexusChatsUIState[] = [];

  constructor(private uiState: NexusChatsUIState) {}

  async readUIState(): Promise<NexusChatsUIState> {
    return this.uiState;
  }

  async saveUIState(uiState: NexusChatsUIState): Promise<void> {
    this.uiState = uiState;
    this.savedStates.push(uiState);
  }
}

describe("SelectionManager", () => {
  it("selects, deselects, selects all, and clears chat IDs", async () => {
    const storage = new MemorySelectionStorage({
      selectedChatIds: [],
      selectionModeEnabled: false
    });
    const manager = new SelectionManager(storage);

    await manager.initialize();
    manager.setMode(true);
    manager.selectAll(["chat-2", "chat-1", "chat-1"]);
    manager.toggleChat("chat-2");
    manager.toggleChat("chat-3");

    expect(manager.getSnapshot().selectedChatIds).toEqual(new Set(["chat-1", "chat-3"]));

    manager.clearSelection();

    expect(manager.getSnapshot().selectedCount).toBe(0);
  });

  it("persists only selection UI state", async () => {
    const storage = new MemorySelectionStorage({
      selectedChatIds: [],
      selectionModeEnabled: false
    });
    const manager = new SelectionManager(storage);

    await manager.initialize();
    manager.setMode(true);
    manager.selectAll(["chat-2", "chat-1"]);

    expect(storage.savedStates.at(-1)).toEqual({
      selectedChatIds: ["chat-1", "chat-2"],
      selectionModeEnabled: true
    });
  });
});
