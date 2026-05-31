"use client";

import { useEffect, useState } from "react";
import { usePipelineStore } from "@/store/pipelineStore";

/** Respects pause state and prefers-reduced-motion for decorative animation */
export function useMotionPreferences() {
  const isPaused = usePipelineStore((s) => s.isPaused);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const motionEnabled = !reducedMotion && !isPaused;

  return {
    isPaused,
    reducedMotion,
    motionEnabled,
    /** Framer Motion repeat — 0 when motion should be still */
    repeat: motionEnabled ? Infinity : 0,
  };
}
