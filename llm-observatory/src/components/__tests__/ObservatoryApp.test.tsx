/**
 * @file ObservatoryApp.test.tsx
 * @description Smoke test suite for ObservatoryApp phase transitions and Zustand store gating (ADR-004).
 * @scope src/components/__tests__/ObservatoryApp.test.tsx
 * @date 2026-05-31
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react"; // CHANGED: import cleanup
import { ObservatoryApp } from "../ObservatoryApp";
import { usePipelineStore } from "@/store/pipelineStore";

// Mock Canvas and Three.js elements to avoid JSDOM compatibility issues
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: any) => <div>{children}</div>,
}));

// Mock Framer Motion to render immediately without delay
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    circle: ({ ...props }: any) => <circle {...props} />,
    text: ({ children, ...props }: any) => <text {...props}>{children}</text>,
    line: ({ ...props }: any) => <line {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock child views to test phase switching and hook wiring under pure conditions
vi.mock("@/components/home/WelcomeScreen", () => ({
  WelcomeScreen: ({ onStartJourney }: any) => (
    <div data-testid="welcome-screen">
      <button onClick={() => onStartJourney("test prompt")}>Start Journey</button>
    </div>
  ),
}));

vi.mock("@/components/home/PreJourneyIntro", () => ({
  PreJourneyIntro: ({ prompt, onBegin, onBack }: any) => (
    <div data-testid="prelude-screen">
      <span>{prompt}</span>
      <button onClick={onBegin}>Begin Simulation</button>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock("@/components/journey/DocumentaryJourney", () => ({
  DocumentaryJourney: ({ onExit }: any) => (
    <div data-testid="journey-screen">
      <button onClick={onExit}>Exit Journey</button>
    </div>
  ),
}));

vi.mock("@/components/ui/AmbientShell", () => ({
  AmbientShell: () => <div data-testid="ambient-shell" />,
}));

vi.mock("@/components/PreferencesHydrator", () => ({
  PreferencesHydrator: () => null,
}));

describe("ObservatoryApp Flow Smoke Tests", () => {
  beforeEach(() => {
    cleanup(); // CHANGED: clean up JSDOM body between test runs
    // Reset state before each test run
    act(() => {
      usePipelineStore.getState().reset();
    });
  });

  it("1. Welcome → Prelude transitions without calling submitPrompt", () => {
    const store = usePipelineStore.getState();
    expect(store.active).toBe(false);

    render(<ObservatoryApp />);
    expect(screen.getByTestId("welcome-screen")).toBeDefined();

    // Trigger transition to Prelude
    fireEvent.click(screen.getByText("Start Journey"));

    // Check we are now in the prelude
    expect(screen.getByTestId("prelude-screen")).toBeDefined();
    
    // Check that submitPrompt has not been called (active remains false)
    expect(usePipelineStore.getState().active).toBe(false);
  });

  it("2. submitPrompt is never called before onBegin fires", () => {
    render(<ObservatoryApp />);
    fireEvent.click(screen.getByText("Start Journey"));
    
    // In prelude, check that store is still inactive
    expect(usePipelineStore.getState().active).toBe(false);
  });

  it("3. onBegin → submitPrompt → active === true in store", () => {
    render(<ObservatoryApp />);
    fireEvent.click(screen.getByText("Start Journey"));

    // Trigger onBegin (Begin Simulation)
    fireEvent.click(screen.getByText("Begin Simulation"));

    // Should now render journey
    expect(screen.getByTestId("journey-screen")).toBeDefined();
    
    // Verify store has activated and prompt is stored
    const store = usePipelineStore.getState();
    expect(store.active).toBe(true);
    expect(store.prompt).toBe("test prompt");
  });

  it("4. reset() returns to welcome phase with active === false", () => {
    render(<ObservatoryApp />);
    fireEvent.click(screen.getByText("Start Journey"));
    fireEvent.click(screen.getByText("Begin Simulation"));

    // In journey phase
    expect(screen.getByTestId("journey-screen")).toBeDefined();
    expect(usePipelineStore.getState().active).toBe(true);

    // Click Exit Journey (which calls store.reset())
    fireEvent.click(screen.getByText("Exit Journey"));

    // Verify it returned to the welcome screen
    expect(screen.getByTestId("welcome-screen")).toBeDefined();
    
    // Verify store is reset and inactive
    const store = usePipelineStore.getState();
    expect(store.active).toBe(false);
    expect(store.prompt).toBe("");
  });
});
