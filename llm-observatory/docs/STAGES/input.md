# Chapter 1: input

| Field | Value |
|-------|-------|
| **ID** | `input` |
| **Beginner label** | Receiving your words |
| **Region** | Receiving (`ingress`) |
| **Section** | `InputSection.tsx` |
| **Duration** | ~1200ms @ 1× |

## Purpose

Introduce the idea that the user's message **arrives** at the model — a handoff from person to system.

## Beginner experience

- **Metaphor:** “Your words travel from you to the AI.”  
- **Viz:** You ↔ AI simple icon flow with gentle motion  
- **Insight:** `SimpleInsight` one-liner  
- **No** request payload JSON  

## Curious / Advanced

- `StageSectionHeader`, latency/size `MetricCard`s  
- Advanced: JSON payload `GlassPanel`  

## State dependencies

`prompt`, `networkLatencyMs`, `packetSize`, `stageProgress`, `config`

## Interactions

Passive watch (Beginner). Inspect metrics/payload (Advanced).

## Motion

Arrow pulse between You and AI icons tied loosely to `stageProgress`.
