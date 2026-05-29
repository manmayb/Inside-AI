# Documentation maintenance

Documentation is **part of the product**. Treat doc updates as required work, not optional.

---

## When you MUST update docs

| Change type | Update |
|-------------|--------|
| New/changed app phase or flow | `UX/experience-flow.md`, `ARCHITECTURE/`, `WORKFLOWS/` |
| New/changed stage | `STAGES/<id>.md`, `PIPELINE/`, `stageTips.ts` comment in doc |
| Zustand shape or action | `STATE_MANAGEMENT/` |
| Visual tokens / fonts | `VISUAL_SYSTEM/`, `THEMING/` |
| Motion timing | `MOTION/`, `neuralMotion.ts` header comment |
| Major UX/product choice | New ADR in `DECISIONS/` |
| New component in critical path | `COMPONENTS/` |

---

## Same PR rule

Architecture, UX, or flow changes **without** doc updates should not merge.

---

## Drift checks (periodic)

1. Compare `PIPELINE_STAGES` to `STAGES/README.md` table  
2. Compare `ObservatoryApp` phases to `UX/experience-flow.md`  
3. Root `README.md` links still valid  
4. Legacy components list in `COMPONENTS/README.md` still accurate  

---

## Deprecated docs

- Root `docs/SETUP.md` → points here  
- Old `docs/WORKFLOWS.md` → migrated to `WORKFLOWS/README.md`  

Do not duplicate long content at repo root — use `docs/` as source of truth.
