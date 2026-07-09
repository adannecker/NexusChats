/**
 * URL helpers define the host and route boundaries NexusChats is allowed to
 * operate on.
 */
const CHATGPT_HOST = "chatgpt.com";
const CONVERSATION_PATH_PATTERN = /^\/c\/[^/?#]+/u;

export function isChatGptHost(hostname: string): boolean {
  return hostname.toLowerCase() === CHATGPT_HOST;
}

export function isSupportedChatGptUrl(value: string | URL): boolean {
  const url = typeof value === "string" ? new URL(value) : value;

  return url.protocol === "https:" && isChatGptHost(url.hostname);
}

export function isConversationPath(pathname: string): boolean {
  return CONVERSATION_PATH_PATTERN.test(pathname);
}

export function isConversationHref(href: string, baseUrl: string): boolean {
  return getConversationIdFromHref(href, baseUrl) !== null;
}

export function getConversationIdFromHref(href: string, baseUrl: string): string | null {
  try {
    const url = new URL(href, baseUrl);

    if (!isSupportedChatGptUrl(url) || !isConversationPath(url.pathname)) {
      return null;
    }

    const encodedChatId = url.pathname.split("/")[2];

    return encodedChatId ? decodeURIComponent(encodedChatId) : null;
  } catch {
    return null;
  }
}
