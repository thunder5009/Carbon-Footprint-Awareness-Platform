/**
 * Liquid Glass V2 Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { LiquidGlassV2 } from "../liquid-glass-v2";

describe("LiquidGlassV2", () => {
  beforeEach(() => {
    // Mock window.matchMedia for reduced motion tests
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

    // Mock liquidGlassManager
    window.liquidGlassManager = {
      register: vi.fn(),
      unregister: vi.fn(),
      destroy: vi.fn(),
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <LiquidGlassV2>
        <div>Test Content</div>
      </LiquidGlassV2>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies correct material variant", () => {
    const { container } = render(
      <LiquidGlassV2 material="thick">Content</LiquidGlassV2>
    );

    const host = container.querySelector(".lg-host");
    expect(host).toHaveAttribute("data-lg", "thick");
  });

  it("renders all 6 layers", () => {
    const { container } = render(<LiquidGlassV2>Content</LiquidGlassV2>);

    expect(container.querySelector(".lg-refraction")).toBeInTheDocument();
    expect(container.querySelector(".lg-substrate")).toBeInTheDocument();
    expect(container.querySelector(".lg-specular")).toBeInTheDocument();
    expect(container.querySelector(".lg-border")).toBeInTheDocument();
    expect(container.querySelector(".lg-inner-glow")).toBeInTheDocument();
    expect(container.querySelector(".lg-content")).toBeInTheDocument();
  });

  it("renders specular sub-layers", () => {
    const { container } = render(<LiquidGlassV2>Content</LiquidGlassV2>);

    expect(container.querySelector(".lg-specular-main")).toBeInTheDocument();
    expect(container.querySelector(".lg-specular-corner-tl")).toBeInTheDocument();
    expect(container.querySelector(".lg-specular-corner-tr")).toBeInTheDocument();
    expect(container.querySelector(".lg-specular-bounce")).toBeInTheDocument();
  });

  it("applies animation attribute when animate=true", () => {
    const { container } = render(
      <LiquidGlassV2 animate>Content</LiquidGlassV2>
    );

    const host = container.querySelector(".lg-host");
    expect(host).toHaveAttribute("data-lg-animate", "true");
  });

  it("applies stagger delay CSS variable", () => {
    const { container } = render(
      <LiquidGlassV2 staggerDelay={0.12}>Content</LiquidGlassV2>
    );

    const host = container.querySelector(".lg-host") as HTMLElement;
    expect(host.style.getPropertyValue("--lg-stagger-delay")).toBe("0.12s");
  });

  it("forwards accessibility props", () => {
    const { container } = render(
      <LiquidGlassV2 role="button" aria-label="Submit form">
        Content
      </LiquidGlassV2>
    );

    const host = container.querySelector(".lg-host");
    expect(host).toHaveAttribute("role", "button");
    expect(host).toHaveAttribute("aria-label", "Submit form");
  });

  it("registers with manager on mount", () => {
    render(<LiquidGlassV2>Content</LiquidGlassV2>);

    expect(window.liquidGlassManager?.register).toHaveBeenCalled();
  });

  it("unregisters from manager on unmount", () => {
    const { unmount } = render(<LiquidGlassV2>Content</LiquidGlassV2>);

    unmount();

    expect(window.liquidGlassManager?.unregister).toHaveBeenCalled();
  });

  it("calls onPress when clicked", () => {
    const onPress = vi.fn();
    render(<LiquidGlassV2 onPress={onPress}>Content</LiquidGlassV2>);

    const host = screen.getByText("Content").closest(".lg-host");
    if (host instanceof HTMLElement) {
      host.click();
    }

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <LiquidGlassV2 className="custom-class">Content</LiquidGlassV2>
    );

    const host = container.querySelector(".lg-host");
    expect(host).toHaveClass("custom-class");
  });

  it("defaults to regular material", () => {
    const { container } = render(<LiquidGlassV2>Content</LiquidGlassV2>);

    const host = container.querySelector(".lg-host");
    expect(host).toHaveAttribute("data-lg", "regular");
  });

  it("content layer has no filters", () => {
    const { container } = render(<LiquidGlassV2>Content</LiquidGlassV2>);

    const content = container.querySelector(".lg-content") as HTMLElement;
    const styles = window.getComputedStyle(content);

    // Content layer must never have filter or backdrop-filter
    expect(styles.filter).toBe("none");
  });
});
