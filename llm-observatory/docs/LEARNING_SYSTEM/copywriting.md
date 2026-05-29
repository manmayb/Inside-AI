# Copywriting principles

## Voice

- Second person sparingly (“your words,” “you’ll see”)  
- Active, concrete verbs  
- No fear-mongering about AI  
- Acknowledge simulation honestly  

## Beginner titles

Use `STAGE_META[stage].simpleLabel` — verb-led, no jargon:

- ✅ “What matters most”  
- ❌ “Self-Attention Mechanism”  

## Technical titles

Use `STAGE_META[stage].label` in Curious+ headers.

## `stageTips.ts` structure

Each stage has `beginner | engineer | research` entries:

```typescript
{ title, summary, tryThis? }
```

**tryThis** — one interactive hint; shown under chapter content in Beginner.

## Editing copy

1. Update `src/lib/stageTips.ts`  
2. Update matching `docs/STAGES/<stage>.md`  
3. Do not duplicate conflicting copy in components  
