import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  // 不需要认证的路径
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout'];
  const isPublicPath = publicPaths.includes(pathname);

  // 如果是公开路径，允许访问
  if (isPublicPath) {
    // 如果已登录且访问登录页，重定向到首页
    if (token && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 检查token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 简单检查token存在即可，实际验证在API路由中进行
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};