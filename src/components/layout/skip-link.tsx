/**
 * SkipLink — Accessibility navigation shortcut.
 *
 * Invisible until focused via Tab. Allows keyboard users to bypass
 * the navigation and jump directly to the main content area.
 * Targets `#main-content` which must exist on the `<main>` element.
 *
 * @see WCAG 2.1 SC 2.4.1 — Bypass Blocks (Level A)
 */
"use client";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      data-slot="skip-link"
      className="
        fixed top-4 left-4 z-[100]
        px-4 py-2 rounded-lg
        bg-primary text-primary-foreground
        text-sm font-medium
        -translate-y-full opacity-0
        focus-visible:translate-y-0 focus-visible:opacity-100
        transition-all duration-200
        outline-none ring-2 ring-ring ring-offset-2 ring-offset-background
      "
    >
      Skip to main content
    </a>
  );
}
