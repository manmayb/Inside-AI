# ADR-002: Beginner mode as default

## Status
Accepted

## Context
Defaulting to technical density (former “engineer” mode) intimidated first-time users.

## Decision
- `viewMode` default: `beginner`  
- Persist user choice in `localStorage`  
- Gate technical UI via `LearningDetail` / `AdvancedDetail`  
- Product labels: Beginner / Curious / Advanced  

## Consequences

- ✅ Workshop-friendly out of the box  
- ⚠️ Internal IDs remain `engineer` / `research` — renaming would break persisted prefs  
