import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { routePath } from '@/config/route-path'

const PUBLIC_PATHS = [routePath.forbidden, '/404']
const AUTH_PATHS = [routePath.login]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Đã login mà vào /login → redirect dashboard
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    if (token) {
      return NextResponse.redirect(new URL(routePath.dashboard, request.url))
    }
    return NextResponse.next()
  }

  // Protected: chưa login → redirect /login
  if (!token) {
    const loginUrl = new URL(routePath.login, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
