/**
 * Renders the NexusChats panel and selection controls. The renderer owns DOM
 * updates only; selection rules and persistence stay in SelectionManager.
 */
import type { DetectedChat } from "../features/selection/ChatDetector";
import type { SelectionSnapshot } from "../features/selection/SelectionManager";
import type { SidebarMountPoint } from "../features/sidebar/SidebarService";

export interface UIRendererCallbacks {
  readonly onClearSelection: () => void;
  readonly onSelectAll: () => void;
  readonly onToggleChat: (chatId: string) => void;
  readonly onToggleMode: () => void;
}

const PANEL_ID = "nexuschats-sidebar-panel";
const CHAT_CONTROL_SELECTOR = "[data-nexuschats-chat-control]";
const CHAT_ROW_SELECTOR = "a[data-nexuschats-chat-id]";

/**
 * Applies idempotent DOM updates for the sidebar panel, chat checkboxes, and
 * selected-row highlighting.
 */
export class UIRenderer {
  private panel: HTMLElement | null = null;
  private started = false;

  constructor(
    private readonly callbacks: UIRendererCallbacks,
    private readonly getSelectionSnapshot: () => SelectionSnapshot
  ) {}

  start(): void {
    if (this.started) {
      return;
    }

    document.addEventListener("click", this.handleDocumentClick, true);
    document.addEventListener("keydown", this.handleDocumentKeydown, true);
    this.started = true;
  }

  destroy(): void {
    document.removeEventListener("click", this.handleDocumentClick, true);
    document.removeEventListener("keydown", this.handleDocumentKeydown, true);
    this.clearChatControls();
    this.panel?.remove();
    this.panel = null;
    this.started = false;
  }

  mountPanel(mountPoint: SidebarMountPoint): void {
    const panel = this.getPanelElement();

    if (
      panel.parentElement === mountPoint.parent &&
      panel.nextElementSibling === mountPoint.before
    ) {
      return;
    }

    mountPoint.parent.insertBefore(panel, mountPoint.before);
  }

  render(selection: SelectionSnapshot, chats: readonly DetectedChat[]): void {
    this.renderPanel(selection, chats);
    this.renderChatControls(selection, chats);
  }

  clearChatControls(): void {
    document
      .querySelectorAll<HTMLElement>(CHAT_CONTROL_SELECTOR)
      .forEach((control) => control.remove());
    document
      .querySelectorAll<HTMLAnchorElement>(CHAT_ROW_SELECTOR)
      .forEach((anchor) => this.resetChatAnchor(anchor));
  }

  private getPanelElement(): HTMLElement {
    if (this.panel) {
      return this.panel;
    }

    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.className = "nexuschats-panel";
    panel.setAttribute("aria-label", "NexusChats");

    const header = document.createElement("div");
    header.className = "nexuschats-panel__header";

    const title = document.createElement("h2");
    title.className = "nexuschats-panel__title";
    title.textContent = "NexusChats";

    const toggleButton = this.createButton("Auswahlmodus", "toggle-selection-mode");
    toggleButton.setAttribute("aria-pressed", "false");
    toggleButton.addEventListener("click", this.callbacks.onToggleMode);

    const meta = document.createElement("div");
    meta.className = "nexuschats-panel__meta";
    meta.dataset.nexuschatsSelectedCount = "true";
    meta.textContent = "0 ausgewählt";

    const actions = document.createElement("div");
    actions.className = "nexuschats-panel__actions";

    const selectAllButton = this.createButton("Alle auswählen", "select-all");
    selectAllButton.addEventListener("click", this.callbacks.onSelectAll);

    const clearButton = this.createButton("Auswahl aufheben", "clear-selection");
    clearButton.addEventListener("click", this.callbacks.onClearSelection);

    header.append(title, toggleButton);
    actions.append(selectAllButton, clearButton);
    panel.append(header, meta, actions);

    this.panel = panel;
    return panel;
  }

  private createButton(label: string, action: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nexuschats-panel__button";
    button.dataset.nexuschatsAction = action;
    button.textContent = label;

    return button;
  }

  private renderPanel(selection: SelectionSnapshot, chats: readonly DetectedChat[]): void {
    const panel = this.getPanelElement();
    const selectedChatIds = selection.selectedChatIds;
    const visibleChatIds = this.getUniqueChatIds(chats);
    const visibleSelectedCount = visibleChatIds.filter((chatId) =>
      selectedChatIds.has(chatId)
    ).length;
    const allVisibleSelected =
      visibleChatIds.length > 0 && visibleSelectedCount === visibleChatIds.length;

    this.setDatasetValue(
      panel,
      "selectionMode",
      selection.selectionModeEnabled ? "active" : "inactive"
    );
    this.setText(
      panel.querySelector<HTMLElement>("[data-nexuschats-selected-count]"),
      `${selection.selectedCount} ausgewählt`
    );

    const toggleButton = panel.querySelector<HTMLButtonElement>(
      "[data-nexuschats-action='toggle-selection-mode']"
    );
    this.setAttribute(toggleButton, "aria-pressed", String(selection.selectionModeEnabled));
    this.setDatasetValue(
      toggleButton,
      "state",
      selection.selectionModeEnabled ? "active" : "inactive"
    );

    const selectAllButton = panel.querySelector<HTMLButtonElement>(
      "[data-nexuschats-action='select-all']"
    );
    const clearButton = panel.querySelector<HTMLButtonElement>(
      "[data-nexuschats-action='clear-selection']"
    );

    this.setDisabled(
      selectAllButton,
      !selection.selectionModeEnabled || visibleChatIds.length === 0 || allVisibleSelected
    );
    this.setDisabled(clearButton, !selection.selectionModeEnabled || selection.selectedCount === 0);
  }

  private renderChatControls(selection: SelectionSnapshot, chats: readonly DetectedChat[]): void {
    if (!selection.selectionModeEnabled) {
      this.clearChatControls();
      return;
    }

    const activeAnchors = new Set(chats.map((chat) => chat.anchor));
    this.clearStaleChatControls(activeAnchors);

    chats.forEach((chat) => {
      const isSelected = selection.selectedChatIds.has(chat.id);
      this.renderChatControl(chat, isSelected);
    });
  }

  private renderChatControl(chat: DetectedChat, isSelected: boolean): void {
    const { anchor } = chat;
    const control = this.getOrCreateChatControl(anchor);

    this.setDatasetValue(anchor, "nexuschatsChatId", chat.id);
    this.setAttribute(anchor, "aria-selected", String(isSelected));
    this.toggleClass(anchor, "nexuschats-chat--selection-active", true);
    this.toggleClass(anchor, "nexuschats-chat--selected", isSelected);
    this.setAttribute(control, "aria-checked", String(isSelected));
    this.setDatasetValue(control, "state", isSelected ? "selected" : "unselected");
  }

  private getOrCreateChatControl(anchor: HTMLAnchorElement): HTMLElement {
    const existingControl = Array.from(anchor.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.dataset.nexuschatsChatControl === "true"
    );

    if (existingControl) {
      return existingControl;
    }

    const control = document.createElement("span");
    control.className = "nexuschats-chat-checkbox";
    control.dataset.nexuschatsChatControl = "true";
    control.setAttribute("aria-label", "Chat auswählen");
    control.setAttribute("role", "checkbox");

    anchor.prepend(control);
    return control;
  }

  private clearStaleChatControls(activeAnchors: ReadonlySet<HTMLAnchorElement>): void {
    document.querySelectorAll<HTMLElement>(CHAT_CONTROL_SELECTOR).forEach((control) => {
      const anchor = control.closest<HTMLAnchorElement>("a");

      if (!anchor || !activeAnchors.has(anchor)) {
        control.remove();
      }
    });

    document.querySelectorAll<HTMLAnchorElement>(CHAT_ROW_SELECTOR).forEach((anchor) => {
      if (!activeAnchors.has(anchor)) {
        this.resetChatAnchor(anchor);
      }
    });
  }

  private resetChatAnchor(anchor: HTMLAnchorElement): void {
    anchor.querySelector<HTMLElement>(CHAT_CONTROL_SELECTOR)?.remove();
    anchor.classList.remove("nexuschats-chat--selection-active", "nexuschats-chat--selected");
    anchor.removeAttribute("aria-selected");
    delete anchor.dataset.nexuschatsChatId;
  }

  private getUniqueChatIds(chats: readonly DetectedChat[]): string[] {
    return Array.from(new Set(chats.map((chat) => chat.id)));
  }

  private handleDocumentClick = (event: MouseEvent): void => {
    const snapshot = this.getSelectionSnapshot();

    if (!snapshot.selectionModeEnabled) {
      return;
    }

    const anchor = this.getEventChatAnchor(event);

    if (!anchor?.dataset.nexuschatsChatId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.callbacks.onToggleChat(anchor.dataset.nexuschatsChatId);
  };

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    const snapshot = this.getSelectionSnapshot();

    if (!snapshot.selectionModeEnabled || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    const anchor = this.getEventChatAnchor(event);

    if (!anchor?.dataset.nexuschatsChatId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.callbacks.onToggleChat(anchor.dataset.nexuschatsChatId);
  };

  private getEventChatAnchor(event: Event): HTMLAnchorElement | null {
    return event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>(CHAT_ROW_SELECTOR)
      : null;
  }

  private setText(element: HTMLElement | null, value: string): void {
    if (element && element.textContent !== value) {
      element.textContent = value;
    }
  }

  private setAttribute(element: Element | null, name: string, value: string): void {
    if (element && element.getAttribute(name) !== value) {
      element.setAttribute(name, value);
    }
  }

  private setDatasetValue(element: HTMLElement | null, key: string, value: string): void {
    if (element && element.dataset[key] !== value) {
      element.dataset[key] = value;
    }
  }

  private setDisabled(button: HTMLButtonElement | null, isDisabled: boolean): void {
    if (button && button.disabled !== isDisabled) {
      button.disabled = isDisabled;
    }
  }

  private toggleClass(element: Element, className: string, shouldHaveClass: boolean): void {
    if (element.classList.contains(className) !== shouldHaveClass) {
      element.classList.toggle(className, shouldHaveClass);
    }
  }
}
