/**
 * Coalesces host-page DOM changes into a single render pass and ignores
 * mutations that NexusChats caused itself.
 */
import { FrameScheduler } from "../utils/scheduler";

const NEXUSCHATS_SELECTOR = "#nexuschats-sidebar-panel, [data-nexuschats-chat-control]";

/**
 * Thin MutationObserver wrapper for dynamic ChatGPT pages.
 */
export class DOMObserver {
  private readonly scheduler: FrameScheduler;
  private observer: MutationObserver | null = null;

  constructor(render: () => void) {
    this.scheduler = new FrameScheduler(render);
  }

  start(root: Node = document.documentElement): void {
    if (this.observer) {
      return;
    }

    this.observer = new MutationObserver((mutations) => {
      if (mutations.every((mutation) => this.isInternalMutation(mutation))) {
        return;
      }

      this.scheduler.schedule();
    });

    this.observer.observe(root, {
      childList: true,
      subtree: true
    });
  }

  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.scheduler.cancel();
  }

  private isInternalMutation(mutation: MutationRecord): boolean {
    const changedNodes = [...Array.from(mutation.addedNodes), ...Array.from(mutation.removedNodes)];

    if (changedNodes.length > 0) {
      return changedNodes.every((node) => this.isNexusChatsNode(node));
    }

    return (
      mutation.target instanceof Element && Boolean(mutation.target.closest(NEXUSCHATS_SELECTOR))
    );
  }

  private isNexusChatsNode(node: Node): boolean {
    return (
      node instanceof Element &&
      (node.matches(NEXUSCHATS_SELECTOR) || Boolean(node.closest(NEXUSCHATS_SELECTOR)))
    );
  }
}
