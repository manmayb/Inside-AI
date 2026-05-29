# Performance notes

## Client-only simulation

All heavy work runs once at `submitPrompt` on main thread. Keep builders O(n) on token count for typical prompts.

## Canvas ambient

`NeuralUniverse` — requestAnimationFrame loop, ~35 particles in calm mode. Single full-screen canvas.

## Dynamic import

| Component | Reason |
|-----------|--------|
| `NeuralUniverse` | `window` / canvas |
| `ArtificialBrain` | Legacy; optional |

## Three.js / R3F

`NeuralBackground.tsx` (home) and `LatentSpaceR3F` — not on critical documentary path. `transpilePackages: ['three']` in Next config.

## Bundle hygiene

- `gsap` in package.json but unused — candidate for removal  
- Prefer SVG/canvas for Beginner chapters over heavy 3D  

## Re-render discipline

- Zustand: section components should select minimal state slices  
- `ChapterScene` keys on `currentStage` to isolate transitions  

See [../ROADMAP/technical-debt.md](../ROADMAP/technical-debt.md).
