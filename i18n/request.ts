import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// 支持的语言列表
export const locales = ['en', 'zh', 'ko'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({requestLocale}) => {
  // 获取请求的语言
  const locale = await requestLocale;
  
  // 验证传入的语言是否支持
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 