/**
 * Sidebar discovery service. It avoids volatile ChatGPT class names and instead
 * uses semantic containers, conversation links, visibility, and page position.
 */
import { asHTMLElement, isVisibleElement, normalizeText, queryAll } from "../../utils/dom";
import { getConversationIdFromHref } from "../../utils/url";
import type { ChatDetector } from "../selection/ChatDetector";

export interface SidebarMountPoint {
  readonly before: Element | null;
  readonly parent: HTMLElement;
  readonly sidebar: HTMLElement;
}

const NAVIGATION_SELECTOR = "aside, nav, [role='navigation']";
const PANEL_SELECTOR = "#nexuschats-sidebar-panel";

/**
 * Finds the ChatGPT sidebar and the safest insertion point above the chat list.
 */
export class SidebarService {
  constructor(private readonly chatDetector: ChatDetector) {}

  findMountPoint(): SidebarMountPoint | null {
    const sidebar = this.findSidebar();

    if (!sidebar) {
      return null;
    }

    const chatListStart = this.findChatListStart(sidebar);

    if (chatListStart?.parentElement) {
      return {
        before: chatListStart,
        parent: chatListStart.parentElement,
        sidebar
      };
    }

    return {
      before: sidebar.firstElementChild,
      parent: sidebar,
      sidebar
    };
  }

  private findSidebar(): HTMLElement | null {
    const semanticSidebar = queryAll<HTMLElement>(document, NAVIGATION_SELECTOR).find((candidate) =>
      this.isSidebarCandidate(candidate)
    );

    if (semanticSidebar) {
      return semanticSidebar;
    }

    const firstChatLink = this.chatDetector.detect(document)[0]?.anchor;

    return firstChatLink ? this.findNavigationAncestor(firstChatLink) : null;
  }

  private isSidebarCandidate(candidate: HTMLElement): boolean {
    return (
      !candidate.closest(PANEL_SELECTOR) &&
      isVisibleElement(candidate) &&
      this.isLeftSideRegion(candidate) &&
      this.chatDetector.detect(candidate).length > 0
    );
  }

  private findChatListStart(sidebar: HTMLElement): HTMLElement | null {
    const firstChatLink = this.chatDetector.detect(sidebar)[0]?.anchor;

    if (!firstChatLink) {
      return null;
    }

    let block: HTMLElement = firstChatLink;

    for (let depth = 0; depth < 6; depth += 1) {
      const parent = block.parentElement;

      if (!parent || parent === sidebar || parent === document.body) {
        break;
      }

      const parentLinkCount = this.countChatLinks(parent);
      const blockLinkCount = this.countChatLinks(block);

      if (parentLinkCount > blockLinkCount) {
        return block;
      }

      block = parent;
    }

    return block;
  }

  private findNavigationAncestor(element: HTMLElement): HTMLElement | null {
    const semanticAncestor = asHTMLElement(element.closest(NAVIGATION_SELECTOR));

    if (semanticAncestor && this.isLeftSideRegion(semanticAncestor)) {
      return semanticAncestor;
    }

    let current: HTMLElement | null = element;
    let best: HTMLElement | null = null;

    while (current && current !== document.body) {
      if (this.isLeftSideRegion(current)) {
        best = current;
      }

      current = current.parentElement;
    }

    return best;
  }

  private countChatLinks(element: HTMLElement): number {
    const includesSelf =
      element instanceof HTMLAnchorElement &&
      Boolean(
        getConversationIdFromHref(element.getAttribute("href") ?? "", window.location.origin)
      );

    return this.chatDetector.detect(element).length + (includesSelf ? 1 : 0);
  }

  private isLeftSideRegion(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const text = normalizeText(element.textContent);
    const leftBoundary = Math.min(520, window.innerWidth * 0.55);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.left <= leftBoundary &&
      text.length > 0 &&
      rect.width <= Math.max(420, window.innerWidth * 0.72)
    );
  }
}
