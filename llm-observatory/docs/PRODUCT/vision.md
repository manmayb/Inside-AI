# Product vision

**Inside AI** (package name: `llm-observatory`) is an interactive, browser-based **guided documentary** that helps non-engineers understand what happens after they send a message to a language model.

---

## One-line pitch

> A calm, chapter-based journey through a **simulated** AI mind — from your words arriving to a reply streaming back.

---

## Target audience

| Primary | Secondary |
|---------|-----------|
| Students, curious adults, artists, parents | Engineers who want intuition before papers |
| People who use ChatGPT but feel it is a “black box” | Educators running workshops |

**Not** ML researchers evaluating models. **Not** SREs debugging production inference.

---

## Learning goals

After completing the journey, a user should:

1. **Feel** that AI processing is a sequence of understandable steps — not magic.
2. **Remember** a simple mental model: receive → break apart → mean → remember → think → choose → speak.
3. **Know** they can go deeper (Curious / Advanced) when ready — jargon is optional, not mandatory.

---

## Experience philosophy

| Principle | Meaning |
|-----------|---------|
| **Guided documentary** | One chapter, one idea, one focal visualization |
| **Emotional safety** | Calm pacing, plain language, no “control room” density |
| **Progressive depth** | Beginner default; technical layers are opt-in |
| **Honest simulation** | Everything is crafted in-browser — we say so clearly |

See [../UX/philosophy.md](../UX/philosophy.md) for structural UX decisions.

---

## Product identity

- **Name (UI):** Inside AI  
- **Tone:** Museum tour, science documentary, Apple-style onboarding — not cyberpunk dashboard  
- **Metaphor:** A thought traveling through cognitive regions — not a GPU monitor  

---

## What this project is NOT

- ❌ A production LLM client or chat app  
- ❌ Real observability (W&B, LangSmith, Grafana)  
- ❌ Accurate tokenizer / attention from a trained model  
- ❌ A benchmark or cost calculator for real deployments  
- ❌ Requiring API keys, backend, or GPU  

---

## Success criteria (product)

- A first-time user understands the product in **under 10 seconds** on the welcome screen.
- A Beginner user never feels they must understand tensors, logits, or embeddings to proceed.
- The codebase remains **documented** so contributors do not rely on chat history or oral tradition.

---

## Related docs

- [identity.md](./identity.md) — naming, positioning  
- [audience.md](./audience.md) — personas  
- [../LEARNING_SYSTEM/overview.md](../LEARNING_SYSTEM/overview.md) — depth modes  
