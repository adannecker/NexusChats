/**
 * Background worker for extension-only APIs that should not be called through
 * page navigation from a content script.
 */
const OPEN_OPTIONS_MESSAGE_TYPE = "nexuschats:open-options";

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
  if (!isOpenOptionsMessage(message)) {
    return false;
  }

  chrome.runtime.openOptionsPage(() => {
    sendResponse({
      ok: !chrome.runtime.lastError
    });
  });

  return true;
});

function isOpenOptionsMessage(message: unknown): boolean {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === OPEN_OPTIONS_MESSAGE_TYPE
  );
}
