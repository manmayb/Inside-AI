# Setup & installation

Step-by-step guide to run **Inside AI** locally.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 20.x+ |
| npm | 10.x+ |
| Browser | Modern Chrome, Firefox, Safari, Edge |

No Docker, database, or API keys.

---

## Install & run

```bash
cd llm-observatory   # from repo root: Inside-AI/llm-observatory
npm install
npm run dev
```

Open **http://localhost:3000**

You should see **“See how AI thinks.”** → enter prompt → **Start the journey** → prelude → chapters.

---

## Verify

1. Complete prelude → **Begin**  
2. Chapter 1 “Receiving your words” appears full-screen  
3. **Space** pauses auto-advance  
4. Bottom dots show progress  

---

## LAN / mobile testing

```bash
npm run dev -- -H 0.0.0.0
```

If HMR warns about cross-origin, add **your** LAN IP locally in `next.config.ts` — do not commit personal IPs. See `allowedDevOrigins` comment in config.

---

## Production

```bash
npm run build
npm run start
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ENOENT package.json` | Run commands inside `llm-observatory/`, not repo root only |
| Port in use | `npm run dev -- -p 3001` |
| Stale styles | Remove `.next`, restart dev |

---

## Environment variables

None required for core app.
