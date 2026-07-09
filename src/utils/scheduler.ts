/**
 * requestAnimationFrame scheduler that coalesces repeated mutation callbacks
 * into a single DOM pass.
 */
/**
 * Runs a task at most once per animation frame.
 */
export class FrameScheduler {
  private frameId: number | null = null;

  constructor(private readonly task: () => void) {}

  schedule(): void {
    if (this.frameId !== null) {
      return;
    }

    this.frameId = window.requestAnimationFrame(() => {
      this.frameId = null;
      this.task();
    });
  }

  cancel(): void {
    if (this.frameId === null) {
      return;
    }

    window.cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }
}
