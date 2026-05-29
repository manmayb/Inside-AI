# NeuralUniverse

**Path:** `src/components/environment/NeuralUniverse.tsx`  
**Mounted via:** `AmbientShell`

## Responsibility

Subtle canvas particle field + sparse connection lines. Atmosphere only — not a data visualization.

## Props

| Prop | Default | Effect |
|------|---------|--------|
| `calm` | `true` | ~35 particles, lower opacity |

## Performance

Single `requestAnimationFrame` loop; resize-aware. Avoid increasing particle count without profiling.

## UX role

Background “alive” feeling without dashboard noise. No tensor rivers or megastructures (removed in Thought Museum).
