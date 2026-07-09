/**
 * Small DOM helpers used by feature services. They keep direct DOM access
 * predictable and make heuristics easier to test later.
 */
export function queryAll<T extends Element = Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

export function asHTMLElement(element: Element | null): HTMLElement | null {
  return element instanceof HTMLElement ? element : null;
}

export function isVisibleElement(element: Element): boolean {
  const rect = element.getBoundingClientRect();

  return rect.width > 0 && rect.height > 0;
}

export function normalizeText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}
