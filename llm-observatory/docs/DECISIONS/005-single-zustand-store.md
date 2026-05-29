# ADR-005: Single Zustand pipeline store

## Status
Accepted

## Context
Alternative: split navigation store vs artifact store vs prefs store.

## Decision
One `pipelineStore` for navigation, artifacts, session flags, and prefs hydration fields.

## Consequences

- ✅ Simple data flow for runner + sections  
- ✅ Single place to document state  
- ⚠️ Large store file — acceptable for current scale  
