import type { Transition, Variants } from "framer-motion";
import { collapseEase, signalEase, tensorEase } from "./neuralMotion";

/** Latent-space drift — stage enters like signal propagation */
export const stageTransition: Transition = {
  duration: 0.5,
  ease: signalEase,
};

export const stageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(2px)",
  },
};

export const panelStagger: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

export const panelChild: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: tensorEase },
  },
};

export const collapseTransition: Transition = {
  duration: 0.42,
  ease: collapseEase,
};
