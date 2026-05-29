# AttentionArcs

**Path:** `src/components/viz/AttentionArcs.tsx`  
**Stage:** `attention`

## UX purpose (Beginner)

“The AI decides which words matter most” — synapse-like arcs between semantic tokens.

## Dependencies

`attention` matrix, `tokens`, `selectedTokenIndex`, `compareTokenIndex`

## Interactions

Click token; Shift+click compare (Curious+).

## Motion

Beam travel along arcs; intensity from attention weights (heuristic).
