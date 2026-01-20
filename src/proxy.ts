import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
)

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/ca-portal',
  '/profile',
  '/settings',
]

// Routes only accessible to specific roles
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/ca-portal': ['CA_EXPERT', 'ADMIN'],
  '/dashboard': ['USER', 'ADMIN', 'CA_EXPERT'],
}

// Routes that should redirect to dashboard if already logged in
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
]

// Public API routes that don't need auth
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/resend-verification',
  '/api/contact',
]

async function verifyTokenFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

function hasRequiredRole(pathname: string, userRole: string): boolean {
  for (const [route, roles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles.includes(userRole)
    }
  }
  return true
}

function getRedirectForRole(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'CA_EXPERT':
      return '/ca-portal/dashboard'
    default:
      return '/dashboard'
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const user = await verifyTokenFromRequest(request)
  const isAuthenticated = !!user

  // Protected routes - require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access
    if (user && !hasRequiredRole(pathname, user.role)) {
      const redirectUrl = new URL(getRedirectForRole(user.role), request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Add user info to headers for server components
    const response = NextResponse.next()
    if (user) {
      response.headers.set('x-user-id', user.userId)
      response.headers.set('x-user-email', user.email)
      response.headers.set('x-user-role', user.role)
    }
    return response
  }

  // Auth routes - redirect to dashboard if already authenticated
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated && user) {
      const redirectUrl = new URL(getRedirectForRole(user.role), request.url)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  // Protected API routes
  if (pathname.startsWith('/api/') && !publicApiRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check role for admin API routes
    if (pathname.startsWith('/api/admin') && user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      )
    }

    const response = NextResponse.next()
    if (user) {
      response.headers.set('x-user-id', user.userId)
      response.headers.set('x-user-email', user.email)
      response.headers.set('x-user-role', user.role)
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/admin/:path*',
    '/ca-portal/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // Auth routes
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password/:path*',
    '/verify-email/:path*',
    // API routes (excluding public ones, handled in proxy)
    '/api/:path*',
  ],
}
