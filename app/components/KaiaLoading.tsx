import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface KaiaLoadingProps {
  duration?: number; // 动画时长，单位秒，默认1.5
  className?: string;
}

const KaiaLoading: React.FC<KaiaLoadingProps> = ({
  duration = 1.5,
  className,
}) => (
  <AnimatePresence>
    <motion.div
      key="kaia-loading"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 ${
        className || ""
      }`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      style={{ pointerEvents: "all" }}
    >
      <motion.img
        src="/icons/kaia-kaia-logo.svg"
        alt="Kaia Loading"
        className="w-24 h-24"
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 360, opacity: 1 }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </motion.div>
  </AnimatePresence>
);

export default KaiaLoading;
