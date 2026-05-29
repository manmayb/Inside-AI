# Technical debt

| Item | Impact | Notes |
|------|--------|-------|
| Legacy layout components unused | Confusion | `layout/*`, `HomeView`, `BrainJourney` |
| `ViewMode` IDs `engineer`/`research` | Naming drift | UI says Curious/Advanced |
| Uneven Beginner gating in some sections | UX | embedding, streaming, analytics denser |
| No automated tests | Regression risk | Priority: welcome → submit → chapter advance |
| `gsap` unused in package.json | Bundle | Remove |
| Scrubber store logic without prominent UI | Dead-ish code | Dots replace rail; scrub API remains |
| `NeuralBackground` R3F unused on welcome | Dead code path | Remove or reintroduce subtly |

When fixing debt, update this file and add ADR if architectural.
