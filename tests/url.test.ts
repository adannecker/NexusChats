/**
 * Unit tests for URL boundaries that keep the extension scoped to chatgpt.com.
 */
import { describe, expect, it } from "vitest";

import {
  getConversationIdFromHref,
  isConversationHref,
  isSupportedChatGptUrl
} from "../src/utils/url";

describe("ChatGPT URL helpers", () => {
  it("accepts secure chatgpt.com URLs", () => {
    expect(isSupportedChatGptUrl("https://chatgpt.com/")).toBe(true);
  });

  it("rejects legacy and subdomain hosts", () => {
    expect(isSupportedChatGptUrl("https://chat.openai.com/")).toBe(false);
    expect(isSupportedChatGptUrl("https://example.chatgpt.com/")).toBe(false);
  });

  it("detects conversation links relative to chatgpt.com", () => {
    expect(isConversationHref("/c/abc123", "https://chatgpt.com/")).toBe(true);
    expect(isConversationHref("/g/g-abc123/project", "https://chatgpt.com/")).toBe(false);
  });

  it("extracts only the conversation ID from supported chat links", () => {
    expect(getConversationIdFromHref("/c/chat-123?model=test", "https://chatgpt.com/")).toBe(
      "chat-123"
    );
    expect(
      getConversationIdFromHref("https://chat.openai.com/c/chat-123", "https://chatgpt.com/")
    ).toBe(null);
  });
});
