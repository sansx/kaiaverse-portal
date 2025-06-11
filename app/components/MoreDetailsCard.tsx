import React, { useEffect, useState } from "react";
import { MdSubdirectoryArrowRight, MdArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { FaAngleRight } from "react-icons/fa";

interface MoreDetailsCardProps {
  children: React.ReactNode;
  className?: string;
  href: string;
  linkText?: string;
  loading?: boolean;
}

const MoreDetailsCard: React.FC<MoreDetailsCardProps> = ({
  children,
  href,
  linkText = "查看更多详情",
  className,
  loading,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`rounded-xl transition-colors duration-200 group w-full ${className} relative hover:-translate-y-0.5`}
      style={{ transition: "background 0.2s, transform 0.2s" }}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            key="card-loading"
            className="absolute inset-0 z-20 flex items-center justify-center bg-white rounded-xl"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            style={{ pointerEvents: "all" }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      <div
        style={{
          opacity: loading ? 0.3 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}

        {!loading && <div className="flex items-center select-none  absolute right-0">
          <MdSubdirectoryArrowRight className="text-lg mt-1 text-gray-400 group-hover:text-blue-500 transition-transform duration-200 group-hover:translate-x-1 mb-2" />
          {/* 路标样式的a标签 */}
          {/* <a
            href={href}
            className="ml-1 text-sm font-medium text-blue-600 group-hover:underline group-hover:text-blue-500 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkText}
          </a> */}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block mt-1"
          >
            {/* 外框 - 电子路牌边框，改为白色底+绿色边 */}
            <div className="relative bg-[#49546A] rounded p-0.5 pl-1 pr-2 ml-1 shadow-2xl shadow-green-200/40">
              {/* 内部发光边框 */}
              <div className="absolute inset-2 rounded"></div>

              {/* LED点阵背景效果 */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-20 gap-1 h-full w-full p-4">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-green-400 rounded-full w-1 h-1"
                    ></div>
                  ))}
                </div>
              </div>

              {/* 主要内容 */}
              <div className="relative flex items-center justify-between min-w-[100px] pl-2">
                {/* 向右箭头 */}
                <div className="flex items-center mr-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <FaAngleRight
                      key={i}
                      className={`w-3 h-4 ml-[-5px] text-green-500 transition-all duration-100 ${
                        isHovered
                          ? "animate-pulse opacity-100"
                          : "opacity-100 translate-x-0"
                      }`}
                      style={{
                        // transitionDelay: `${i * 50}ms`,
                        animationDelay: `${i * 100}ms`,
                        animationDuration: "1.2s",
                        animationIterationCount: isHovered ? "infinite" : "1",
                      }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-[#BFF007] font-bold font-mono text-sm ${
                      isHovered && "underline"
                    }`}
                  >
                    {linkText}
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>}
      </div>
    </div>
  );
};

export default MoreDetailsCard;
