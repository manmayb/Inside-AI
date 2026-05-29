"use client";

/**
 * Single Zustand store: pipeline navigation, simulated artifacts, user prefs.
 * All lib/* builders invoked from submitPrompt — not from React components.
 * @see docs/STATE_MANAGEMENT/overview.md
 */
import { create } from "zustand";
import { computeMetrics } from "@/lib/analytics";
import { buildStageStatuses, DEFAULT_CONFIG, STAGE_META } from "@/lib/constants";
import { getPreset, type ModelPresetId } from "@/lib/modelPresets";
import { buildHiddenStateSlices } from "@/lib/tensorAnim";
import { globalProgress, fromGlobalProgress } from "@/lib/tourProgress";
import {
  buildAttentionMatrix,
  buildContextBlocks,
  buildEmbeddings,
  buildKVCache,
  buildLogits,
  simulateResponse,
} from "@/lib/inference";
import { applyThemeAccent, loadPrefs, savePrefs } from "@/lib/persistence";
import { tokenize } from "@/lib/tokenizer";
import type {
  AttentionMatrix,
  ContextBlock,
  EmbeddingPoint,
  GeneratedToken,
  HiddenStateSlice,
  InferenceConfig,
  KVCacheEntry,
  LogitCandidate,
  PipelineMetrics,
  PipelineStage,
  StageStatus,
  ThemeAccent,
  TokenUnit,
  TourKeyframe,
  ViewMode,
} from "@/types/pipeline";
import { PIPELINE_STAGES } from "@/types/pipeline";

let keyframeId = 0;
let tourStartedAt = 0;

interface PipelineState {
  active: boolean;
  prompt: string;
  currentStage: PipelineStage;
  stageProgress: number;
  stageStatuses: StageStatus[];
  viewMode: ViewMode;
  themeAccent: ThemeAccent;
  modelPreset: ModelPresetId;
  config: InferenceConfig;
  ragEnabled: boolean;

  tokens: TokenUnit[];
  embeddings: EmbeddingPoint[];
  contextBlocks: ContextBlock[];
  attention: AttentionMatrix | null;
  hiddenStates: HiddenStateSlice[];
  selectedTokenIndex: number;
  compareTokenIndex: number | null;
  selectedHead: number;
  inspectedLayer: number;
  logits: LogitCandidate[];
  generatedTokens: GeneratedToken[];
  streamedText: string;
  kvCache: KVCacheEntry[];
  metrics: PipelineMetrics | null;

  networkLatencyMs: number;
  packetSize: number;
  safetyScore: number;
  moderationFlags: string[];
  arStep: number;
  isGenerating: boolean;
  generationComplete: boolean;
  isPaused: boolean;
  playbackSpeed: number;

  tourKeyframes: TourKeyframe[];
  isScrubbing: boolean;
  globalScrubProgress: number;

  hydratePrefs: () => void;
  setViewMode: (mode: ViewMode) => void;
  setThemeAccent: (accent: ThemeAccent) => void;
  setModelPreset: (id: ModelPresetId) => void;
  setConfig: (partial: Partial<InferenceConfig>) => void;
  setRagEnabled: (v: boolean) => void;
  setSelectedTokenIndex: (i: number) => void;
  setCompareTokenIndex: (i: number | null) => void;
  setSelectedHead: (h: number) => void;
  setInspectedLayer: (layer: number) => void;
  submitPrompt: (prompt: string) => void;
  setStage: (stage: PipelineStage, progress?: number) => void;
  advanceProgress: (delta: number) => void;
  appendStreamToken: (token: GeneratedToken) => void;
  refreshLogits: (step: number) => void;
  togglePause: () => void;
  setPlaybackSpeed: (speed: number) => void;
  jumpToStage: (stage: PipelineStage) => void;
  goToNextStage: () => void;
  goToPrevStage: () => void;
  recordTourKeyframe: () => void;
  scrubToGlobal: (progress: number) => void;
  setScrubbing: (scrubbing: boolean) => void;
  rerunTour: () => void;
  reset: () => void;
}

const initialState = {
  active: false,
  prompt: "",
  currentStage: "input" as PipelineStage,
  stageProgress: 0,
  stageStatuses: buildStageStatuses("input", 0),
  viewMode: "beginner" as ViewMode,
  themeAccent: "teal" as ThemeAccent,
  modelPreset: "standard" as ModelPresetId,
  config: DEFAULT_CONFIG,
  ragEnabled: false,
  tokens: [] as TokenUnit[],
  embeddings: [] as EmbeddingPoint[],
  contextBlocks: [] as ContextBlock[],
  attention: null as AttentionMatrix | null,
  hiddenStates: [] as HiddenStateSlice[],
  selectedTokenIndex: 0,
  compareTokenIndex: null as number | null,
  selectedHead: 0,
  inspectedLayer: 16,
  logits: [] as LogitCandidate[],
  generatedTokens: [] as GeneratedToken[],
  streamedText: "",
  kvCache: [] as KVCacheEntry[],
  metrics: null as PipelineMetrics | null,
  networkLatencyMs: 0,
  packetSize: 0,
  safetyScore: 0.98,
  moderationFlags: [] as string[],
  arStep: 0,
  isGenerating: false,
  generationComplete: false,
  isPaused: false,
  playbackSpeed: 1,
  tourKeyframes: [] as TourKeyframe[],
  isScrubbing: false,
  globalScrubProgress: 0,
};

export const usePipelineStore = create<PipelineState>((set, get) => ({
  ...initialState,

  hydratePrefs: () => {
    const prefs = loadPrefs();
    const preset = getPreset(prefs.modelPreset ?? "standard");
    if (prefs.themeAccent) applyThemeAccent(prefs.themeAccent);
    set({
      viewMode: prefs.viewMode ?? "beginner",
      playbackSpeed: prefs.playbackSpeed ?? 1,
      ragEnabled: prefs.ragEnabled ?? false,
      themeAccent: prefs.themeAccent ?? "teal",
      modelPreset: prefs.modelPreset ?? "standard",
      config: preset.config,
      inspectedLayer: Math.floor(preset.config.layers / 2),
    });
  },

  setViewMode: (viewMode) => {
    savePrefs({ viewMode });
    set({ viewMode });
  },

  setThemeAccent: (themeAccent) => {
    applyThemeAccent(themeAccent);
    savePrefs({ themeAccent });
    set({ themeAccent });
  },

  setModelPreset: (modelPreset) => {
    const preset = getPreset(modelPreset);
    savePrefs({ modelPreset });
    set({
      modelPreset,
      config: preset.config,
      inspectedLayer: Math.floor(preset.config.layers / 2),
    });
  },

  setConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial } })),

  setRagEnabled: (ragEnabled) => {
    savePrefs({ ragEnabled });
    set({ ragEnabled });
  },

  setSelectedTokenIndex: (selectedTokenIndex) => {
    const { tokens } = get();
    const clamped = Math.max(0, Math.min(selectedTokenIndex, Math.max(0, tokens.length - 1)));
    set({ selectedTokenIndex: clamped });
  },

  setCompareTokenIndex: (compareTokenIndex) => set({ compareTokenIndex }),
  setSelectedHead: (selectedHead) => set({ selectedHead }),
  setInspectedLayer: (inspectedLayer) => set({ inspectedLayer }),

  submitPrompt: (prompt) => {
    const config = get().config;
    const tokens = tokenize(prompt);
    const embeddings = buildEmbeddings(tokens);
    const contextBlocks = buildContextBlocks(prompt, tokens.length, get().ragEnabled);
    const attention = buildAttentionMatrix(tokens, config.heads);
    const logits = buildLogits(tokens, config, 0);
    const kvCache = buildKVCache(config, tokens.length);
    const generatedTokens = simulateResponse(prompt);
    const hiddenStates = buildHiddenStateSlices(
      tokens.length,
      Math.min(24, config.layers),
      tokens,
      tokens.reduce((a, t) => a + t.id, 0)
    );

    keyframeId = 0;
    tourStartedAt = Date.now();

    set({
      active: true,
      prompt,
      tokens,
      embeddings,
      contextBlocks,
      attention,
      hiddenStates,
      logits,
      kvCache,
      generatedTokens,
      streamedText: "",
      currentStage: "input",
      stageProgress: 0,
      stageStatuses: buildStageStatuses("input", 0),
      networkLatencyMs: 18 + Math.random() * 40,
      packetSize: JSON.stringify({ prompt, model: get().modelPreset }).length,
      safetyScore: 0.97 + Math.random() * 0.02,
      moderationFlags: [],
      arStep: 0,
      isGenerating: false,
      generationComplete: false,
      metrics: null,
      selectedTokenIndex: 0,
      compareTokenIndex: null,
      isPaused: false,
      isScrubbing: false,
      globalScrubProgress: 0,
      tourKeyframes: [],
      inspectedLayer: Math.floor(config.layers / 2),
    });

    get().recordTourKeyframe();
  },

  setStage: (currentStage, progress = 0) => {
    const gp = globalProgress(currentStage, progress);
    set({
      currentStage,
      stageProgress: progress,
      stageStatuses: buildStageStatuses(currentStage, progress),
      globalScrubProgress: gp,
    });
  },

  advanceProgress: (delta) => {
    const { currentStage, stageProgress } = get();
    const next = Math.min(100, stageProgress + delta);
    const gp = globalProgress(currentStage, next);
    set({
      stageProgress: next,
      stageStatuses: buildStageStatuses(currentStage, next),
      globalScrubProgress: gp,
    });
  },

  appendStreamToken: (token) =>
    set((s) => ({
      streamedText: s.streamedText + token.text,
    })),

  refreshLogits: (step) => {
    const { tokens, config } = get();
    set({ logits: buildLogits(tokens, config, step), arStep: step });
  },

  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),

  setPlaybackSpeed: (playbackSpeed) => {
    savePrefs({ playbackSpeed });
    set({ playbackSpeed });
  },

  jumpToStage: (stage) => {
    const idx = PIPELINE_STAGES.indexOf(stage);
    const currentIdx = PIPELINE_STAGES.indexOf(get().currentStage);
    const progress = idx <= currentIdx ? 100 : 0;
    const gp = globalProgress(stage, progress);
    set({
      currentStage: stage,
      stageProgress: progress,
      stageStatuses: buildStageStatuses(stage, progress),
      globalScrubProgress: gp,
      isPaused: true,
    });
  },

  goToNextStage: () => {
    const { currentStage, generationComplete } = get();
    if (generationComplete) return;
    const next = getNextStage(currentStage);
    if (!next) {
      const state = get();
      const latencyMs = Date.now() - tourStartedAt;
      set({
        generationComplete: true,
        stageProgress: 100,
        stageStatuses: buildStageStatuses(currentStage, 100),
        globalScrubProgress: 100,
        metrics: computeMetrics(
          state.config,
          state.tokens.length,
          state.generatedTokens.length,
          latencyMs
        ),
      });
      get().recordTourKeyframe();
      return;
    }
    set({
      currentStage: next,
      stageProgress: 0,
      stageStatuses: buildStageStatuses(next, 0),
      globalScrubProgress: globalProgress(next, 0),
      isPaused: false,
    });
    get().recordTourKeyframe();
  },

  goToPrevStage: () => {
    const idx = PIPELINE_STAGES.indexOf(get().currentStage);
    if (idx <= 0) return;
    const prev = PIPELINE_STAGES[idx - 1];
    set({
      currentStage: prev,
      stageProgress: 100,
      stageStatuses: buildStageStatuses(prev, 100),
      globalScrubProgress: globalProgress(prev, 100),
      isPaused: true,
      generationComplete: false,
    });
  },

  recordTourKeyframe: () => {
    const { currentStage, stageProgress, tourKeyframes } = get();
    const gp = globalProgress(currentStage, stageProgress);
    const last = tourKeyframes[tourKeyframes.length - 1];
    if (last && Math.abs(last.globalProgress - gp) < 0.4) return;

    const frame: TourKeyframe = {
      id: keyframeId++,
      globalProgress: gp,
      stage: currentStage,
      stageProgress,
      timestamp: Date.now() - tourStartedAt,
    };
    set({ tourKeyframes: [...tourKeyframes, frame].slice(-200) });
  },

  scrubToGlobal: (progress) => {
    const { stage, stageProgress } = fromGlobalProgress(progress);
    set({
      globalScrubProgress: progress,
      currentStage: stage,
      stageProgress,
      stageStatuses: buildStageStatuses(stage, stageProgress),
      isPaused: true,
    });
  },

  setScrubbing: (isScrubbing) => set({ isScrubbing }),

  rerunTour: () => {
    const { prompt } = get();
    if (!prompt.trim()) return;
    get().submitPrompt(prompt);
  },

  reset: () => {
    const { playbackSpeed, viewMode, themeAccent, modelPreset, ragEnabled, config } = get();
    set({
      ...initialState,
      playbackSpeed,
      viewMode,
      themeAccent,
      modelPreset,
      ragEnabled,
      config,
      stageStatuses: buildStageStatuses("input", 0),
      inspectedLayer: Math.floor(config.layers / 2),
    });
  },
}));

export function getStageDuration(stage: PipelineStage): number {
  return STAGE_META[stage].durationMs;
}

export function getNextStage(stage: PipelineStage): PipelineStage | null {
  const i = PIPELINE_STAGES.indexOf(stage);
  return i < PIPELINE_STAGES.length - 1 ? PIPELINE_STAGES[i + 1] : null;
}

export function selectGlobalProgress(s: PipelineState): number {
  return s.globalScrubProgress;
}
