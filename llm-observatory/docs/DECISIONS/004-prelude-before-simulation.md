# ADR-004: Prelude phase before submitPrompt

## Status
Accepted

## Context
Submitting on welcome immediately built artifacts and started the runner, skipping emotional onboarding.

## Decision
- `ObservatoryApp` local phase `prelude` with `PreJourneyIntro`  
- `submitPrompt` only on **Begin** after 3 explainer slides + ready screen  
- Prompt held in React state until then  

## Consequences

- ✅ Sets expectations before simulation  
- ✅ Clear separation: education first, then mechanics  
- ⚠️ Phase state is local to `ObservatoryApp` — not in Zustand (intentional)  
