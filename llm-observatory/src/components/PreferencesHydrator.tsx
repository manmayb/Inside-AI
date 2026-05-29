"use client";

import { useEffect } from "react";
import { usePipelineStore } from "@/store/pipelineStore";

export function PreferencesHydrator() {
  const hydratePrefs = usePipelineStore((s) => s.hydratePrefs);

  useEffect(() => {
    hydratePrefs();
  }, [hydratePrefs]);

  return null;
}
