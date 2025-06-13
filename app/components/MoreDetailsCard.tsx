import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

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
  linkText,
  className,
  loading,
}) => {
  const t = useTranslations('common');
  
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
              alt={t('kaiaLoading')}
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
      >
        {children}

        {/* 数据源链接 */}
        {!loading && (
          <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-200">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all duration-200 group">
                <span className="text-sm text-gray-700 group-hover:text-blue-700">
                  {t('dataSource')}
                </span>

                {linkText || t('viewMoreDetails')}
                <FaExternalLinkAlt className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreDetailsCard;
