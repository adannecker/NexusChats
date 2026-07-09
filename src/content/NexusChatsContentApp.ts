/**
 * Application orchestrator for the content script. It wires storage, chat
 * detection, selection state, UI rendering, sidebar mounting, and DOM
 * observation without mixing concerns.
 */
import { DOMObserver } from "./DOMObserver";
import { UIRenderer } from "./UIRenderer";
import { ChatDetector } from "../features/selection/ChatDetector";
import { SelectionManager } from "../features/selection/SelectionManager";
import { SidebarService } from "../features/sidebar/SidebarService";
import { StorageService } from "../storage/StorageService";
import "../styles/content.css";
import { isChatGptHost } from "../utils/url";

/**
 * Coordinates the extension lifecycle while keeping feature logic out of the
 * entry point.
 */
export class NexusChatsContentApp {
  private readonly chatDetector = new ChatDetector();
  private readonly selectionManager = new SelectionManager(new StorageService());
  private readonly sidebarService = new SidebarService(this.chatDetector);
  private readonly domObserver = new DOMObserver(() => this.render());
  private readonly uiRenderer = new UIRenderer(
    {
      onClearSelection: () => this.selectionManager.clearSelection(),
      onSelectAll: () => this.selectionManager.selectAll(this.visibleChatIds),
      onToggleChat: (chatId) => this.selectionManager.toggleChat(chatId),
      onToggleMode: () => this.selectionManager.toggleMode()
    },
    () => this.selectionManager.getSnapshot()
  );

  private unsubscribeFromSelection: (() => void) | null = null;
  private visibleChatIds: string[] = [];
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
    this.visibleChatIds = [];
    this.started = false;
  }

  private render(): void {
    const mountPoint = this.sidebarService.findMountPoint();

    if (!mountPoint) {
      this.visibleChatIds = [];
      this.uiRenderer.clearChatControls();
      return;
    }

    this.uiRenderer.mountPanel(mountPoint);

    const chats = this.chatDetector.detect(mountPoint.sidebar);
    this.visibleChatIds = Array.from(new Set(chats.map((chat) => chat.id)));
    this.uiRenderer.render(this.selectionManager.getSnapshot(), chats);
  }
}
