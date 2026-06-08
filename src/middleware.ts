import { NextResponse, type NextRequest } from 'next/server'

/**
 * Edge-level guard for /admin/*. The cookie presence check here is a coarse
 * pre-filter; real authorization happens in the admin layout (Server Component)
 * via `getSession()` and Server Actions via `requirePermission()`.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('pflegenest_session')?.value
    if (!token) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
