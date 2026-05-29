# Chapter 2: tokenization

| Field | Value |
|-------|-------|
| **ID** | `tokenization` |
| **Beginner label** | Breaking into pieces |
| **Region** | Understanding words |
| **Section** | `TokenizationSection.tsx` |
| **Duration** | ~1800ms |

## Purpose

Text becomes **tokens** — subword pieces the model can process.

## Beginner experience

- **Metaphor:** “The AI chops text into small chunks.”  
- **Viz:** `SemanticToken` glyphs  
- **Interaction:** Tap token to select (`selectedTokenIndex`)  

## Curious / Advanced

- BPE terminology, token IDs, merge ranks  

## State dependencies

`tokens`, `selectedTokenIndex`

## Key components

`SemanticToken`, `SimpleInsight`
