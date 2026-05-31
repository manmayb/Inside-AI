# Inside AI — Documentation Review Pack

**Purpose:** Single document for external AI review (Claude, GPT, etc.). It summarizes all material under `llm-observatory/docs/` plus essential code context. For full detail, follow links to individual docs.

**Repo:** `Inside-AI/llm-observatory` · **Stack:** Next.js 16 · React 19 · Zustand · Framer Motion · TypeScript · Tailwind v4

---

## How to use this pack (for the reviewing AI)

You are reviewing **Inside AI** — a browser-only educational app that simulates LLM inference as a 15-chapter guided documentary.

**Suggested review angles:**

| Angle | Focus |
|-------|--------|
| Product coherence | Does UX match vision (beginner-first, honest simulation)? |
| Architecture | Is single-store + client-only simulation appropriate? |
| Doc ↔ code drift | Do described flows match likely implementation? |
| UX decisions | Are ADRs still valid? Any dashboard regression risk? |
| Gaps | Missing stage docs, tests, accessibility, debt items |
| Copy & learning | Progressive disclosure, tone, glossary coverage |

**Non-negotiable constraints** (from product + ADRs):

- Default UX is **scene-based chapters**, not a multi-panel dashboard.
- **No real LLM APIs** without explicit feature flag + docs.
- **Beginner default** — no logits/heatmaps/tensors as primary focal visuals.
- **Prelude before simulation** — `submitPrompt` only after prelude **Begin**.
- **Docs must stay in sync** with architecture/flow changes.

**Critical code paths** (verify against `src/` if doing deep review):

```
src/app/page.tsx → ObservatoryApp
  → welcome | prelude | DocumentaryJourney
  → usePipelineRunner (50ms) → ChapterScene → StageSection
  → pipelineStore + src/lib/* simulation
```

---

## 1. Executive summary

**One line:** A calm, chapter-based browser journey through a **simulated** AI mind — from your words arriving to a reply streaming back.

**User path:**

```
Welcome → Prelude (3 ideas + ready) → 15 chapters → Finale
```

**What it is:** Interactive educational documentary for non-engineers.  
**What it is NOT:** Real LLM client, observability platform, benchmark, or GPU monitor.

**Names:**

| Context | Name |
|---------|------|
| UI | Inside AI |
| Folder / npm | `llm-observatory` |
| Legacy internal | Neural Observatory |

**Success criteria:**

- First-time user grasps product in **< 10 seconds** on welcome.
- Beginners never *must* understand tensors/logits/embeddings to proceed.
- Documentation is the source of truth — not chat history.

---

## 2. Product

### Vision & goals

After the journey, users should:

1. **Feel** AI processing as understandable steps — not magic.
2. **Remember** receive → break apart → mean → remember → think → choose → speak.
3. **Know** they can go deeper (Curious / Advanced) when ready.

### Principles

| Principle | Meaning |
|-----------|---------|
| Guided documentary | One chapter, one idea, one focal visualization |
| Emotional safety | Calm pacing, plain language, no control-room density |
| Progressive depth | Beginner default; jargon opt-in |
| Honest simulation | All in-browser; stated clearly |

### Audience

| Persona | Needs |
|---------|-------|
| **Curious beginner** (primary) | One headline, one button, one idea per screen |
| **Technical explorer** | Correct terms gradually; heatmaps behind disclosure |
| **Educator / presenter** | Beginner default, no API keys, predictable flow |

**Anti-personas:** ML researchers benchmarking models, platform engineers tracing prod LLMs, users seeking a chat product.

### Brand voice

Warm, clear, human. Museum tour / science documentary — **not** cyberpunk dashboard.  
Avoid: “neural cathedral,” “tensor storm,” dense monospace on primary UI.

**Full docs:** [PRODUCT/vision.md](../PRODUCT/vision.md) · [identity.md](../PRODUCT/identity.md) · [audience.md](../PRODUCT/audience.md)

---

## 3. UX & experience flow

### Core thesis

Beginners learn from **focused scenes**, not persistent multi-panel workspaces. Rejected: sidebar rails, always-visible full brain, scrubber + top bar + stage panel simultaneously.

### Phases (`ObservatoryApp` local state)

| Phase | Component | Store `active` | Purpose |
|-------|-----------|----------------|---------|
| `welcome` | `WelcomeScreen` | `false` | Entry, prompt, collapsed settings |
| `prelude` | `PreJourneyIntro` | `false` | Expectations; **no simulation yet** |
| `journey` | `DocumentaryJourney` | `true` | 15 chapters after `submitPrompt()` |

```
welcome ──(Start the journey)──► prelude ──(Begin)──► journey
   ▲                                                    │
   └──────────── reset / exit ──────────────────────────┘
```

**Why prelude is separate:** Artifacts are not built until user confirms readiness.

### Journey chapter shell

```
usePipelineRunner (50ms) → currentStage + stageProgress
  → ChapterScene (title, summary, brain focus chip)
  → StageSection → sections/*Section.tsx
  → SceneChrome + SceneProgress
```

### Navigation philosophy

| Tier | Mechanism |
|------|-----------|
| Primary | Auto-play through chapters |
| Secondary | Bottom transport (pause, prev/next) |
| Tertiary | Dot progress (jump to completed) |
| Quaternary | Menu (depth, glossary, exit) |

No permanent sidebar in documentary flow.

### Keyboard shortcuts (journey)

| Key | Action |
|-----|--------|
| Space | Pause / resume |
| Shift + ← / → | Previous / next chapter |
| ⌘/Ctrl + Enter | Start journey (welcome) |

**Full docs:** [UX/philosophy.md](../UX/philosophy.md) · [experience-flow.md](../UX/experience-flow.md)

---

## 4. Design system

### Thought Museum (visual)

- **Fonts:** Fraunces (display) + DM Sans (body); IBM Plex Mono for Advanced metrics only.
- **Surfaces:** `.museum-card`, `.museum-card-elevated`, `.btn-primary`, `.btn-ghost`
- **Tokens:** `--void`, `--deep`, `--elevated`, `--surface`, `--accent`, `--text`, `--muted` in `globals.css`
- **Atmosphere:** `NeuralUniverse` canvas (~35 particles, calm), `AmbientShell` fog/orbs, low-opacity noise
- **Removed from default:** grid drift, tensor rivers, megastructures, holographic frames

### Motion

- Framer Motion + `neuralMotion.ts` timing + CSS keyframes
- Slow chapter cross-fades; stagger content after header; pause respects `isPaused`
- **TODO:** `prefers-reduced-motion` for ambient canvas (roadmap)

### Theming

| UI label | ID | CSS |
|----------|-----|-----|
| Sage | `teal` | `[data-accent="teal"]` |
| Lavender | `violet` | `[data-accent="violet"]` |
| Warm | `amber` | `[data-accent="amber"]` |

App root also sets `data-view` (viewMode) and `data-phase` (welcome/prelude/journey).

**Full docs:** [DESIGN/principles.md](../DESIGN/principles.md) · [VISUAL_SYSTEM/](../VISUAL_SYSTEM/) · [MOTION/](../MOTION/) · [THEMING/overview.md](../THEMING/overview.md)

---

## 5. Architecture

### Layers

```
Presentation   → home/, journey/, sections/, viz/, ui/
Orchestration  → usePipelineRunner, useLearningDepth, useKeyboardShortcuts
State          → pipelineStore.ts (Zustand)
Simulation     → src/lib/* (no React)
Shell          → app/layout.tsx, page.tsx, globals.css
```

**Client-only SPA.** No backend API. All inference simulated in TypeScript.

### App structure

- **Phase state** is React local in `ObservatoryApp` until `submitPrompt`.
- **Dynamic imports:** `NeuralUniverse`, `ArtificialBrain` (legacy) — no SSR for canvas/SVG heavy viz.
- **Next config:** `transpilePackages: ['three']`

### Data flow (prompt → UI)

**Once on `submitPrompt`:**

```
tokenize → buildEmbeddings → buildContextBlocks → buildAttentionMatrix
  → buildLogits → buildKVCache → buildHiddenStateSlices → simulateResponse
```

Stored in Zustand; **not** recomputed on chapter change.

**Continuous (runner):**

```
usePipelineRunner (50ms) → advanceProgress / setStage
  → ChapterScene → StageSection → store selectors
```

**Exceptions:**

- `streaming` stage: `appendStreamToken` mutates `streamedText`
- `autoregressive` stage: periodic `refreshLogits(arStep)`

**Full docs:** [ARCHITECTURE/overview.md](../ARCHITECTURE/overview.md) · [app-structure.md](../ARCHITECTURE/app-structure.md) · [data-flow.md](../ARCHITECTURE/data-flow.md)

---

## 6. State management

**Single Zustand store:** `src/store/pipelineStore.ts`

| Category | Examples |
|----------|----------|
| Navigation | `currentStage`, `stageProgress`, `stageStatuses`, `isPaused`, `playbackSpeed` |
| Session | `active`, `prompt`, `generationComplete` |
| Prefs | `viewMode`, `themeAccent`, `modelPreset`, `ragEnabled`, `config` |
| Artifacts | `tokens`, `embeddings`, `attention`, `logits`, `streamedText`, … |
| Interaction | `selectedTokenIndex`, `selectedHead`, `inspectedLayer` |

### Key actions

| Action | Notes |
|--------|-------|
| `submitPrompt(prompt)` | Runs all lib builders; sets `active`; **only after prelude Begin** |
| `advanceProgress(delta)` | 0–100 for current stage |
| `jumpToStage` / `goToNextStage` / `goToPrevStage` | Manual navigation |
| `scrubToGlobal(progress)` | Legacy scrub math via `tourProgress.ts` |
| `reset()` | Clears session; **keeps** user prefs |
| `rerunTour()` | Re-runs `submitPrompt` with same prompt |

### Persistence

- Key: `neural-observatory-prefs`
- Hydrated by `PreferencesHydrator` on mount
- Fields: `viewMode`, `playbackSpeed`, `ragEnabled`, `themeAccent`, `modelPreset`

**Full docs:** [STATE_MANAGEMENT/](../STATE_MANAGEMENT/)

---

## 7. Pipeline & stage machine

### Stage order (15 chapters)

```
input → tokenization → embedding → context → transformer →
attention → gpu → hidden → logits → autoregressive → kvcache →
safety → rag → streaming → analytics
```

**Source of truth:** `PIPELINE_STAGES` in `src/types/pipeline.ts`  
**Durations:** `STAGE_META[id].durationMs` in `src/lib/constants.ts` (~1–3s @ 1×)

### Lifecycle

1. **Idle** — welcome/prelude, `active === false`
2. **Build** — `submitPrompt` materializes artifacts
3. **Play** — runner advances progress
4. **Complete** — `generationComplete`, `computeMetrics()`
5. **Reset** — `reset()` or new question

### Status logic

`buildStageStatuses(current, progress)`: past = complete, current = active, future = pending. Powers `SceneProgress` dots.

### Adding a stage (checklist)

1. Append `PIPELINE_STAGES`
2. Add `STAGE_META`
3. Add `STAGE_TIPS` in `stageTips.ts`
4. Map in `brainRegions.ts`
5. Create `sections/NewSection.tsx` + register in `StageContent.tsx`
6. Add `docs/STAGES/<id>.md`

**Full docs:** [PIPELINE/](../PIPELINE/) · [STAGES/README.md](../STAGES/README.md)

---

## 8. All 15 chapters (summary)

| # | ID | Beginner label | Region | Primary viz / section |
|---|-----|----------------|--------|------------------------|
| 1 | `input` | Receiving your words | Receiving | You ↔ AI flow (`InputSection`) |
| 2 | `tokenization` | Breaking into pieces | Understanding words | `SemanticToken` glyphs |
| 3 | `embedding` | Finding meaning | Understanding words | `EmbeddingSpace` / latent viz |
| 4 | `context` | Building memory | Memory | Context blocks |
| 5 | `transformer` | Thinking deeper | Deep thinking | `TransformerStack`, `TransformerCity` |
| 6 | `attention` | What matters most | Deep thinking | `AttentionArcs`, heatmap (Curious+) |
| 7 | `gpu` | Fast parallel thought | Deep thinking | `ComputeChamber`, `MatrixMultiply` |
| 8 | `hidden` | Ideas evolving | Deep thinking | `HiddenStateFlow` |
| 9 | `logits` | Choosing next words | Choosing words | `ProbabilityField`, `LogitBars` |
| 10 | `autoregressive` | Writing step by step | Choosing words | Sampling + logit refresh |
| 11 | `kvcache` | Remembering past work | Memory | KV / `TensorGrid` |
| 12 | `safety` | Checking safety | Speaking back | Moderation scores |
| 13 | `rag` | Looking things up | Memory | `RAGSection` (placeholder if disabled) |
| 14 | `streaming` | Speaking back | Speaking back | Streamed text append |
| 15 | `analytics` | Journey complete | Speaking back | Metrics (Advanced) |

**Copy source:** `src/lib/stageTips.ts` — per stage × viewMode (`beginner` | `engineer` | `research`).

**Doc coverage:** Full docs for chapters 1–3; chapters 4–15 summarized in [STAGES/_remaining-chapters.md](../STAGES/_remaining-chapters.md) (roadmap: expand individually).

---

## 9. Simulation engine

**Location:** `src/lib/` — pure TypeScript, **no React imports**.

| Module | Role |
|--------|------|
| `tokenizer.ts` | Greedy BPE-style split → `TokenUnit[]` |
| `inference.ts` | Embeddings, context, attention, logits, KV, response |
| `analytics.ts` | Metrics, FLOPs estimates |
| `constants.ts` | `DEFAULT_CONFIG`, `STAGE_META` |
| `modelPresets.ts` | Compact / Standard / Frontier configs |
| `tensorAnim.ts` | GPU viz helpers |
| `tourProgress.ts` | Global scrub math |
| `brainRegions.ts` | Stage → cognitive region |
| `stageTips.ts` | Educational copy |
| `glossary.ts` | Static terms |
| `persistence.ts` | localStorage |

**Fidelity disclaimer:** Attention, logits, embeddings are **heuristic** (seeded noise, position influence) — **not** from a trained model. Must be disclosed in any export.

**Extension points:** Replace tokenizer; server weight JSON; live API behind flag.

**Full doc:** [SIMULATION_ENGINE/overview.md](../SIMULATION_ENGINE/overview.md)

---

## 10. Learning system

| UI label | `ViewMode` ID | Flags |
|----------|---------------|-------|
| Beginner | `beginner` | No technical, no metrics, calm layout |
| Curious | `engineer` | Technical on, metrics off |
| Advanced | `research` | Technical + metrics |

**Default:** Beginner (persisted).

**Progressive disclosure (in order):**

1. Chapter title + plain summary
2. `SimpleInsight` (one sentence)
3. `LearningDetail` (Curious+)
4. `AdvancedDetail` (metrics, JSON, FLOPs)

**Beginner-only:** `ChapterBrainFocus` region chip (not full `ArtificialBrain` map).

**Gating components:** `LearningDetail`, `AdvancedDetail`, `Equation`, `StageSectionHeader`  
**Hook:** `useLearningDepth.ts`

**Full docs:** [LEARNING_SYSTEM/](../LEARNING_SYSTEM/)

---

## 11. Components

### Active path (documentary journey)

`ObservatoryApp` → `WelcomeScreen` / `PreJourneyIntro` → `DocumentaryJourney` → `ChapterScene` → `StageSection` → `SceneChrome` + `SceneProgress` → `JourneyComplete`

### Key visualizations

| Component | Stage | Beginner role |
|-----------|-------|---------------|
| `AttentionArcs` | attention | Synapse arcs between tokens |
| `ProbabilityField` | logits | Collapse to chosen word |
| `SemanticToken` | tokenization, attention | Token glyphs |
| `NeuralUniverse` | ambient | Background particles only |
| `TransformerCity` | transformer | Layer megastructure |
| `ComputeChamber` | gpu | Matrix reactors |

### Legacy (dashboard era — **not mounted**)

`TopBar`, `StageRail`, `BrainJourney`, `TimelineScrubber`, `PromptBanner`, `TokenConsciousness`, `MiniPipelineMap`, `HomeView`, `WelcomeIntro`, full `ArtificialBrain` in default flow.

**Do not restore without new ADR.**

**Full doc:** [COMPONENTS/README.md](../COMPONENTS/README.md)

---

## 12. Architecture Decision Records (ADRs)

| ID | Decision | Consequence |
|----|----------|-------------|
| **001** Scene-based UX over dashboard | Full-screen chapters; minimal chrome | Lower cognitive load; power users lose always-visible scrubber |
| **002** Beginner default | `viewMode: beginner` persisted | Workshop-friendly; internal IDs still `engineer`/`research` |
| **003** Contextual brain focus | `ChapterBrainFocus` chip vs always-on `ArtificialBrain` | Less noise; full map optional future feature |
| **004** Prelude before simulation | `submitPrompt` only on prelude **Begin** | Clear onboarding; phase state local to `ObservatoryApp` |
| **005** Single Zustand store | One `pipelineStore` for nav + artifacts + prefs | Simple runner sync; large store file acceptable |

**Full docs:** [DECISIONS/README.md](../DECISIONS/README.md)

---

## 13. Workflows (technical)

### Bootstrap

```
layout.tsx → page.tsx → ObservatoryApp
  → PreferencesHydrator.hydratePrefs()
  → AmbientShell → WelcomeScreen
```

### Start journey

```
WelcomeScreen.onStartJourney(prompt) → phase=prelude, pendingPrompt
PreJourneyIntro.onBegin → submitPrompt(pendingPrompt) → phase=journey, active=true
  → usePipelineRunner interval starts
```

### Auto-advance

50ms tick; `STAGE_META.durationMs`; respects pause/speed. Special cases: AR → `refreshLogits`; streaming → `appendStreamToken`.

### Exit

`SceneChrome` → `reset()` + `onExit()` → phase `welcome`.

**Full doc:** [WORKFLOWS/README.md](../WORKFLOWS/README.md)

---

## 14. Performance & stack

| Concern | Approach |
|---------|----------|
| Simulation cost | Runs once at `submitPrompt`; keep O(n) on token count |
| Canvas | Single `NeuralUniverse` rAF loop, calm mode |
| 3D | R3F not on critical path; dynamic import where used |
| Re-renders | Narrow Zustand selectors; `ChapterScene` keyed on `currentStage` |
| Bundle | Remove unused `gsap` (debt item) |

**Dependencies:** Next 16.2, React 19, Zustand 5, Framer Motion 12, D3 7, Three/R3F (optional viz), Tailwind 4.

**Full doc:** [PERFORMANCE/overview.md](../PERFORMANCE/overview.md)

---

## 15. Technical debt & roadmap

### Known debt

| Item | Impact |
|------|--------|
| Legacy `layout/*` unused | Contributor confusion |
| `ViewMode` ID naming drift | UI says Curious/Advanced; code says engineer/research |
| Uneven Beginner gating | embedding, streaming, analytics denser than ideal |
| No automated tests | Regression risk on welcome → chapter flow |
| Unused `gsap`, `NeuralBackground` R3F | Dead code / bundle |
| Scrubber store logic without prominent UI | Partially dead API |

### Roadmap highlights

- **Near:** Complete STAGES docs 4–15, `prefers-reduced-motion`, remove legacy dashboard, drop gsap
- **Medium:** Optional full brain map (Curious+), stronger Beginner simplification, ViewMode ID migration
- **Long:** Real tokenizer plug-in, optional server weights, i18n, Playwright smoke tests

**Full docs:** [ROADMAP/overview.md](../ROADMAP/overview.md) · [technical-debt.md](../ROADMAP/technical-debt.md)

---

## 16. Contributing & doc maintenance

### PR expectations

- Match documentary UX (no dashboard regression)
- Beginner path tested manually
- **Update docs in same PR** when changing flows, stages, tokens
- `npm run build` and `npm run lint` pass

### When docs MUST update

| Change | Update |
|--------|--------|
| Flow / phase | UX, ARCHITECTURE, WORKFLOWS |
| Stage | STAGES/, PIPELINE/, stageTips |
| Store shape | STATE_MANAGEMENT/ |
| Visual tokens | VISUAL_SYSTEM/, THEMING/ |
| Major UX choice | New ADR in DECISIONS/ |

**Full docs:** [CONTRIBUTING/](../CONTRIBUTING/) · [AI/contributor-guide.md](./contributor-guide.md)

---

## 17. Critical file map

| Path | Purpose |
|------|---------|
| `src/components/ObservatoryApp.tsx` | Phase router |
| `src/components/journey/DocumentaryJourney.tsx` | Journey shell |
| `src/components/journey/ChapterScene.tsx` | Chapter layout |
| `src/components/sections/StageContent.tsx` | Stage → section router |
| `src/store/pipelineStore.ts` | Zustand store |
| `src/hooks/usePipelineRunner.ts` | 50ms auto-advance |
| `src/hooks/useLearningDepth.ts` | View mode flags |
| `src/types/pipeline.ts` | `PIPELINE_STAGES`, types |
| `src/lib/stageTips.ts` | Chapter copy |
| `src/lib/inference.ts` | Simulation core |
| `src/app/globals.css` | Thought Museum tokens |

---

## 18. Suggested prompts for external review

Copy one of these when handing this pack to another AI:

**Product & UX**

> Read this review pack. Evaluate whether the product vision, UX philosophy, and ADRs are coherent. Flag contradictions, missing personas, or places where Beginner mode might still feel like a developer tool.

**Architecture**

> Assess the client-only single-store architecture for this educational simulator. What would break first at 10× complexity? Is the prelude/local-phase split sound?

**Documentation quality**

> Compare this pack to the linked doc tree. What is under-documented? Which roadmap/debt items are highest risk? Propose a prioritized doc backlog.

**Implementation readiness**

> Assume you will implement the next sprint from the roadmap. List the top 5 changes you'd make, dependencies between them, and which docs must update for each.

---

## 19. Full documentation index

All paths relative to `llm-observatory/docs/`.

| Folder | Contents |
|--------|----------|
| [README.md](../README.md) | Documentation hub |
| [PRODUCT/](../PRODUCT/) | vision, identity, audience |
| [UX/](../UX/) | philosophy, experience-flow |
| [DESIGN/](../DESIGN/) | principles |
| [VISUAL_SYSTEM/](../VISUAL_SYSTEM/) | overview, typography, surfaces |
| [MOTION/](../MOTION/) | overview, transitions |
| [THEMING/](../THEMING/) | accent moods |
| [ARCHITECTURE/](../ARCHITECTURE/) | overview, app-structure, data-flow |
| [STATE_MANAGEMENT/](../STATE_MANAGEMENT/) | overview, actions, persistence |
| [PIPELINE/](../PIPELINE/) | overview, lifecycle, stage-machine |
| [STAGES/](../STAGES/) | 15 chapters (+ `_remaining-chapters.md`) |
| [SIMULATION_ENGINE/](../SIMULATION_ENGINE/) | lib modules |
| [LEARNING_SYSTEM/](../LEARNING_SYSTEM/) | depth modes, copy, disclosure |
| [COMPONENTS/](../COMPONENTS/) | journey shell, viz, legacy list |
| [WORKFLOWS/](../WORKFLOWS/) | bootstrap, submit, advance, exit |
| [PERFORMANCE/](../PERFORMANCE/) | canvas, bundle, re-renders |
| [DECISIONS/](../DECISIONS/) | ADR-001 through ADR-005 |
| [ROADMAP/](../ROADMAP/) | planned work, technical debt |
| [CONTRIBUTING/](../CONTRIBUTING/) | setup, maintenance, PR rules |
| [AI/](../AI/) | contributor-guide, **this review pack** |
| [REFERENCE/](../REFERENCE/) | shortcuts, file map, glossary pointer |
| [SETUP.md](../SETUP.md) | Deprecated → CONTRIBUTING/setup |
| [WORKFLOWS.md](../WORKFLOWS.md) | Deprecated → WORKFLOWS/README |

---

*Generated as a consolidated summary of the Inside AI documentation system. Last aligned with docs as of project import — verify critical paths in `src/` before acting on review findings.*
