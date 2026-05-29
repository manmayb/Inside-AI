# ProbabilityField

**Path:** `src/components/viz/ProbabilityField.tsx`  
**Stage:** `logits`

## UX purpose

Collapse many possible next words into **one chosen path** — probability as spatial field, not a metrics table.

## Dependencies

`logits`, sampling params from `config`

## Beginner vs Advanced

Beginner: animated collapse / highlight winner. Advanced: temperature, top-k/p controls.

## Motion

`collapse-chosen` CSS class on selected token per `globals.css`.
