import { Variants, Transition } from "motion/react";

export const defaultTransition: Transition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1], // ease-out cubic
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: defaultTransition },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const tableRowVariants: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const collapseExpandVariants: Variants = {
  initial: { opacity: 0, height: 0, overflow: "hidden" },
  animate: { opacity: 1, height: "auto", transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, height: 0, overflow: "hidden", transition: { duration: 0.2, ease: "easeIn" } },
};
