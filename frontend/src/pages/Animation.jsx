import { motion } from "framer-motion";
import {
  fadeIn,
  slideIn,
  textVariant,
  scale,
  zoomIn,
  fadeInOut,
  bounceIn,
  rotateIn,
  slideRotate,
  flipCard,
  diagonalSlide,
  pulseFloat,
  elasticDrop,
} from "../utils/motion";

const Animation = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      <motion.div variants={fadeIn("up", 0.2)} initial="hidden" animate="show" className="box">
        Fade In
      </motion.div>

      <motion.div variants={slideIn("left", "spring", 0.2, 1)} initial="hidden" animate="show" className="box">
        Slide In
      </motion.div>

      <motion.div variants={textVariant(0.3)} initial="hidden" animate="show" className="box">
        Text Variant
      </motion.div>

      <motion.div variants={scale(0.3)} initial="hidden" animate="show" className="box">
        Scale In
      </motion.div>

      <motion.div variants={zoomIn("up", 0.4)} initial="hidden" animate="show" className="box">
        Zoom In
      </motion.div>

      <motion.div variants={fadeInOut("down", 0.4)} initial="hidden" animate="show" className="box">
        Fade In-Out
      </motion.div>

      <motion.div variants={bounceIn("up", 0.4)} initial="hidden" animate="show" className="box">
        Bounce In
      </motion.div>

      <motion.div variants={rotateIn("left", 0.4)} initial="hidden" animate="show" className="box">
        Rotate In
      </motion.div>

      <motion.div variants={slideRotate("right", 0.3, 1)} initial="hidden" animate="show" className="box">
        Slide & Rotate
      </motion.div>

      <motion.div variants={flipCard(0.3)} initial="hidden" animate="show" className="box">
        Flip Card
      </motion.div>

      <motion.div variants={diagonalSlide(0.3)} initial="hidden" animate="show" className="box">
        Diagonal Slide
      </motion.div>

      <motion.div {...pulseFloat} className="box">
        Pulse & Float
      </motion.div>

      <motion.div variants={elasticDrop(0.3)} initial="hidden" animate="show" className="box">
        Elastic Drop
      </motion.div>

      {/* Modern Fancy Hover Animation */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1 }}
        whileTap={{ scale: 0.95, rotate: -1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="box cursor-pointer"
      >
        Hover Me
      </motion.div>

      {/* Card Slide-in with Shadow Pop */}
      <motion.div
        initial={{ y: 50, opacity: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
        animate={{
          y: 0,
          opacity: 1,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="box"
      >
        Card Drop + Shadow
      </motion.div>
    </div>
  );
};

export default Animation;