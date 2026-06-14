import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock ResizeObserver for Recharts
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock window.matchMedia for Tailwind/Framer
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock Web Worker for Calculator Form
class WorkerMock {
  url: string;
  onmessage: (msg: { data: unknown }) => void = () => {};
  constructor(stringUrl: string) {
    this.url = stringUrl;
  }
  postMessage(_msg: unknown) {
    // We mock the calculation synchronously for tests
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({
          data: {
            type: "SUCCESS",
            result: {
              totalCO2: 5.5,
              breakdown: { transport: 2, energy: 1.5, food: 1, waste: 1 },
            },
          },
        });
      }
    }, 10);
  }
  terminate() {}
}
global.Worker = WorkerMock as unknown as typeof Worker;

// Polyfill pointer events for shadcn/ui and framer-motion
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, params: MouseEventInit & { pointerId?: number } = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 1;
    }
  }
  global.PointerEvent = PointerEvent as unknown as typeof globalThis.PointerEvent;
}
