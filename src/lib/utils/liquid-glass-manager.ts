/**
 * Liquid Glass Specular Tracking Manager
 *
 * Real-time cursor-tracked specular highlights via CSS custom properties only.
 * Zero layout thrash — no paint-triggering property updates in rAF.
 */

interface SpecularState {
  x: number;
  y: number;
  intensity: number;
}

/** Distance from point to nearest edge of rect (0 when cursor is inside). */
function distanceToNearestEdge(
  px: number,
  py: number,
  rect: DOMRect
): number {
  if (px < rect.left || px > rect.right || py < rect.top || py > rect.bottom) {
    const dx = Math.max(rect.left - px, 0, px - rect.right);
    const dy = Math.max(rect.top - py, 0, py - rect.bottom);
    return Math.sqrt(dx * dx + dy * dy);
  }

  return Math.min(
    px - rect.left,
    rect.right - px,
    py - rect.top,
    rect.bottom - py
  );
}

export class LiquidGlassManager {
  private elements = new Set<HTMLElement>();
  private rafId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private isReducedMotion = false;

  private handleMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.scheduleUpdate();
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      this.mouseX = event.touches[0].clientX;
      this.mouseY = event.touches[0].clientY;
      this.scheduleUpdate();
    }
  };

  private handleTouchEnd = () => {
    this.elements.forEach((el) => {
      this.setSpecular(el, { x: 50, y: -10, intensity: 1 });
    });
  };

  private tick = () => {
    this.rafId = null;

    this.elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const relX = (this.mouseX - rect.left) / rect.width;
      const relY = (this.mouseY - rect.top) / rect.height;

      const specularX = Math.max(10, Math.min(90, relX * 100));
      const specularY = (relY - 0.5) * 60 - 10;

      const edgeDistance = distanceToNearestEdge(this.mouseX, this.mouseY, rect);
      const intensity = Math.max(0, Math.min(1, 1 - edgeDistance / 320));

      this.setSpecular(element, { x: specularX, y: specularY, intensity });
    });
  };

  constructor() {
    if (typeof window === "undefined") return;

    this.isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (this.isReducedMotion) return;

    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
    window.addEventListener("touchmove", this.handleTouchMove, { passive: true });
    window.addEventListener("touchend", this.handleTouchEnd, { passive: true });
  }

  register(element: HTMLElement) {
    this.elements.add(element);
    this.setSpecular(element, { x: 50, y: -10, intensity: 1 });
  }

  unregister(element: HTMLElement) {
    this.elements.delete(element);
  }

  private scheduleUpdate() {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private setSpecular(element: HTMLElement, state: SpecularState) {
    element.style.setProperty("--lg-specular-x", `${state.x}%`);
    element.style.setProperty("--lg-specular-y", `${state.y}%`);
    element.style.setProperty("--lg-specular-intensity", String(state.intensity));
  }

  destroy() {
    if (typeof window === "undefined") return;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
    this.elements.clear();
  }
}

declare global {
  interface Window {
    liquidGlassManager?: LiquidGlassManager;
  }
}

if (typeof window !== "undefined" && !window.liquidGlassManager) {
  window.liquidGlassManager = new LiquidGlassManager();
}
