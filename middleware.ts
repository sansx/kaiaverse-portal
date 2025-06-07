import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 获取响应对象
  const response = NextResponse.next()

  // 添加安全相关的响应头
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

// 配置匹配的路由
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 