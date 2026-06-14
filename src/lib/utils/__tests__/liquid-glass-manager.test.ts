/**
 * Liquid Glass Manager Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { LiquidGlassManager } from "../liquid-glass-manager";

describe("LiquidGlassManager", () => {
  let manager: LiquidGlassManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Create mock element
    mockElement = document.createElement("div");
    mockElement.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      width: 200,
      height: 200,
      right: 300,
      bottom: 300,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    }));

    manager = new LiquidGlassManager();
  });

  afterEach(() => {
    manager.destroy();
    vi.clearAllMocks();
  });

  it("registers element", () => {
    manager.register(mockElement);

    // Should set default specular values
    expect(mockElement.style.getPropertyValue("--lg-specular-x")).toBe("50%");
    expect(mockElement.style.getPropertyValue("--lg-specular-y")).toBe("-10%");
    expect(mockElement.style.getPropertyValue("--lg-specular-intensity")).toBe("1");
  });

  it("unregisters element", () => {
    manager.register(mockElement);
    manager.unregister(mockElement);

    // Manager should no longer track this element
    expect(manager["elements"].has(mockElement)).toBe(false);
  });

  it("updates specular on mousemove", () => {
    manager.register(mockElement);

    // Simulate mousemove
    const event = new MouseEvent("mousemove", {
      clientX: 200, // Center of element
      clientY: 200,
    });
    window.dispatchEvent(event);

    // Wait for rAF
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        const specularX = mockElement.style.getPropertyValue("--lg-specular-x");
        const specularY = mockElement.style.getPropertyValue("--lg-specular-y");

        expect(specularX).toBeTruthy();
        expect(specularY).toBeTruthy();
        resolve();
      });
    });
  });

  it("respects reduced motion preference", () => {
    manager.destroy();
    window.liquidGlassManager?.destroy();
    window.liquidGlassManager = undefined;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const reducedMotionManager = new LiquidGlassManager();
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    reducedMotionManager.register(mockElement);

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 150, clientY: 150 })
    );

    expect(rafSpy).not.toHaveBeenCalled();

    reducedMotionManager.destroy();
    rafSpy.mockRestore();
  });

  it("cleans up event listeners on destroy", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    manager.destroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchmove",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "touchend",
      expect.any(Function)
    );
  });

  it("calculates proximity intensity from nearest edge", () => {
    manager.register(mockElement);

    // Cursor directly over element center — high intensity (near edges of rect internally)
    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 200, clientY: 200 })
    );

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        const intensity = parseFloat(
          mockElement.style.getPropertyValue("--lg-specular-intensity")
        );
        expect(intensity).toBeGreaterThan(0);
        expect(intensity).toBeLessThanOrEqual(1);
        resolve();
      });
    });
  });

  it("reduces intensity when cursor is far from element", () => {
    manager.register(mockElement);

    window.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 1000, clientY: 1000 })
    );

    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        const intensity = parseFloat(
          mockElement.style.getPropertyValue("--lg-specular-intensity")
        );
        expect(intensity).toBeLessThan(0.5);
        resolve();
      });
    });
  });

  it("resets specular on touch end", () => {
    manager.register(mockElement);

    // Simulate touch
    const touchEvent = new TouchEvent("touchmove", {
      touches: [{ clientX: 150, clientY: 150 } as Touch],
    });
    window.dispatchEvent(touchEvent);

    // Wait for rAF
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        // Now touch end
        window.dispatchEvent(new TouchEvent("touchend"));

        // Should reset to defaults
        expect(mockElement.style.getPropertyValue("--lg-specular-x")).toBe("50%");
        expect(mockElement.style.getPropertyValue("--lg-specular-y")).toBe("-10%");
        resolve();
      });
    });
  });
});
