/**
 * Renders the NexusChats panel and selection controls. The renderer owns DOM
 * updates only; selection rules and persistence stay in SelectionManager.
 */
import type { DetectedChat } from "../features/selection/ChatDetector";
import type {
  ScopedSelectionSnapshot,
  SelectionScope,
  SelectionSnapshot
} from "../features/selection/SelectionManager";
import type { ProjectActionsMountPoint } from "../features/projects/ProjectActionsService";
import type { SidebarMountPoint } from "../features/sidebar/SidebarService";

export interface UIRendererCallbacks {
  readonly onClearSelection: (scope: SelectionScope) => void;
  readonly onOpenOptions: () => void;
  readonly onSelectAll: (scope: SelectionScope) => void;
  readonly onToggleChat: (scope: SelectionScope, chatId: string) => void;
  readonly onToggleMode: (scope: SelectionScope) => void;
}

export interface SelectionChatGroups {
  readonly project: readonly DetectedChat[];
  readonly sidebar: readonly DetectedChat[];
}

const PANEL_ID = "nexuschats-sidebar-panel";
const PROJECT_ACTIONS_ID = "nexuschats-project-actions";
const CHAT_CONTROL_SELECTOR = "[data-nexuschats-chat-control]";
const CHAT_ROW_SELECTOR = "[data-nexuschats-chat-id]";

/**
 * Applies idempotent DOM updates for the sidebar panel, chat checkboxes, and
 * selected-row highlighting.
 */
export class UIRenderer {
  private panel: HTMLElement | null = null;
  private projectActions: HTMLElement | null = null;
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
    this.projectActions?.remove();
    this.panel = null;
    this.projectActions = null;
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

  mountProjectActions(mountPoint: ProjectActionsMountPoint): void {
    const projectActions = this.getProjectActionsElement();

    if (
      projectActions.parentElement === mountPoint.parent &&
      projectActions.previousSibling === mountPoint.after
    ) {
      return;
    }

    mountPoint.parent.insertBefore(projectActions, mountPoint.after.nextSibling);
  }

  clearProjectActions(): void {
    this.projectActions?.remove();
  }

  render(selection: SelectionSnapshot, chats: SelectionChatGroups): void {
    this.renderActionSurfaces(selection, chats);
    this.renderChatControls(selection, chats);
  }

  clearChatControls(scope?: SelectionScope): void {
    const controlSelector = scope ? this.getChatControlSelector(scope) : CHAT_CONTROL_SELECTOR;
    const rowSelector = scope ? this.getChatRowSelector(scope) : CHAT_ROW_SELECTOR;

    document.querySelectorAll<HTMLElement>(controlSelector).forEach((control) => control.remove());
    document
      .querySelectorAll<HTMLElement>(rowSelector)
      .forEach((anchor) => this.resetChatAnchor(anchor, scope));
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

    const settingsButton = this.createSettingsButton();
    settingsButton.addEventListener("click", this.callbacks.onOpenOptions);

    header.append(title, settingsButton);
    panel.append(header, this.createSelectionControls("sidebar"));

    this.panel = panel;
    return panel;
  }

  private getProjectActionsElement(): HTMLElement {
    if (this.projectActions) {
      return this.projectActions;
    }

    const projectActions = document.createElement("div");
    projectActions.id = PROJECT_ACTIONS_ID;
    projectActions.className = "nexuschats-project-actions";
    projectActions.setAttribute("aria-label", "NexusChats Projektaktionen");
    projectActions.setAttribute("role", "group");
    projectActions.append(this.createSelectionControls("project"));

    this.projectActions = projectActions;
    return projectActions;
  }

  private createSelectionControls(scope: SelectionScope): HTMLElement {
    const controls = document.createElement("div");
    controls.className = "nexuschats-panel__selection-controls";
    controls.dataset.nexuschatsSelectionScope = scope;

    const modeLabel = document.createElement("span");
    modeLabel.className = "nexuschats-panel__mode-label";
    modeLabel.textContent = "Auswahlmodus";

    const toggleButton = this.createSwitch("Auswahlmodus", "toggle-selection-mode");
    toggleButton.addEventListener("click", () => this.callbacks.onToggleMode(scope));

    const meta = document.createElement("span");
    meta.className = "nexuschats-panel__meta";
    meta.dataset.nexuschatsSelectedCount = "true";
    meta.textContent = "0 ausgewählt";

    const actions = document.createElement("div");
    actions.className = "nexuschats-panel__actions";

    const selectAllButton = this.createIconButton("Alle auswählen", "select-all", "select-all");
    selectAllButton.addEventListener("click", () => this.callbacks.onSelectAll(scope));

    const clearButton = this.createIconButton(
      "Auswahl aufheben",
      "clear-selection",
      "clear-selection"
    );
    clearButton.addEventListener("click", () => this.callbacks.onClearSelection(scope));

    actions.append(selectAllButton, clearButton);
    controls.append(modeLabel, toggleButton, meta, actions);
    return controls;
  }

  private createSwitch(label: string, action: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nexuschats-panel__switch";
    button.dataset.nexuschatsAction = action;
    button.setAttribute("aria-checked", "false");
    button.setAttribute("aria-label", label);
    button.setAttribute("role", "switch");
    button.title = label;

    const knob = document.createElement("span");
    knob.className = "nexuschats-panel__switch-knob";
    knob.setAttribute("aria-hidden", "true");
    button.append(knob);

    return button;
  }

  private createIconButton(label: string, action: string, icon: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nexuschats-panel__icon-button";
    button.dataset.nexuschatsAction = action;
    button.setAttribute("aria-label", label);
    button.title = label;

    const iconElement = document.createElement("span");
    iconElement.className = `nexuschats-panel__icon nexuschats-panel__icon--${icon}`;
    iconElement.setAttribute("aria-hidden", "true");
    button.append(iconElement);

    return button;
  }

  private createSettingsButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "nexuschats-panel__settings-button";
    button.setAttribute("aria-label", "NexusChats Einstellungen öffnen");
    button.title = "Einstellungen";

    const iconElement = document.createElement("span");
    iconElement.className = "nexuschats-panel__icon nexuschats-panel__icon--settings";
    iconElement.setAttribute("aria-hidden", "true");
    button.append(iconElement);

    return button;
  }

  private renderActionSurfaces(selection: SelectionSnapshot, chats: SelectionChatGroups): void {
    this.renderActionSurface(this.panel, selection.scopes.sidebar, chats.sidebar);
    this.renderActionSurface(this.projectActions, selection.scopes.project, chats.project);
  }

  private renderActionSurface(
    surface: HTMLElement | null,
    selection: ScopedSelectionSnapshot,
    chats: readonly DetectedChat[]
  ): void {
    if (!surface) {
      return;
    }

    const selectedChatIds = selection.selectedChatIds;
    const visibleChatIds = this.getUniqueChatIds(chats);
    const visibleSelectedCount = visibleChatIds.filter((chatId) =>
      selectedChatIds.has(chatId)
    ).length;
    const allVisibleSelected =
      visibleChatIds.length > 0 && visibleSelectedCount === visibleChatIds.length;

    this.setDatasetValue(
      surface,
      "selectionMode",
      selection.selectionModeEnabled ? "active" : "inactive"
    );
    this.setText(
      surface.querySelector<HTMLElement>("[data-nexuschats-selected-count]"),
      `${selection.selectedCount} ausgewählt`
    );

    const toggleButton = surface.querySelector<HTMLButtonElement>(
      "[data-nexuschats-action='toggle-selection-mode']"
    );
    this.setAttribute(toggleButton, "aria-checked", String(selection.selectionModeEnabled));
    this.setDatasetValue(
      toggleButton,
      "state",
      selection.selectionModeEnabled ? "active" : "inactive"
    );

    const selectAllButton = surface.querySelector<HTMLButtonElement>(
      "[data-nexuschats-action='select-all']"
    );
    const clearButton = surface.querySelector<HTMLButtonElement>(
      "[data-nexuschats-action='clear-selection']"
    );

    this.setDisabled(
      selectAllButton,
      !selection.selectionModeEnabled || visibleChatIds.length === 0 || allVisibleSelected
    );
    this.setDisabled(clearButton, !selection.selectionModeEnabled || selection.selectedCount === 0);
  }

  private renderChatControls(selection: SelectionSnapshot, chats: SelectionChatGroups): void {
    this.renderScopedChatControls("sidebar", selection.scopes.sidebar, chats.sidebar);
    this.renderScopedChatControls("project", selection.scopes.project, chats.project);
  }

  private renderScopedChatControls(
    scope: SelectionScope,
    selection: ScopedSelectionSnapshot,
    chats: readonly DetectedChat[]
  ): void {
    if (!selection.selectionModeEnabled) {
      this.clearChatControls(scope);
      return;
    }

    const activeControlHosts = new Set(chats.map((chat) => chat.controlHost));
    this.clearStaleChatControls(scope, activeControlHosts);

    chats.forEach((chat) => {
      const isSelected = selection.selectedChatIds.has(chat.id);
      this.renderChatControl(scope, chat, isSelected);
    });
  }

  private renderChatControl(scope: SelectionScope, chat: DetectedChat, isSelected: boolean): void {
    const { controlHost } = chat;
    const control = this.getOrCreateChatControl(scope, controlHost);

    this.setDatasetValue(controlHost, "nexuschatsChatId", chat.id);
    this.setDatasetValue(controlHost, "nexuschatsSelectionScope", scope);
    this.setAttribute(controlHost, "aria-selected", String(isSelected));
    this.toggleClass(controlHost, "nexuschats-chat--selection-active", true);
    this.toggleClass(controlHost, "nexuschats-chat--selected", isSelected);
    this.setAttribute(control, "aria-checked", String(isSelected));
    this.setDatasetValue(control, "state", isSelected ? "selected" : "unselected");
  }

  private getOrCreateChatControl(scope: SelectionScope, controlHost: HTMLElement): HTMLElement {
    const existingControl = Array.from(controlHost.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.dataset.nexuschatsChatControl === "true" &&
        child.dataset.nexuschatsSelectionScope === scope
    );

    if (existingControl) {
      return existingControl;
    }

    const control = document.createElement("span");
    control.className = "nexuschats-chat-checkbox";
    control.dataset.nexuschatsChatControl = "true";
    control.dataset.nexuschatsSelectionScope = scope;
    control.setAttribute("aria-label", "Chat auswählen");
    control.setAttribute("role", "checkbox");

    controlHost.prepend(control);
    return control;
  }

  private clearStaleChatControls(
    scope: SelectionScope,
    activeControlHosts: ReadonlySet<HTMLElement>
  ): void {
    document
      .querySelectorAll<HTMLElement>(this.getChatControlSelector(scope))
      .forEach((control) => {
        const controlHost = control.closest<HTMLElement>(CHAT_ROW_SELECTOR);

        if (!controlHost || !activeControlHosts.has(controlHost)) {
          control.remove();
        }
      });

    document
      .querySelectorAll<HTMLElement>(this.getChatRowSelector(scope))
      .forEach((controlHost) => {
        if (!activeControlHosts.has(controlHost)) {
          this.resetChatAnchor(controlHost, scope);
        }
      });
  }

  private resetChatAnchor(anchor: HTMLElement, scope?: SelectionScope): void {
    const controlSelector = scope ? this.getChatControlSelector(scope) : CHAT_CONTROL_SELECTOR;

    anchor.querySelectorAll<HTMLElement>(controlSelector).forEach((control) => control.remove());

    if (anchor.querySelector(CHAT_CONTROL_SELECTOR)) {
      return;
    }

    anchor.classList.remove("nexuschats-chat--selection-active", "nexuschats-chat--selected");
    anchor.removeAttribute("aria-selected");
    delete anchor.dataset.nexuschatsChatId;
    delete anchor.dataset.nexuschatsSelectionScope;
  }

  private getUniqueChatIds(chats: readonly DetectedChat[]): string[] {
    return Array.from(new Set(chats.map((chat) => chat.id)));
  }

  private handleDocumentClick = (event: MouseEvent): void => {
    const anchor = this.getEventChatAnchor(event);
    const scope = this.getAnchorSelectionScope(anchor);

    if (!anchor?.dataset.nexuschatsChatId || !scope) {
      return;
    }

    const snapshot = this.getSelectionSnapshot().scopes[scope];

    if (!snapshot.selectionModeEnabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.callbacks.onToggleChat(scope, anchor.dataset.nexuschatsChatId);
  };

  private handleDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const anchor = this.getEventChatAnchor(event);
    const scope = this.getAnchorSelectionScope(anchor);

    if (!anchor?.dataset.nexuschatsChatId || !scope) {
      return;
    }

    const snapshot = this.getSelectionSnapshot().scopes[scope];

    if (!snapshot.selectionModeEnabled) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.callbacks.onToggleChat(scope, anchor.dataset.nexuschatsChatId);
  };

  private getAnchorSelectionScope(anchor: HTMLElement | null): SelectionScope | null {
    const scope = anchor?.dataset.nexuschatsSelectionScope;

    return scope === "project" || scope === "sidebar" ? scope : null;
  }

  private getChatControlSelector(scope: SelectionScope): string {
    return `${CHAT_CONTROL_SELECTOR}[data-nexuschats-selection-scope="${scope}"]`;
  }

  private getChatRowSelector(scope: SelectionScope): string {
    return `${CHAT_ROW_SELECTOR}[data-nexuschats-selection-scope="${scope}"]`;
  }

  private getEventChatAnchor(event: Event): HTMLElement | null {
    return event.target instanceof Element
      ? event.target.closest<HTMLElement>(CHAT_ROW_SELECTOR)
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
