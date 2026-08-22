import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

const protectedRoutes = ['/admin', '/employee', '/dashboard', '/profile', '/attendance', '/leave', '/payroll']
const publicRoutes = ['/', '/login', '/signup']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const session = request.cookies.get('session')?.value
  const parsedSession = session ? await decrypt(session) : null

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !parsedSession) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Redirect authenticated users away from public auth routes
  if (isPublicRoute && parsedSession && path !== '/') {
    const dashboardUrl = parsedSession.role === 'ADMIN' ? '/admin/dashboard' : '/employee/dashboard'
    return NextResponse.redirect(new URL(dashboardUrl, request.nextUrl))
  }

  // Enforce role-based access
  if (parsedSession) {
    const isAdminRoute = path.startsWith('/admin')
    const isEmployeeRoute = path.startsWith('/employee')

    if (isAdminRoute && parsedSession.role !== 'ADMIN') {
      // Employee trying to access admin
      return NextResponse.redirect(new URL('/employee/dashboard', request.nextUrl))
    }

    if (isEmployeeRoute && parsedSession.role !== 'EMPLOYEE') {
      // Admin trying to access employee routes (optional: might allow admin to see employee stuff, but strictly it says "prevent EMPLOYEE from admin")
      // Based on requirements, admins have their own dashboard. We will redirect them to their dashboard.
      return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
