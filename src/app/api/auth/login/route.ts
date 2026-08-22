import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePasswords, signJWT, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Input Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find User
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 3. Verify Password
    const isValidPassword = await comparePasswords(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4. Check Email Verification Status
    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: "Your email address is not verified. Please verify your account before logging in.",
          isVerified: false,
          verificationToken: user.verificationToken,
        },
        { status: 403 }
      );
    }

    // 5. Generate Session Token & Set Cookie
    const token = await signJWT({
      userId: user.id,
      role: user.role,
      email: user.email,
      employeeId: user.employeeId,
    });

    setAuthCookie(token);

    // 6. Determine Role-Aware Dashboard Redirect
    const redirectTo =
      user.role === "HR_ADMIN" ? "/admin/dashboard" : "/employee/dashboard";

    return NextResponse.json(
      {
        message: "Login successful.",
        user: {
          id: user.id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
        },
        redirectTo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
