# Audience & personas

## Primary persona: **Curious beginner**

- Uses ChatGPT or similar weekly  
- Feels mild anxiety about “not understanding AI”  
- Wants intuition, not a CS degree  
- Will abandon if the UI feels like a developer tool  

**Needs:** One headline, one button, one idea per screen, optional depth.

---

## Secondary persona: **Technical explorer**

- Has heard of transformers, attention, tokens  
- Wants a **guided** visual before reading papers  
- Switches to Curious or Advanced mid-journey  

**Needs:** Correct terminology introduced gradually, heatmaps/equations behind disclosure.

---

## Tertiary persona: **Educator / presenter**

- Runs a workshop or demo  
- Needs Beginner default, reliable local run, no API keys  

**Needs:** Predictable 15-chapter flow, pause/skip, replay.

---

## Anti-personas (not our user)

| Anti-persona | Why |
|--------------|-----|
| ML researcher benchmarking models | Simulations are heuristic, not model-accurate |
| Platform engineer tracing prod LLMs | No real telemetry or API integration |
| User seeking a chat product | No real inference |

Design decisions that optimize for anti-personas (dense metrics-first UI) are **explicitly rejected**. See [../DECISIONS/001-scene-based-ux.md](../DECISIONS/001-scene-based-ux.md).
