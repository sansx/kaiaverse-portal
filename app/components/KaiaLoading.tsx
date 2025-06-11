import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface KaiaLoadingProps {
  duration?: number; // 动画时长，单位秒，默认1.5
  className?: string;
  unlock?: boolean;
  onAnimationComplete?: () => void;
}

const KaiaLoading: React.FC<KaiaLoadingProps> = ({
  duration = 1.5,
  className,
  unlock = true,
  onAnimationComplete,
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!unlock && onAnimationComplete) {
      const timer = setTimeout(() => {
        setShow(false);
        onAnimationComplete();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [unlock, duration, onAnimationComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="kaia-loading"
          className={`fixed inset-0 z-40 flex items-center justify-center bg-white ${
            className || ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          style={{ 
            pointerEvents: "all",
            top: "64px" // 为导航栏留出空间
          }}
        >
          {unlock ? (
            <motion.img
              src="/icons/kaia-kaia-logo.svg"
              alt="Kaia Loading"
              className="w-16 h-16"
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 0], opacity: 1 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          ) : (
            <motion.img
              src="/icons/kaia-kaia-logo.svg"
              alt="Kaia Loading"
              className="w-16 h-16"
              initial="initial"
              animate="animate"
              variants={{
                initial: { rotate: 0, opacity: 1, scale: 1 },
                animate: { 
                  rotate: 360, 
                  opacity: 0, 
                  scale: 1.5,
                  transition: {
                    duration: duration,
                    times: [0.7, 1],
                    ease: "easeInOut",
                  }
                }
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KaiaLoading;
