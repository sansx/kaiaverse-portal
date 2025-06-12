'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '../../i18n/routing';
import { locales } from '../../i18n/request';
import { RiTranslateAi2 } from "react-icons/ri";

const languages = {
  en: 'English',
  zh: '简体中文',
  ko: '한국어'
};

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, {locale: newLocale});
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 150ms延迟关闭
  };

  // 清理超时
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative inline-block text-left" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 触发按钮 */}
      <div
        className="group inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:from-gray-100 hover:to-gray-50 hover:text-gray-900 focus:outline-none transition-all duration-300 shadow-sm cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* 翻译AI图标 */}
        <RiTranslateAi2 className="w-4 h-4 mr-2 text-gray-500 group-hover:text-gray-700 transition-colors duration-300" />
        <span className="truncate">{languages[locale as keyof typeof languages]}</span>
        {/* 下拉箭头 */}
        <svg
          className={`w-4 h-4 ml-2 transition-all duration-300 group-hover:text-gray-700 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

             {/* 下拉菜单 */}
       {isOpen && (
         <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-black/5 focus:outline-none backdrop-blur-sm border border-gray-100/50">
           <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {locales.map((lang) => (
                             <button
                 key={lang}
                 onClick={() => handleLanguageChange(lang)}
                 className={`group flex items-center w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors duration-150 ${
                   locale === lang
                     ? 'bg-blue-50 text-blue-600 font-medium'
                     : 'text-gray-700 hover:text-gray-900'
                 }`}
                 role="menuitem"
               >
                {/* 当前选中语言的选中图标 */}
                {locale === lang && (
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className={locale === lang ? '' : 'ml-6'}>
                  {languages[lang as keyof typeof languages]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 