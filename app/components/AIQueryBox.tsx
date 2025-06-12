'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface SuggestionQuestion {
  question: string;
  description: string;
}

const AIQueryBox = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assistantBaseUrl, setAssistantBaseUrl] = useState('https://assistant.kaiaverse.xyz');
  const t = useTranslations('aiQuery');

  // 在客户端设置 AI 助手 URL，避免水合错误
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_AI_ASSISTANT_URL || 'https://assistant.kaiaverse.xyz';
    setAssistantBaseUrl(url);
  }, []);

  // 示例建议问题列表
  const suggestionQuestions = t.raw('suggestions') as SuggestionQuestion[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // 如果查询为空，直接跳转到助手页面
      if (!query.trim()) {
        window.open(assistantBaseUrl, '_blank');
        return;
      }
      
      // 将查询参数编码并跳转到助手页面
      const encodedQuery = encodeURIComponent(query.trim());
      const assistantUrl = `${assistantBaseUrl}?query=${encodedQuery}`;
      
      // 在新标签页中打开助手页面
      window.open(assistantUrl, '_blank');
    } catch (error) {
      console.error('Failed to open AI assistant:', error);
      // 可以在这里添加用户友好的错误提示
      alert('无法打开 AI 助手，请稍后再试。');
    } finally {
      // 重置加载状态
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setQuery(question);
    setShowSuggestions(false);
    
    try {
      // 直接跳转到助手页面并传递建议问题
      const encodedQuery = encodeURIComponent(question);
      const assistantUrl = `${assistantBaseUrl}?query=${encodedQuery}`;
      window.open(assistantUrl, '_blank');
    } catch (error) {
      console.error('Failed to open AI assistant:', error);
      alert('无法打开 AI 助手，请稍后再试。');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <form onSubmit={handleSubmit} className="mb-2">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t('placeholder')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isLoading ? t('querying') : t('queryButton')}
            </button>
          </div>
        </form>

        {/* 建议问题下拉框 */}
        {showSuggestions && (
          <div 
            className="absolute z-10 w-full mt-1 backdrop-blur-md bg-white/70 rounded-lg shadow-lg border border-gray-200/50 divide-y divide-gray-100/50"
            onMouseEnter={() => setShowSuggestions(true)}
            onMouseLeave={() => setShowSuggestions(false)}
          >
            {suggestionQuestions.map((item, index) => (
              <div
                key={index}
                className="p-4 hover:bg-white/40 cursor-pointer transition-all duration-200"
                onClick={() => handleSuggestionClick(item.question)}
              >
                <div className="text-gray-700 text-left mb-1">{item.question}</div>
                <div className="text-sm text-gray-500 text-left">{item.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AIQueryBox; 