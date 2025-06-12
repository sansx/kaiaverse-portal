'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SuggestionQuestion {
  question: string;
  description: string;
}

const AIQueryBox = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const t = useTranslations('aiQuery');

  // 示例建议问题列表
  const suggestionQuestions = t.raw('suggestions') as SuggestionQuestion[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: 实现与AI后端的集成
    // 这里是模拟响应
    setTimeout(() => {
      setResult(t('sampleResponse'));
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestionClick = (question: string) => {
    setQuery(question);
    setShowSuggestions(false);
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
              disabled={isLoading}
              className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
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

      {result && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-semibold mb-2">{t('responseTitle')}</h3>
          <p className="text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
};

export default AIQueryBox; 