# Antigravity IDE — Project Context
#
# This file is read automatically by the Antigravity IDE at session start.
# It supplements AGENTS.md with IDE-specific behaviour and session priming.
# Do NOT duplicate rules here — defer to AGENTS.md for all canonical rules.

project_name: Inside AI — LLM Observatory
project_root: llm-observatory/
framework: Next.js (App Router)
language: TypeScript

# ── Agent behaviour ─────────────────────────────────────────────────────────

rules_file: AGENTS.md          # canonical rules — read this before any action
read_rules_on_session_start: true
halt_on_protected_file: true   # stop and ask before touching protected files

protected_files:
  - src/store/pipelineStore.ts
  - src/app/globals.css
  - src/lib/pipeline.ts
  - src/lib/inference.ts

# ── Change annotation policy ─────────────────────────────────────────────────

change_annotation:
  existing_lines: "// CHANGED: [one-line reason]"
  new_files: header_comment_block   # purpose, scope, creation date

# ── Design system ────────────────────────────────────────────────────────────

design_identity: Thought Museum   # calm · warm · documentary — no neon/glow/cyberpunk

tokens_source: src/app/globals.css
allowed_tokens:
  - --void
  - --deep
  - --elevated
  - --surface
  - --accent
  - --text
  - --muted

fonts:
  display: Fraunces
  body: DM Sans
  mono: IBM Plex Mono   # Advanced-tier metrics only

accent_control: data-accent   # attribute on app root — never hardcode colours

motion:
  constants_file: src/lib/neuralMotion.ts
  respect_pause_flag: true      # check isPaused store flag on every animation
  respect_reduced_motion: true  # honour prefers-reduced-motion media query

# ── Architecture constraints ──────────────────────────────────────────────────

architecture:
  simulation_logic: src/lib/      # zero React imports here
  state: src/store/pipelineStore.ts   # single store — no secondary stores
  presentation:
    - src/components/journey/
    - src/components/home/
    - src/sections/
    - src/viz/
  orchestration: src/hooks/usePipelineRunner.ts   # 50 ms tick — do not break
  prelude_state: React local state in ObservatoryApp (not Zustand until submitPrompt)

# ── UX rules ─────────────────────────────────────────────────────────────────

ux:
  default_mode: beginner
  beginner_restrictions:
    - logits
    - heatmaps
    - tensors
    - raw numeric metrics
  submit_prompt_guard: after prelude Begin step only (ADR-004)
  layout: bottom-transport + dot-progress   # no sidebars / always-visible panels
  chapter_requirements:
    - exactly one focal visualization
    - exactly one plain-language summary (visible without interaction)
  retired_components:
    - TopBar
    - StageRail
    - BrainJourney
    - TimelineScrubber
    - PromptBanner
    - TokenConsciousness
    - MiniPipelineMap

# ── Documentation parity ─────────────────────────────────────────────────────

docs_parity:
  require_docs_update_with_code: true
  new_stage_checklist:
    - PIPELINE_STAGES constant
    - STAGE_META entry
    - STAGE_TIPS entry
    - brainRegions.ts entry
    - section component + StageContent.tsx wiring
    - docs/STAGES/<id>.md

# ── Verification before task close ───────────────────────────────────────────

verification:
  - npm run build        # must pass with zero errors
  - npm run lint         # must pass
  - beginner_view_check  # no Advanced-only content visible
  - motion_pause_check   # isPaused respected
  - docs_updated         # relevant docs/ files updated
  - no_hardcoded_colours
  - no_secondary_store
  - no_react_in_lib

# ── Suggestions for the IDE ───────────────────────────────────────────────────

hints:
  - "Before any edit, read the target file and state what you found."
  - "Propose every change as a diff or before/after block and wait for approval."
  - "If a task touches a protected file, stop and explain why before proceeding."
  - "Do not restore retired components — they are permanently removed by design."
  - "Accent colour is always --accent. Never write teal, violet, or amber directly."
