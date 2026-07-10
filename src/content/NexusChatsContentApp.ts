/**
 * Application orchestrator for the content script. It wires storage, chat
 * detection, selection state, UI rendering, sidebar mounting, and DOM
 * observation without mixing concerns.
 */
import { DOMObserver } from "./DOMObserver";
import { UIRenderer } from "./UIRenderer";
import { ProjectActionsService } from "../features/projects/ProjectActionsService";
import { ChatDetector } from "../features/selection/ChatDetector";
import type { DetectedChat } from "../features/selection/ChatDetector";
import { SelectionManager } from "../features/selection/SelectionManager";
import type { SelectionScope } from "../features/selection/SelectionManager";
import { SidebarService } from "../features/sidebar/SidebarService";
import { StorageService } from "../storage/StorageService";
import "../styles/content.css";
import { isChatGptHost } from "../utils/url";

const OPEN_OPTIONS_MESSAGE_TYPE = "nexuschats:open-options";

/**
 * Coordinates the extension lifecycle while keeping feature logic out of the
 * entry point.
 */
export class NexusChatsContentApp {
  private readonly chatDetector = new ChatDetector();
  private readonly selectionManager = new SelectionManager(new StorageService());
  private readonly sidebarService = new SidebarService(this.chatDetector);
  private readonly projectActionsService = new ProjectActionsService();
  private readonly domObserver = new DOMObserver(() => this.render());
  private readonly uiRenderer = new UIRenderer(
    {
      onClearSelection: (scope) => this.selectionManager.clearSelection(scope),
      onOpenOptions: () => this.openOptionsPage(),
      onSelectAll: (scope) =>
        this.selectionManager.selectAll(this.visibleChatIdsByScope[scope], scope),
      onToggleChat: (scope, chatId) => this.selectionManager.toggleChat(chatId, scope),
      onToggleMode: (scope) => this.selectionManager.toggleMode(scope)
    },
    () => this.selectionManager.getSnapshot()
  );

  private unsubscribeFromSelection: (() => void) | null = null;
  private visibleChatIdsByScope: Record<SelectionScope, string[]> = {
    project: [],
    sidebar: []
  };
  private started = false;

  async start(): Promise<void> {
    if (this.started || !isChatGptHost(window.location.hostname)) {
      return;
    }

    this.started = true;
    await this.selectionManager.initialize();
    this.uiRenderer.start();
    this.unsubscribeFromSelection = this.selectionManager.subscribe(() => this.render());
    this.render();
    this.domObserver.start();
  }

  stop(): void {
    this.domObserver.stop();
    this.unsubscribeFromSelection?.();
    this.unsubscribeFromSelection = null;
    this.uiRenderer.destroy();
    this.visibleChatIdsByScope = {
      project: [],
      sidebar: []
    };
    this.started = false;
  }

  private render(): void {
    const mountPoint = this.sidebarService.findMountPoint();
    const projectActionsMountPoint = this.projectActionsService.findMountPoint();
    let projectChats: DetectedChat[] = [];
    let sidebarChats: DetectedChat[] = [];

    if (mountPoint) {
      this.uiRenderer.mountPanel(mountPoint);
      sidebarChats = this.chatDetector.detect(mountPoint.sidebar);
    } else {
      this.uiRenderer.clearChatControls("sidebar");
    }

    if (projectActionsMountPoint) {
      this.uiRenderer.mountProjectActions(projectActionsMountPoint);
      projectChats = this.chatDetector.detectProjectChats(projectActionsMountPoint.projectRoot);
    } else {
      this.uiRenderer.clearProjectActions();
      this.uiRenderer.clearChatControls("project");
    }

    this.visibleChatIdsByScope = {
      project: this.getUniqueChatIds(projectChats),
      sidebar: this.getUniqueChatIds(sidebarChats)
    };
    this.uiRenderer.render(this.selectionManager.getSnapshot(), {
      project: projectChats,
      sidebar: sidebarChats
    });
  }

  private getUniqueChatIds(chats: readonly DetectedChat[]): string[] {
    return Array.from(new Set(chats.map((chat) => chat.id)));
  }

  private openOptionsPage(): void {
    if (typeof chrome === "undefined" || !chrome.runtime) {
      return;
    }

    chrome.runtime.sendMessage({ type: OPEN_OPTIONS_MESSAGE_TYPE }, () => {
      if (chrome.runtime.lastError) {
        return;
      }
    });
  }
}
