/**
 * Options page for transparent local configuration. Tag names and colors are
 * stored locally and do not read or store chat contents.
 */
import type { NexusChatsTagDefinition } from "../storage/StorageService";
import "./options.css";

const DEFAULT_TAG_COLOR = "#14b8a6";
const CONFIGURATION_STATE_KEY = "nexuschats.configuration";

let tags: NexusChatsTagDefinition[] = [];

const tagForm = getRequiredElement<HTMLFormElement>("tag-form");
const tagNameInput = getRequiredElement<HTMLInputElement>("tag-name");
const tagColorInput = getRequiredElement<HTMLInputElement>("tag-color");
const tagList = getRequiredElement<HTMLElement>("tag-list");
const emptyState = getRequiredElement<HTMLElement>("empty-state");
const clearTagsButton = getRequiredElement<HTMLButtonElement>("clear-tags-button");
const statusLine = getRequiredElement<HTMLElement>("status-line");

void initialize();

async function initialize(): Promise<void> {
  const configuration = await readConfigurationState();
  tags = configuration.tags;
  renderTags();

  tagForm.addEventListener("submit", (event) => {
    event.preventDefault();
    void addTag();
  });
  clearTagsButton.addEventListener("click", () => {
    void clearTags();
  });
}

async function addTag(): Promise<void> {
  const name = normalizeTagName(tagNameInput.value);
  const color = normalizeColor(tagColorInput.value);

  if (!name) {
    setStatus("Bitte einen Tag-Namen eingeben.");
    tagNameInput.focus();
    return;
  }

  if (tags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())) {
    setStatus("Diesen Tag gibt es bereits.");
    tagNameInput.focus();
    return;
  }

  tags = [
    ...tags,
    {
      color,
      id: createTagId(name),
      name
    }
  ];

  tagForm.reset();
  tagColorInput.value = DEFAULT_TAG_COLOR;
  await saveAndRender("Tag gespeichert.");
}

async function clearTags(): Promise<void> {
  if (tags.length === 0) {
    setStatus("Es sind keine Tags vorhanden.");
    return;
  }

  tags = [];
  await saveAndRender("Alle Tags entfernt.");
}

function renderTags(): void {
  tagList.replaceChildren(...tags.map((tag) => createTagRow(tag)));
  emptyState.hidden = tags.length > 0;
  clearTagsButton.disabled = tags.length === 0;
}

function createTagRow(tag: NexusChatsTagDefinition): HTMLElement {
  const row = document.createElement("div");
  row.className = "tag-row";

  const swatch = document.createElement("span");
  swatch.className = "tag-swatch";
  swatch.style.backgroundColor = tag.color;
  swatch.setAttribute("aria-hidden", "true");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = tag.name;
  nameInput.maxLength = 40;
  nameInput.setAttribute("aria-label", `Name für Tag ${tag.name}`);
  nameInput.addEventListener("change", () => {
    void updateTag(tag.id, {
      name: normalizeTagName(nameInput.value)
    });
  });

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = tag.color;
  colorInput.setAttribute("aria-label", `Farbe für Tag ${tag.name}`);
  colorInput.addEventListener("input", () => {
    swatch.style.backgroundColor = colorInput.value;
  });
  colorInput.addEventListener("change", () => {
    void updateTag(tag.id, {
      color: normalizeColor(colorInput.value)
    });
  });

  const removeButton = document.createElement("button");
  removeButton.className = "secondary-button";
  removeButton.type = "button";
  removeButton.textContent = "Entfernen";
  removeButton.addEventListener("click", () => {
    void removeTag(tag.id);
  });

  row.append(swatch, nameInput, colorInput, removeButton);
  return row;
}

async function updateTag(
  tagId: string,
  updates: Partial<Pick<NexusChatsTagDefinition, "color" | "name">>
): Promise<void> {
  const tag = tags.find((candidate) => candidate.id === tagId);

  if (!tag) {
    return;
  }

  const name = updates.name === undefined ? tag.name : normalizeTagName(updates.name);
  const color = updates.color === undefined ? tag.color : normalizeColor(updates.color);

  if (!name) {
    renderTags();
    setStatus("Tag-Namen dürfen nicht leer sein.");
    return;
  }

  if (
    tags.some(
      (candidate) => candidate.id !== tagId && candidate.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    renderTags();
    setStatus("Diesen Tag gibt es bereits.");
    return;
  }

  tags = tags.map((candidate) =>
    candidate.id === tagId
      ? {
          ...candidate,
          color,
          name
        }
      : candidate
  );
  await saveAndRender("Tag aktualisiert.");
}

async function removeTag(tagId: string): Promise<void> {
  tags = tags.filter((tag) => tag.id !== tagId);
  await saveAndRender("Tag entfernt.");
}

async function saveAndRender(message: string): Promise<void> {
  await saveConfigurationState({ tags });
  const configuration = await readConfigurationState();
  tags = configuration.tags;
  renderTags();
  setStatus(message);
}

function createTagId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 36);
  const suffix =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : String(Date.now()).slice(-8);

  return `${slug || "tag"}-${suffix}`;
}

function normalizeTagName(value: string): string {
  return value.trim().replace(/\s+/gu, " ").slice(0, 40);
}

function normalizeColor(value: string): string {
  return /^#[0-9a-f]{6}$/iu.test(value) ? value.toLowerCase() : DEFAULT_TAG_COLOR;
}

function setStatus(message: string): void {
  statusLine.textContent = message;
}

interface OptionsConfigurationState {
  readonly tags: NexusChatsTagDefinition[];
}

async function readConfigurationState(): Promise<OptionsConfigurationState> {
  const storageArea = getStorageArea();

  if (!storageArea) {
    return { tags: [] };
  }

  return new Promise((resolve) => {
    storageArea.get([CONFIGURATION_STATE_KEY], (items) => {
      if (hasRuntimeError()) {
        resolve({ tags: [] });
        return;
      }

      const storedState = items[CONFIGURATION_STATE_KEY] as
        Partial<OptionsConfigurationState> | undefined;
      const storedTags = Array.isArray(storedState?.tags) ? storedState.tags : [];

      resolve({
        tags: sanitizeTags(storedTags)
      });
    });
  });
}

async function saveConfigurationState(
  configurationState: OptionsConfigurationState
): Promise<void> {
  const storageArea = getStorageArea();

  if (!storageArea) {
    return;
  }

  await new Promise<void>((resolve) => {
    storageArea.set(
      {
        [CONFIGURATION_STATE_KEY]: {
          tags: sanitizeTags(configurationState.tags)
        }
      },
      resolve
    );
  });
}

function sanitizeTags(
  values: readonly Partial<NexusChatsTagDefinition>[]
): NexusChatsTagDefinition[] {
  const seenTagIds = new Set<string>();

  return values
    .map((tag) => ({
      color: normalizeColor(typeof tag?.color === "string" ? tag.color : ""),
      id:
        typeof tag?.id === "string"
          ? tag.id
              .trim()
              .replace(/[^a-z0-9_-]/giu, "")
              .slice(0, 64)
          : "",
      name: normalizeTagName(typeof tag?.name === "string" ? tag.name : "")
    }))
    .filter((tag) => {
      if (!tag.id || !tag.name || seenTagIds.has(tag.id)) {
        return false;
      }

      seenTagIds.add(tag.id);
      return true;
    });
}

function getStorageArea(): chrome.storage.StorageArea | null {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return null;
  }

  return chrome.storage.local;
}

function hasRuntimeError(): boolean {
  return Boolean(chrome.runtime?.lastError);
}

function getRequiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing options element: ${id}`);
  }

  return element as T;
}
