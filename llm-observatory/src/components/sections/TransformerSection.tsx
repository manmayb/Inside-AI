"use client";

import { Layers } from "lucide-react";
import { TransformerCity } from "@/components/viz/TransformerCity";
import { CinematicScene } from "@/components/ui/CinematicScene";
import { Equation } from "@/components/ui/Equation";
import { StageSectionHeader } from "@/components/ui/StageSectionHeader";

export function TransformerSection() {
  return (
    <CinematicScene
      insight="Picture many layers of thought stacked upward—each pass refines what the AI understands."
      hero={<TransformerCity />}
      curious={
        <>
          <StageSectionHeader stage="transformer" icon={Layers} />
          <Equation
            beginner=""
            engineer="Each layer mixes information across the whole sentence—this stack is the heart of modern LLMs."
            research="Pre-LN: h̃ = h + MHSA(LN(h)); h' = h̃ + FFN(LN(h̃))"
          />
        </>
      }
    />
  );
}
