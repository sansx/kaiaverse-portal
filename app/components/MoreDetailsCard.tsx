import React, { useEffect, useState } from "react";
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

interface MoreDetailsCardProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  linkText?: string;
  loading?: boolean;
}

const MoreDetailsCard: React.FC<MoreDetailsCardProps> = ({ children, href, linkText = "查看更多详情", className, loading }) => {

  return (
    <div
      className={`rounded-xl transition-colors duration-200 group w-full ${className} relative hover:-translate-y-0.5`}
      style={{ transition: 'background 0.2s, transform 0.2s' }}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            key="card-loading"
            className="absolute inset-0 z-20 flex items-center justify-center bg-white rounded-xl"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            style={{ pointerEvents: 'all' }}
          >
            <motion.img
              src="/icons/kaia-kaia-logo.svg"
              alt="Kaia Loading"
              className="w-16 h-16"
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 0], opacity: 1 }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop', ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ opacity: loading ? 0.3 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
        {children}
        <div className="flex items-center select-none  absolute right-0">
          <MdSubdirectoryArrowRight className="text-lg text-gray-400 group-hover:text-blue-500 transition-transform duration-200 group-hover:translate-x-1 mb-2" />
          <a
            href={href}
            className="ml-1 text-sm font-medium text-blue-600 group-hover:underline group-hover:text-blue-500 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default MoreDetailsCard; 