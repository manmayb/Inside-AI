"use client";

import { useEffect } from "react";
import { usePipelineStore } from "@/store/pipelineStore";

export function useKeyboardShortcuts() {
  const active = usePipelineStore((s) => s.active);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          usePipelineStore.getState().togglePause();
          break;
        case "ArrowRight":
          if (e.shiftKey) usePipelineStore.getState().goToNextStage();
          break;
        case "ArrowLeft":
          if (e.shiftKey) usePipelineStore.getState().goToPrevStage();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);
}
