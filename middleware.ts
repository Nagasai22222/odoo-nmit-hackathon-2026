import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "dayflow_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dayflow-hrms-super-secret-key-2026-secure-auth-jwt"
);

interface SessionPayload {
  userId: string;
  role: string;
  email: string;
  employeeId: string;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const session = token ? await verifyToken(token) : null;

  // Protected route matching
  const isEmployeeRoute = pathname.startsWith("/employee");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // 1. Unauthenticated users accessing protected routes -> redirect to login
  if ((isEmployeeRoute || isAdminRoute) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Role restriction: EMPLOYEE attempting to access HR/Admin routes -> redirect to employee dashboard
  if (isAdminRoute && session && session.role !== "HR_ADMIN") {
    // If it's an API request under /api/admin, return 403 status JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Forbidden: HR/Admin authorization required." },
        { status: 403 }
      );
    }
    const dashboardUrl = new URL("/employee/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "unauthorized_admin_access");
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Authenticated users visiting login/register -> redirect to appropriate dashboard
  if (isAuthRoute && session) {
    const targetDashboard =
      session.role === "HR_ADMIN" ? "/admin/dashboard" : "/employee/dashboard";
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*", "/admin/:path*", "/login", "/register"],
};
