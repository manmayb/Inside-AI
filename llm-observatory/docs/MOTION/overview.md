# Motion system overview

**Goals:** Guide attention, support comprehension, reduce simultaneous movement.

**Implementation:** Framer Motion + CSS keyframes in `globals.css` + timing in `src/motion/neuralMotion.ts`.

---

## Philosophy

| Do | Don't |
|----|-------|
| Slow, intentional chapter cross-fades | Multiple looping effects on one screen |
| Pulse on **active** region chip only | Full-brain neuron storms in Beginner |
| Stagger content after header | Background grid drift + rivers + particles at full intensity |
| Pause respects user (`isPaused`) | Motion that cannot be paused |

---

## Timing tokens

`src/motion/neuralMotion.ts`:

| Token | ~Value | Use |
|-------|--------|-----|
| `NEURAL_TIMING.signalPulse` | 2.8s | Region pulse, path dash |
| `NEURAL_TIMING.collapseBeat` | 0.55s | Token selection emphasis |
| `signalEase` | cubic-bezier | Chapter content enter |

Structured for optional future audio sync — do not add sound without updating this doc.

---

## Framer Motion patterns

| Location | Pattern |
|----------|---------|
| `ChapterScene` | `AnimatePresence mode="wait"` on `currentStage` |
| `PreJourneyIntro` | Slide step transitions |
| `ChapterScene` main | `initial opacity/y` + delayed content |
| Section viz | Component-local `motion.*` |

Central variants: `src/motion/stageTransitions.ts` (`panelChild`, etc.) for `GlassPanel`.

---

## CSS keyframes (globals.css)

| Keyframe | Purpose |
|----------|---------|
| `orb-drift` | Ambient orbs — very slow |
| `fog-breathe` | Volumetric fog opacity |
| `token-resonance` | Active semantic token scale |
| `fade-up` | Utility `.animate-fade-up` |

---

## Accessibility considerations

- Respect `prefers-reduced-motion` — **TODO** (roadmap): gate ambient canvas and non-essential loops.  
- Auto-advance always pausable (Space).  
- No motion-only information — copy always states the idea in text.

---

## Related

- [transitions.md](./transitions.md)  
- [../VISUAL_SYSTEM/overview.md](../VISUAL_SYSTEM/overview.md)  
