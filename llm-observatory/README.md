# Inside AI

**A guided, chapter-based journey through how a language model processes your message** — simulated entirely in the browser. No API keys. No GPU. Built for beginners first.

---

## At a glance

| | |
|---|---|
| **What it is** | Interactive educational documentary (15 chapters) |
| **What it is not** | Production LLM client, observability dashboard, or real inference |
| **Stack** | Next.js 16 · React 19 · Zustand · Framer Motion · TypeScript |
| **Default mode** | Beginner — plain language, one idea per screen |

---

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → enter a question → **Start the journey**.

Full setup: **[docs/CONTRIBUTING/setup.md](./docs/CONTRIBUTING/setup.md)**

---

## Documentation

**Start here:** **[docs/README.md](./docs/README.md)** — full navigation map.

| Topic | Link |
|-------|------|
| Product vision | [docs/PRODUCT/vision.md](./docs/PRODUCT/vision.md) |
| UX & flow | [docs/UX/experience-flow.md](./docs/UX/experience-flow.md) |
| Architecture | [docs/ARCHITECTURE/overview.md](./docs/ARCHITECTURE/overview.md) |
| All 15 chapters | [docs/STAGES/README.md](./docs/STAGES/README.md) |
| AI / Cursor guide | [docs/AI/contributor-guide.md](./docs/AI/contributor-guide.md) |
| Contributing | [docs/CONTRIBUTING/README.md](./docs/CONTRIBUTING/README.md) |

---

## Experience structure

```
Welcome  →  Prelude  →  15 chapter scenes  →  Finale
```

- **No dashboard sidebar** in the default journey  
- **One focal visualization** per chapter (Beginner)  
- **Curious / Advanced** depth via menu — optional heatmaps, metrics, JSON  

Details: [docs/UX/philosophy.md](./docs/UX/philosophy.md)

---

## Repository layout

```
llm-observatory/
├── docs/                 ← Source of truth (product, UX, architecture, stages)
├── src/
│   ├── app/              Next.js shell, globals.css
│   ├── components/
│   │   ├── home/         Welcome, prelude
│   │   ├── journey/      Documentary shell (active)
│   │   ├── sections/     One file per pipeline chapter
│   │   ├── viz/          Reusable visualizations
│   │   └── layout/       Legacy dashboard chrome (unused)
│   ├── store/            pipelineStore.ts
│   ├── lib/              Simulation engine
│   └── hooks/            Runner, learning depth, shortcuts
├── ARCHITECTURE.md       Short index → docs/ARCHITECTURE/
└── PROJECT_SUMMARY.md    Short index → docs/PRODUCT/
```

---

## Philosophy (short)

> Help anyone *feel* how AI transforms language into a reply — without fear of jargon.

We optimize for **emotional clarity and pacing**, not maximum technical density on first screen.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## Contributing

Read [docs/CONTRIBUTING/README.md](./docs/CONTRIBUTING/README.md). **Update docs in the same PR** as code changes ([maintenance rules](./docs/CONTRIBUTING/maintenance.md)).

---

## License

See repository license file if present.
