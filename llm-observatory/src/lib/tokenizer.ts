import type { TokenUnit } from "@/types/pipeline";

/** BPE-inspired subword vocabulary for simulation */
const VOCAB_FRAGMENTS = [
  "ing", "tion", "ment", "able", "ness", "ly", "er", "ed", "es", "re",
  "un", "pre", "dis", "over", "under", "out", "anti", "pro", "sub", "super",
  "quant", "um", "comput", "ing", "explain", "simply", "the", "a", "an", "is",
  "are", "was", "what", "how", "why", "when", "where", "user", "assistant",
  "token", "embed", "layer", "attend", "softmax", "matrix", "vector", "cache",
];

const BASE_VOCAB = "abcdefghijklmnopqrstuvwxyz0123456789 .,!?;:'\"-()[]{}@#$%^&*+=/<>".split("");

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function tokenId(text: string, index: number): number {
  return (hashString(text) % 49000) + 1000 + index;
}

/** Greedy longest-match BPE simulation */
export function tokenize(text: string): TokenUnit[] {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return [];

  const tokens: TokenUnit[] = [];
  let i = 0;
  let mergeStep = 0;

  while (i < normalized.length) {
    let matched = "";
    let mergeRank: number | undefined;

    for (const frag of [...VOCAB_FRAGMENTS].sort((a, b) => b.length - a.length)) {
      if (normalized.slice(i, i + frag.length) === frag) {
        matched = frag;
        mergeRank = mergeStep++;
        break;
      }
    }

    if (!matched) {
      const ch = normalized[i];
      if (ch === " ") {
        i++;
        continue;
      }
      matched = ch;
    }

    const byteLength = new TextEncoder().encode(matched).length;
    tokens.push({
      text: matched,
      id: tokenId(matched, tokens.length),
      byteLength,
      frequency: Math.max(1, 50000 - hashString(matched) % 48000),
      mergeRank,
    });
    i += matched.length;
  }

  return tokens;
}

export function estimateTokenCount(text: string): number {
  return Math.max(1, Math.ceil(text.length / 3.2));
}

export function detokenize(tokens: TokenUnit[]): string {
  return tokens.map((t) => t.text).join("").replace(/\s+/g, " ").trim();
}
