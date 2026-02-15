import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card.jsx";
import CardSkeleton from "./CardSkeleton.jsx";
import "./Styles/Cards.css";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

export default function Cards({ videogames, direction, loading }) {
  if (loading) {
    return (
      <div
        className={
          direction === "vertical"
            ? "cont-cards-vertical"
            : "cont-cards-horizontal"
        }
      >
        <CardSkeleton count={direction === "horizontal" ? 6 : 12} />
      </div>
    );
  }

  return (
    <motion.div
      className={
        direction === "vertical"
          ? "cont-cards-vertical"
          : "cont-cards-horizontal"
      }
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={videogames.map((v) => v.id).join("-")}
    >
      <AnimatePresence mode="popLayout">
        {videogames.map((videogame) => (
          <motion.div
            key={videogame.id}
            variants={cardVariants}
            layout
            className="card-motion-wrapper"
          >
            <Card videogame={videogame} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
