/**
 * Detects ChatGPT conversation links without depending on volatile host-page CSS
 * classes. The detector reads DOM structure but never stores chat text.
 */
import { isVisibleElement, normalizeText, queryAll } from "../../utils/dom";
import { getConversationIdFromHref } from "../../utils/url";

export interface DetectedChat {
  readonly anchor: HTMLAnchorElement;
  readonly controlHost: HTMLElement;
  readonly id: string;
}

const CHAT_LINK_SELECTOR = "a[href]";
const NEXUSCHATS_SELECTOR =
  "#nexuschats-sidebar-panel, #nexuschats-project-actions, [data-nexuschats-chat-control]";
const MESSAGE_AREA_SELECTOR = "main article, [data-message-author-role]";

/**
 * Finds visible sidebar chat links and extracts only stable local identifiers
 * needed for UI state.
 */
export class ChatDetector {
  detect(root: ParentNode): DetectedChat[] {
    return queryAll<HTMLAnchorElement>(root, CHAT_LINK_SELECTOR)
      .map((anchor) => this.toDetectedSidebarChat(anchor))
      .filter((chat): chat is DetectedChat => Boolean(chat));
  }

  detectProjectChats(root: ParentNode): DetectedChat[] {
    return queryAll<HTMLAnchorElement>(root, CHAT_LINK_SELECTOR)
      .map((anchor) => this.toDetectedProjectChat(anchor))
      .filter((chat): chat is DetectedChat => Boolean(chat));
  }

  private toDetectedSidebarChat(anchor: HTMLAnchorElement): DetectedChat | null {
    const id = this.getBaseConversationId(anchor);

    if (!id || !this.isLikelySidebarLink(anchor)) {
      return null;
    }

    return {
      anchor,
      controlHost: anchor,
      id
    };
  }

  private toDetectedProjectChat(anchor: HTMLAnchorElement): DetectedChat | null {
    const id = this.getBaseConversationId(anchor, false);
    const controlHost = this.findProjectChatControlHost(anchor);

    if (!id || !controlHost) {
      return null;
    }

    return {
      anchor,
      controlHost,
      id
    };
  }

  private getBaseConversationId(
    anchor: HTMLAnchorElement,
    requireVisibleAnchor = true
  ): string | null {
    const id = getConversationIdFromHref(anchor.getAttribute("href") ?? "", window.location.origin);

    if (
      !id ||
      anchor.closest(NEXUSCHATS_SELECTOR) ||
      anchor.closest(MESSAGE_AREA_SELECTOR) ||
      (requireVisibleAnchor && !isVisibleElement(anchor))
    ) {
      return null;
    }

    return id;
  }

  private isLikelySidebarLink(anchor: HTMLAnchorElement): boolean {
    const rect = anchor.getBoundingClientRect();
    const text = normalizeText(anchor.textContent);
    const leftBoundary = Math.min(520, window.innerWidth * 0.55);

    return (
      rect.left <= leftBoundary &&
      rect.width >= 72 &&
      rect.height >= 20 &&
      rect.height <= 112 &&
      text.length > 0
    );
  }

  private findProjectChatControlHost(anchor: HTMLAnchorElement): HTMLElement | null {
    const projectRoot = anchor.closest<HTMLElement>("main");

    if (!projectRoot) {
      return null;
    }

    let current: HTMLElement | null = anchor;

    for (let depth = 0; current && current !== projectRoot && depth < 6; depth += 1) {
      if (this.isLikelyProjectChatControlHost(current)) {
        return current;
      }

      current = current.parentElement;
    }

    return this.isLikelyProjectChatControlHost(anchor) ? anchor : null;
  }

  private isLikelyProjectChatControlHost(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const text = normalizeText(element.textContent);

    return (
      !element.closest(NEXUSCHATS_SELECTOR) &&
      !element.closest(MESSAGE_AREA_SELECTOR) &&
      isVisibleElement(element) &&
      rect.width >= 96 &&
      rect.height >= 20 &&
      rect.height <= 220 &&
      text.length > 0
    );
  }
}
