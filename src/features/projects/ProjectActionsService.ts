/**
 * Finds the project header area in ChatGPT and returns a stable mount point for
 * the horizontal NexusChats action controls next to the sources control.
 */
import { isVisibleElement, normalizeText, queryAll } from "../../utils/dom";

export interface ProjectActionsMountPoint {
  readonly after: ChildNode;
  readonly parent: HTMLElement;
  readonly projectRoot: HTMLElement;
}

const PROJECT_SOURCE_SELECTOR = "button, a, [role='button'], [role='tab'], [aria-label]";
const NEXUSCHATS_SELECTOR =
  "#nexuschats-sidebar-panel, #nexuschats-project-actions, [data-nexuschats-chat-control]";
const SOURCE_LABELS = ["quellen", "sources"] as const;

/**
 * Detects the project sources control without depending on ChatGPT class names.
 */
export class ProjectActionsService {
  findMountPoint(): ProjectActionsMountPoint | null {
    const sourceControl = queryAll(document, PROJECT_SOURCE_SELECTOR)
      .filter((candidate): candidate is HTMLElement => candidate instanceof HTMLElement)
      .find((candidate) => this.isProjectSourceControl(candidate));

    const projectRoot = sourceControl?.closest<HTMLElement>("main") ?? null;

    if (!sourceControl?.parentElement || !projectRoot) {
      return null;
    }

    return {
      after: sourceControl,
      parent: sourceControl.parentElement,
      projectRoot
    };
  }

  private isProjectSourceControl(candidate: HTMLElement): boolean {
    return (
      !candidate.closest(NEXUSCHATS_SELECTOR) &&
      Boolean(candidate.closest("main")) &&
      isVisibleElement(candidate) &&
      this.hasSourceLabel(candidate) &&
      this.isInProjectHeaderArea(candidate)
    );
  }

  private hasSourceLabel(candidate: HTMLElement): boolean {
    const text = normalizeText(candidate.textContent).toLowerCase();
    const ariaLabel = normalizeText(candidate.getAttribute("aria-label")).toLowerCase();

    return this.matchesSourceLabel(text) || this.matchesSourceLabel(ariaLabel);
  }

  private matchesSourceLabel(label: string): boolean {
    return SOURCE_LABELS.some(
      (sourceLabel) => label === sourceLabel || label.startsWith(`${sourceLabel} `)
    );
  }

  private isInProjectHeaderArea(candidate: HTMLElement): boolean {
    const rect = candidate.getBoundingClientRect();
    const topLimit = Math.min(260, window.innerHeight * 0.35);
    const leftLimit = Math.min(360, window.innerWidth * 0.3);

    return (
      rect.top >= 0 &&
      rect.top <= topLimit &&
      rect.left >= leftLimit &&
      rect.width >= 32 &&
      rect.height >= 20
    );
  }
}
