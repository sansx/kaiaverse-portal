import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/request';

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed' // 默认语言不显示前缀
});

export function middleware(request: NextRequest) {
  // 先处理国际化路由
  const response = intlMiddleware(request);
  
  // 添加安全相关的响应头
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// 配置匹配的路由 - 排除 API 路由和静态资源
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 