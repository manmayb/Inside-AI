import type { PipelineStage } from "@/types/pipeline";
import { STAGE_META } from "@/lib/constants";

/** Hold at 100% before auto-advancing — time to absorb the chapter */
export const STAGE_DWELL_MS = 3500;

/**
 * Stage duration in ms (progress bar 0→100%).
 * Documentary pacing: ~8–16s per chapter + dwell, not 1–3s dashboard scrubbing.
 */
export function getStageDurationMs(stage: PipelineStage): number {
  return STAGE_META[stage].durationMs;
}
