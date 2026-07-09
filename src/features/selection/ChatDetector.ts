/**
 * Detects ChatGPT conversation links without depending on volatile host-page CSS
 * classes. The detector reads DOM structure but never stores chat text.
 */
import { isVisibleElement, normalizeText, queryAll } from "../../utils/dom";
import { getConversationIdFromHref } from "../../utils/url";

export interface DetectedChat {
  readonly anchor: HTMLAnchorElement;
  readonly id: string;
}

const CHAT_LINK_SELECTOR = "a[href]";
const NEXUSCHATS_SELECTOR = "#nexuschats-sidebar-panel, [data-nexuschats-chat-control]";
const MESSAGE_AREA_SELECTOR = "main article, [data-message-author-role]";

/**
 * Finds visible sidebar chat links and extracts only stable local identifiers
 * needed for UI state.
 */
export class ChatDetector {
  detect(root: ParentNode): DetectedChat[] {
    return queryAll<HTMLAnchorElement>(root, CHAT_LINK_SELECTOR)
      .map((anchor) => this.toDetectedChat(anchor))
      .filter((chat): chat is DetectedChat => Boolean(chat));
  }

  private toDetectedChat(anchor: HTMLAnchorElement): DetectedChat | null {
    const id = getConversationIdFromHref(anchor.getAttribute("href") ?? "", window.location.origin);

    if (
      !id ||
      anchor.closest(NEXUSCHATS_SELECTOR) ||
      anchor.closest(MESSAGE_AREA_SELECTOR) ||
      !isVisibleElement(anchor) ||
      !this.isLikelySidebarLink(anchor)
    ) {
      return null;
    }

    return {
      anchor,
      id
    };
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
}
