import type {
  AttentionMatrix,
  ContextBlock,
  EmbeddingPoint,
  GeneratedToken,
  InferenceConfig,
  KVCacheEntry,
  LogitCandidate,
  TokenUnit,
} from "@/types/pipeline";
import { SAMPLE_MEMORY, SYSTEM_PROMPT } from "./constants";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function buildEmbeddings(
  tokens: TokenUnit[],
  dim = 3
): EmbeddingPoint[] {
  const rand = seededRandom(tokens.reduce((a, t) => a + t.id, 0));

  return tokens.map((t, i) => {
    const angle = (i / Math.max(tokens.length, 1)) * Math.PI * 2;
    const r = 0.4 + rand() * 0.6;
    return {
      tokenIndex: i,
      text: t.text,
      x: Math.cos(angle) * r + (rand() - 0.5) * 0.3,
      y: Math.sin(angle) * r + (rand() - 0.5) * 0.3,
      z: (rand() - 0.5) * 0.8,
      magnitude: 0.5 + rand() * 0.5,
    };
  });
}

export function cosineSimilarity(a: EmbeddingPoint, b: EmbeddingPoint): number {
  const dot = a.x * b.x + a.y * b.y + a.z * b.z;
  const magA = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2) || 1;
  const magB = Math.sqrt(b.x ** 2 + b.y ** 2 + b.z ** 2) || 1;
  return dot / (magA * magB);
}

export function buildContextBlocks(
  userPrompt: string,
  promptTokens: number,
  ragEnabled: boolean
): ContextBlock[] {
  const blocks: ContextBlock[] = [
    {
      id: "sys",
      label: "System Prompt",
      type: "system",
      tokens: Math.ceil(SYSTEM_PROMPT.length / 4),
      content: SYSTEM_PROMPT,
      color: "#8b5cf6",
    },
    {
      id: "mem",
      label: "Session Memory",
      type: "memory",
      tokens: SAMPLE_MEMORY.reduce((a, m) => a + Math.ceil(m.length / 4), 0),
      content: SAMPLE_MEMORY.join(" · "),
      color: "#34d399",
    },
    {
      id: "hist",
      label: "Conversation History",
      type: "history",
      tokens: 128,
      content: "[prior turns compressed]",
      color: "#64748b",
    },
    {
      id: "user",
      label: "User Prompt",
      type: "user",
      tokens: promptTokens,
      content: userPrompt,
      color: "#22d3ee",
    },
  ];

  if (ragEnabled) {
    blocks.push({
      id: "rag",
      label: "RAG Retrieval",
      type: "rag",
      tokens: 256,
      content: "Retrieved: quantum_superposition.md, qubit_basics.pdf chunks",
      color: "#f472b6",
    });
  }

  return blocks;
}

export function buildAttentionMatrix(
  tokens: TokenUnit[],
  heads: number
): AttentionMatrix {
  const texts = tokens.map((t) => t.text);
  const n = texts.length;
  const rand = seededRandom(n * heads + 42);
  const weights: number[][] = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    let sum = 0;
    for (let j = 0; j < n; j++) {
      const sameWord = texts[i] === texts[j] ? 0.4 : 0;
      const proximity = Math.exp(-Math.abs(i - j) / 2) * 0.35;
      const noise = rand() * 0.15;
      const w = sameWord + proximity + noise + (j <= i ? 0.1 : 0);
      row.push(w);
      sum += w;
    }
    weights.push(row.map((w) => w / sum));
  }

  return { tokens: texts, weights, heads };
}

export function getAttentionForToken(
  matrix: AttentionMatrix,
  tokenIndex: number
): { target: number; weight: number }[] {
  return matrix.weights[tokenIndex].map((weight, target) => ({
    target,
    weight,
  }));
}

export function buildLogits(
  tokens: TokenUnit[],
  config: InferenceConfig,
  step: number
): LogitCandidate[] {
  const rand = seededRandom(step * 997 + tokens.length);
  const candidates = [
    " the", " a", " is", " are", " quantum", " computing", " uses", " qubits",
    " simply", " means", " that", " particles", " can", " exist", " in", " superposition",
    ".", ",", " and", " which", " allows", " parallel", " computation",
  ];

  const logits = candidates.map((token, i) => {
    const logit = 2 + rand() * 8 - i * 0.15 + (step % 3) * 0.2;
    return { token, id: 1000 + i, logit, probability: 0 };
  });

  const maxLogit = Math.max(...logits.map((l) => l.logit));
  const expSum = logits.reduce((s, l) => s + Math.exp((l.logit - maxLogit) / config.temperature), 0);

  return logits
    .map((l) => ({
      ...l,
      probability: Math.exp((l.logit - maxLogit) / config.temperature) / expSum,
    }))
    .sort((a, b) => b.probability - a.probability);
}

export function sampleToken(
  candidates: LogitCandidate[],
  config: InferenceConfig
): LogitCandidate {
  let pool = [...candidates];

  if (config.sampling === "top_k") {
    pool = pool.slice(0, config.topK);
  } else if (config.sampling === "top_p") {
    let cum = 0;
    pool = [];
    for (const c of candidates) {
      pool.push(c);
      cum += c.probability;
      if (cum >= config.topP) break;
    }
  }

  if (config.sampling === "greedy") return pool[0];

  const rand = seededRandom(Date.now() % 10000)();
  let cum = 0;
  for (const c of pool) {
    cum += c.probability;
    if (rand <= cum) return c;
  }
  return pool[0];
}

export function simulateResponse(
  prompt: string,
  maxTokens = 24
): GeneratedToken[] {
  const responseWords = [
    "Quantum", "computing", "uses", "qubits", "that", "can", "exist", "in",
    "superposition", "—", "meaning", "they", "hold", "0", "and", "1", "simultaneously",
    "until", "measured.", "This", "enables", "parallel", "exploration", "of",
    "solution", "spaces", "classical", "machines", "cannot", "efficiently", "search.",
  ];

  const out: GeneratedToken[] = [];
  for (let i = 0; i < Math.min(maxTokens, responseWords.length); i++) {
    const text = (i > 0 && !responseWords[i].match(/^[.,—]/) ? " " : "") + responseWords[i];
    out.push({
      text,
      id: 2000 + i,
      probability: 0.92 - i * 0.02 + Math.random() * 0.05,
      step: i + 1,
    });
  }
  return out;
}

export function buildKVCache(
  config: InferenceConfig,
  seqLen: number
): KVCacheEntry[] {
  const entries: KVCacheEntry[] = [];
  for (let layer = 0; layer < Math.min(8, config.layers); layer++) {
    for (let head = 0; head < Math.min(4, config.heads); head++) {
      entries.push({
        layer,
        head,
        keyDim: config.hiddenDim / config.heads,
        valueDim: config.hiddenDim / config.heads,
        reused: layer > 0,
        bytes: seqLen * (config.hiddenDim / config.heads) * 2 * 2,
      });
    }
  }
  return entries;
}

export function estimateFlops(
  config: InferenceConfig,
  seqLen: number,
  genTokens: number
): number {
  const L = config.layers;
  const H = config.hiddenDim;
  const perLayer = 12 * seqLen * H * H + 2 * seqLen * seqLen * H;
  return (perLayer * L + seqLen * config.vocabSize * H) * (1 + genTokens * 0.15);
}

export function entropy(candidates: LogitCandidate[]): number {
  return -candidates.reduce((s, c) => {
    if (c.probability <= 0) return s;
    return s + c.probability * Math.log2(c.probability);
  }, 0);
}
