export interface GlossaryTerm {
  term: string;
  definition: string;
  category: "core" | "compute" | "safety";
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Token",
    definition: "A subword unit from the tokenizer vocabulary; the atomic input to the model.",
    category: "core",
  },
  {
    term: "Embedding",
    definition: "A dense vector representing a token's meaning in d-dimensional space.",
    category: "core",
  },
  {
    term: "Context window",
    definition: "Maximum tokens the model can attend to in one forward pass.",
    category: "core",
  },
  {
    term: "Self-attention",
    definition: "Mechanism where each token computes weighted sums over all other tokens.",
    category: "core",
  },
  {
    term: "KV cache",
    definition: "Stored key/value tensors from prior tokens to avoid recomputation at decode.",
    category: "compute",
  },
  {
    term: "Logits",
    definition: "Raw scores over the vocabulary before softmax; one per possible next token.",
    category: "core",
  },
  {
    term: "Temperature",
    definition: "Scales logits before softmax; lower = more deterministic, higher = more random.",
    category: "core",
  },
  {
    term: "Top-p (nucleus)",
    definition: "Sample only from the smallest set of tokens whose cumulative probability ≥ p.",
    category: "core",
  },
  {
    term: "FLOPs",
    definition: "Floating-point operations; approximate measure of compute cost.",
    category: "compute",
  },
  {
    term: "RAG",
    definition: "Retrieval-Augmented Generation: inject retrieved documents into context.",
    category: "core",
  },
  {
    term: "Autoregressive",
    definition: "Generate one token at a time, each conditioned on all previous tokens.",
    category: "core",
  },
  {
    term: "Moderation",
    definition: "Safety classifiers that filter harmful inputs/outputs before/after inference.",
    category: "safety",
  },
];
