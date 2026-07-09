/**
 * Content-script entry point that starts NexusChats after the ChatGPT document
 * is ready enough for DOM mounting.
 */
import { NexusChatsContentApp } from "./NexusChatsContentApp";

const app = new NexusChatsContentApp();

function startApp(): void {
  void app.start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
  startApp();
}
