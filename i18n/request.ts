import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export const locales = ['zh', 'en', 'ko'] as const;

export default getRequestConfig(async ({requestLocale}) => {
  // Validate that the incoming `locale` parameter is valid
  let locale = await requestLocale;
  
  // Fallback to default locale if not supported
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
}); 