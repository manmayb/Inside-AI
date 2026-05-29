"use client";

import { Layers } from "lucide-react";
import { TransformerCity } from "@/components/viz/TransformerCity";
import { SimpleInsight } from "@/components/ui/SimpleInsight";
import { LearningDetail } from "@/components/ui/LearningDetail";
import { Equation } from "@/components/ui/Equation";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";

export function TransformerSection() {
  return (
    <>
      <SimpleInsight>
        Picture many layers of thought stacked upward—each pass refines what the AI understands.
      </SimpleInsight>

      <LearningDetail>
        <StageSectionHeader stage="transformer" icon={Layers} />
        <Equation
          beginner=""
          engineer="Each layer mixes information across the whole sentence—this stack is the heart of modern LLMs."
          research="Pre-LN: h̃ = h + MHSA(LN(h)); h' = h̃ + FFN(LN(h̃))"
        />
      </LearningDetail>

      <LearningDetail>
        <TransformerCity />
      </LearningDetail>
    </>
  );
}
