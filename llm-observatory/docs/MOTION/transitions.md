# Transitions

## Chapter change

When `currentStage` changes:

1. `ChapterScene` outer wrapper fades (`AnimatePresence mode="wait"`)  
2. Header updates title + summary from `getStageTip()`  
3. `ChapterBrainFocus` remounts (Beginner) with region chip animation  
4. Main content enters with slight `y` offset + 80ms delay  

**Why wait mode:** Prevents overlapping chapter copy — reduces cognitive bleed between ideas.

---

## Prelude steps

`PreJourneyIntro` uses indexed slides with `y` enter/exit. Progress pills widen on active step.

---

## Menu overlay

`SceneChrome` menu: backdrop fade + sheet `y` slide. Click outside closes.

---

## Completion

`JourneyComplete`: backdrop blur + scale-in card. Does not block store — user can dismiss to read analytics chapter.

---

## Adding motion to a new chapter

1. Prefer **one** hero animation in the section component.  
2. Use shared easing from `neuralMotion.ts`.  
3. Document duration in section file header comment.  
4. Update [../STAGES/](../STAGES/) doc for that chapter.
