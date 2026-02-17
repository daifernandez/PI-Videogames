import { motion } from "framer-motion";

const variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const transition = { duration: 0.2, ease: "easeInOut" };

/**
 * Wrapper para transición fade suave entre páginas (D.2).
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
