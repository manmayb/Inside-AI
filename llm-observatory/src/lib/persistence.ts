import type { ThemeAccent, ViewMode } from "@/types/pipeline";
import type { ModelPresetId } from "@/lib/modelPresets";

const KEY = "neural-observatory-prefs";

export interface UserPrefs {
  viewMode: ViewMode;
  playbackSpeed: number;
  ragEnabled: boolean;
  themeAccent: ThemeAccent;
  modelPreset: ModelPresetId;
}

const DEFAULTS: UserPrefs = {
  viewMode: "beginner",
  playbackSpeed: 1,
  ragEnabled: false,
  themeAccent: "teal",
  modelPreset: "standard",
};

export function loadPrefs(): Partial<UserPrefs> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return {};
  }
}

export function savePrefs(partial: Partial<UserPrefs>) {
  if (typeof window === "undefined") return;
  try {
    const next = { ...DEFAULTS, ...loadPrefs(), ...partial };
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function applyThemeAccent(accent: ThemeAccent) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.accent = accent;
}
