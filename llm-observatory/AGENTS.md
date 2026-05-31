<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ
from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before
writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# INSIDE AI — Agent Operating Rules

> **Applies to:** Antigravity, Claude, Cursor, Copilot, Gemini, and any AI assistant.
> **Scope:** `llm-observatory/` monorepo.
> **Last updated:** 2026-05-31

These rules are non-negotiable. Deviation from any rule without explicit user instruction
is a failure, not a judgement call.

---

## § 1 — Code Integrity (MUST)

- Read every file **fully** before modifying it. State what you read. Propose changes
  as a before/after or unified diff block. **Wait for explicit approval before applying.**
- Add an inline comment on **every line changed** in existing files:
  ```
  // CHANGED: [one-line reason]
  ```
- New files get a header comment block — purpose, scope, and creation date.
- **Protected files — never touch without explicit user instruction:**
  | File | Why protected |
  |------|---------------|
  | `src/store/pipelineStore.ts` | Single source of truth for all runtime state |
  | `src/app/globals.css` | All design tokens live here — one wrong edit breaks the whole theme |
  | `src/lib/pipeline.ts` | Core simulation contract — stage order and timing |
  | `src/lib/inference.ts` | Simulated inference engine — stability-critical |

  Flag and explain before proceeding if a task requires touching these.
- Do **not** refactor working code opportunistically. Only change what the task requires.

---

## § 2 — Architecture (ARCH)

- All simulation logic lives in `src/lib/` — **zero React imports** in lib files.
- All application state lives in `pipelineStore.ts`. **No secondary stores.**
- Presentation changes → `components/journey/`, `components/home/`, `sections/`, `viz/`
- Simulation changes → `src/lib/*` only.
- Orchestration → `hooks/usePipelineRunner.ts` (50 ms tick contract — do not break).
- Prelude = React local state in `ObservatoryApp` — not Zustand until `submitPrompt`.

### Read-first docs before touching architecture

1. [`docs/PRODUCT/vision.md`](docs/PRODUCT/vision.md)
2. [`docs/UX/philosophy.md`](docs/UX/philosophy.md)
3. [`docs/DECISIONS/001-scene-based-ux.md`](docs/DECISIONS/001-scene-based-ux.md)
4. [`docs/ARCHITECTURE/app-structure.md`](docs/ARCHITECTURE/app-structure.md)

---

## § 3 — Visual & Theme (STYLE)

- Visual identity: **"Thought Museum"** — calm, warm, documentary.
  No cyberpunk. No neon. No glow effects. When in doubt, **subtract** rather than add.
- Use **only** these design tokens (all defined in `src/app/globals.css`):

  | Token | Role |
  |-------|------|
  | `--void` | Deepest background |
  | `--deep` | Panel backgrounds |
  | `--elevated` | Card / elevated surfaces |
  | `--surface` | Default surface |
  | `--accent` | Interactive / brand colour |
  | `--text` | Primary text |
  | `--muted` | Secondary / placeholder text |

  **No hardcoded hex / rgb / hsl values anywhere in the codebase.**

- Accent is user-controlled via `data-accent` attribute on the app root element.
  Never hardcode teal / violet / amber.

- Typography:

  | Font | Use |
  |------|-----|
  | `Fraunces` | Display / chapter titles (`.display-title`, `ChapterScene` only) |
  | `DM Sans` | Body copy, UI labels, all Beginner-facing text |
  | `IBM Plex Mono` | Advanced-tier metrics **only** — never on Beginner-facing UI |

- Motion: use `neuralMotion.ts` timing constants exclusively.
  All new animations must check the `isPaused` store flag and respect
  `prefers-reduced-motion`.

---

## § 4 — UX Constraints (UX)

- Default experience is always **Beginner mode**.
  Never surface logits, heatmaps, tensors, or raw numeric metrics in Beginner view.
- `submitPrompt()` must only be called **after** the prelude Begin step — never from
  Welcome or any earlier phase. **(ADR-004)**
- Each chapter must have exactly **one focal visualization** + **one plain-language summary**
  visible to Beginners without any interaction.
- No persistent sidebars, always-visible progress panels, or navigation rails in
  documentary flow. Use **bottom-transport + dot-progress** only.
- **Do not restore** any of these legacy components — they are permanently retired:

  `TopBar` · `StageRail` · `BrainJourney` · `TimelineScrubber` ·
  `PromptBanner` · `TokenConsciousness` · `MiniPipelineMap`

### UI component conventions

| Element | Component / class |
|---------|-------------------|
| Chapter headlines | `.display-title` inside `ChapterScene` only |
| Chapter sections | `StageLayout` (compact) or `CinematicScene` (immersive) |
| Panels | `.museum-card` / `GlassPanel` — hero focal uses `variant="hero"` |
| CTAs | `.btn-primary` |
| Motion hook | `useMotionPreferences` + `neuralMotion.ts` |

### Naming conventions

| Kind | Convention |
|------|------------|
| Stage sections | `FooSection.tsx` in `sections/` |
| Viz components | `PascalCase` in `viz/` |
| ViewMode IDs | `beginner` \| `engineer` \| `research` (UI labels: Beginner / Curious / Advanced) |

### Do not break

- `submitPrompt` artifact build sequence
- `PreferencesHydrator` + `persistence.ts` key
- `useLearningDepth` gating pattern
- `ChapterScene` single-focus layout

---

## § 5 — Documentation Parity (ARCH)

- Any change to a stage, flow, store shape, visual token, or major UX decision requires
  a `docs/` update **in the same task**. List the doc files to update before writing code.
- Adding a **new stage** requires all six checklist steps — no partial additions:

  | # | Step |
  |---|------|
  | 1 | `PIPELINE_STAGES` constant updated |
  | 2 | `STAGE_META` entry added |
  | 3 | `STAGE_TIPS` entry added |
  | 4 | `brainRegions.ts` entry added |
  | 5 | Section component created + wired into `StageContent.tsx` |
  | 6 | `docs/STAGES/<id>.md` documentation file created |

  Reference: [`docs/PIPELINE/stage-machine.md`](docs/PIPELINE/stage-machine.md) ·
  [`docs/STAGES/README.md`](docs/STAGES/README.md)

---

## § 6 — After Every Change (Verification Checklist)

Do not mark a task complete until all boxes are checked:

- [ ] `npm run build` passes with **zero errors**
- [ ] `npm run lint` passes
- [ ] Beginner view tested — no Advanced-only content visible
- [ ] Motion respects `isPaused` flag and `prefers-reduced-motion`
- [ ] Relevant `docs/STAGES/<id>.md` updated
- [ ] [`docs/WORKFLOWS/README.md`](docs/WORKFLOWS/README.md) updated if any flow changed
- [ ] No hardcoded colors or fonts introduced
- [ ] No secondary Zustand store created
- [ ] No React import added to any `src/lib/` file
