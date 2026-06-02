import type { PipelineStage, ViewMode } from "@/types/pipeline";

export interface StageTip {
  title: string;
  summary: string;
  tryThis?: string;
}

export const STAGE_TIPS: Record<PipelineStage, Record<ViewMode, StageTip>> = {
  input: {
    beginner: {
      title: "Your message enters the mind",
      summary: "Think of this like a thought arriving—your words are on their way in.",
      tryThis: "Watch the region chip above as your words arrive.",
    },
    engineer: {
      title: "Request sent to the model",
      summary: "Your prompt is packaged and sent to the AI system—similar to sending a message to a very fast helper.",
      tryThis: "In Advanced mode, you can inspect the raw request payload.",
    },
    research: {
      title: "Request serialization",
      summary: "Client encodes UTF-8 prompt; server schedules batch on inference queue.",
    },
  },
  tokenization: {
    beginner: {
      title: "Breaking your words into pieces",
      summary: "The AI doesn't read whole sentences at once—it chops text into small chunks it can work with.",
      tryThis: "Tap a glowing word-piece below to focus on it.",
    },
    engineer: {
      title: "Tokenization (BPE)",
      summary: "Subword tokens get stable IDs. This is the first step from text to numbers.",
      tryThis: "Compare how long words split into multiple tokens.",
    },
    research: {
      title: "Tokenizer mapping",
      summary: "S → [t₁…tₙ] via BPE; each tᵢ ∈ V with merge table and byte-fallback.",
    },
  },
  embedding: {
    beginner: {
      title: "Words become meaning",
      summary: "Each piece is turned into a pattern of numbers—like coordinates for ideas in a vast space.",
      tryThis: "Similar ideas sit closer together—click one to see neighbors connect.",
    },
    engineer: {
      title: "Embeddings",
      summary: "Each token ID maps to a vector. Position tells the model word order.",
      tryThis: "Explore the 3D view in technical detail below.",
    },
    research: {
      title: "h⁽⁰⁾ initialization",
      summary: "h⁽⁰⁾ᵢ = W_E[xᵢ] + W_P[i]; projection shown for visualization.",
    },
  },
  context: {
    beginner: {
      title: "Gathering what to remember",
      summary: "The AI bundles instructions, past chat, and your question into one working memory.",
      tryThis: "See which memory blocks take the most room.",
    },
    engineer: {
      title: "Context window",
      summary: "System, history, user message—and optional retrieved docs—share a fixed-size window.",
      tryThis: "Enable RAG on the home screen to see retrieval fill memory.",
    },
    research: {
      title: "Sequence packing",
      summary: "Concat blocks with attention mask; overflow triggers truncation.",
    },
  },
  transformer: {
    beginner: {
      title: "Thinking deeper, layer by layer",
      summary: "Information flows through many layers—each pass refines what the model understands.",
      tryThis: "Watch the towers light up layer by layer.",
    },
    engineer: {
      title: "Transformer layers",
      summary: "Repeated blocks mix information across the whole sentence—this is the core of modern AI.",
      tryThis: "Open technical view for the layer stack animation.",
    },
    research: {
      title: "L-layer transformer",
      summary: "Pre-LN residual: MHSA + FFN per layer with causal mask.",
    },
  },
  attention: {
    beginner: {
      title: "Deciding which words matter",
      summary: "The AI looks back at your message and weighs which parts are most relevant right now.",
      tryThis: "Select a word—watch bridges light up to what it connects with.",
    },
    engineer: {
      title: "Self-attention",
      summary: "Each token attends to others; multiple heads capture different relationship types.",
      tryThis: "Switch attention heads in technical view.",
    },
    research: {
      title: "Attention weights",
      summary: "α_ij = softmax(q_i·k_j/√d_h); output_i = Σ_j α_ij v_j per head.",
    },
  },
  gpu: {
    beginner: {
      title: "Thinking at incredible speed",
      summary: "Huge grids of math run in parallel—this is how modern AI answers so fast.",
      tryThis: "Watch the parallel cells pulse as work happens.",
    },
    engineer: {
      title: "Parallel computation",
      summary: "Matrix operations execute on GPU cores—where most inference time is spent.",
      tryThis: "See matrix chambers in technical view.",
    },
    research: {
      title: "CUDA execution",
      summary: "Tiled GEMM; memory bandwidth often bounds throughput.",
    },
  },
  hidden: {
    beginner: {
      title: "Meaning keeps evolving",
      summary: "Early layers catch structure; deeper layers shape ideas and intent.",
      tryThis: "Scrub through layers in technical view to see representation change.",
    },
    engineer: {
      title: "Hidden states",
      summary: "Each layer updates internal representations per token position.",
      tryThis: "Use the layer slider when available.",
    },
    research: {
      title: "Feature geometry",
      summary: "Probing h^{(l)} reveals syntactic vs semantic subspaces by depth.",
    },
  },
  logits: {
    beginner: {
      title: "Choosing the next word",
      summary: "The AI imagines many possible next words, then picks one—like finishing a sentence in your head.",
      tryThis: "See probabilities collapse toward one choice below.",
    },
    engineer: {
      title: "Next-token scores",
      summary: "Logits become probabilities; temperature and sampling shape creativity vs focus.",
      tryThis: "Adjust temperature in technical controls.",
    },
    research: {
      title: "Next-token distribution",
      summary: "π = softmax(z/T); sample or argmax; entropy H(π) measures uncertainty.",
    },
  },
  autoregressive: {
    beginner: {
      title: "Building the answer one word at a time",
      summary: "Write one word → think again → write another—until the reply is complete.",
      tryThis: "Follow the loop in technical view.",
    },
    engineer: {
      title: "Generation loop",
      summary: "Prefill processes the prompt once; each new token triggers another forward pass.",
    },
    research: {
      title: "Autoregressive factorization",
      summary: "P(x) = Π_t P(x_t | x_{<t}).",
    },
  },
  kvcache: {
    beginner: {
      title: "Remembering what it already figured out",
      summary: "The AI saves earlier work so it doesn't re-read the whole conversation every time.",
      tryThis: "Green slots in the grid are being reused.",
    },
    engineer: {
      title: "KV cache",
      summary: "Stored keys/values speed up generation after the first pass.",
    },
    research: {
      title: "Cache layout",
      summary: "PagedAttention reduces fragmentation for long contexts.",
    },
  },
  safety: {
    beginner: {
      title: "Checking before speaking",
      summary: "Filters scan for harmful or policy-breaking content—like a careful editor.",
    },
    engineer: {
      title: "Safety filters",
      summary: "Classifiers on input/output gate the final response.",
    },
    research: {
      title: "Safety classifiers",
      summary: "Ensemble heads on hidden states + prompt embeddings.",
    },
  },
  rag: {
    beginner: {
      title: "Looking things up first",
      summary: "The AI can search notes or documents, then use them to answer more accurately.",
      tryThis: "Enable RAG on the home screen and run again.",
    },
    engineer: {
      title: "Retrieval (RAG)",
      summary: "Relevant chunks are fetched and added to memory before answering.",
    },
    research: {
      title: "RAG",
      summary: "top-k chunks by embedding similarity prepended to context.",
    },
  },
  streaming: {
    beginner: {
      title: "The answer appears gradually",
      summary: "Words arrive one by one—like the mind finishing a sentence in real time.",
      tryThis: "Watch text stream below.",
    },
    engineer: {
      title: "Streaming response",
      summary: "Tokens emit as they're generated; you see partial output immediately.",
    },
    research: {
      title: "Streaming decode",
      summary: "Chunked transfer; client buffers incremental tokens.",
    },
  },
  analytics: {
    beginner: {
      title: "The thought completes",
      summary: "A quick recap of how long it took and how much was processed—your journey through the brain.",
      tryThis: "Open the menu to switch depth and explore technical details.",
    },
    engineer: {
      title: "Run summary",
      summary: "Timing, token counts, and approximate compute for this simulation.",
    },
    research: {
      title: "Cost & complexity",
      summary: "FLOPs ≈ 12L·n·d² + 2L·n²·d; KV memory scales with sequence length.",
    },
  },
};

export function getStageTip(stage: PipelineStage, mode: ViewMode): StageTip {
  return STAGE_TIPS[stage][mode];
}
