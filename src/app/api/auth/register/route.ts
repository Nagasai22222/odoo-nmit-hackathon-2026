import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, email, password, role, firstName, lastName } = body;

    // 1. Validation
    if (!employeeId || !email || !password || !role) {
      return NextResponse.json(
        { error: "Employee ID, Email, Password, and Role are required." },
        { status: 400 }
      );
    }

    const normalizedRole = role.toUpperCase() === "HR" || role.toUpperCase() === "HR_ADMIN"
      ? "HR_ADMIN"
      : "EMPLOYEE";

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmployeeId = employeeId.trim().toUpperCase();

    // Password strength check minimum 6 chars
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 2. Duplicate Checks
    const existingEmployeeId = await prisma.user.findUnique({
      where: { employeeId: normalizedEmployeeId },
    });
    if (existingEmployeeId) {
      return NextResponse.json(
        { error: "Employee ID is already registered." },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email address is already registered." },
        { status: 400 }
      );
    }

    // 3. Password Hashing & Verification Token
    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomUUID();

    // 4. Create User & Profile in unverified state
    const user = await prisma.user.create({
      data: {
        employeeId: normalizedEmployeeId,
        email: normalizedEmail,
        passwordHash,
        role: normalizedRole,
        isVerified: false,
        verificationToken,
        profile: {
          create: {
            firstName: firstName || "Employee",
            lastName: lastName || "",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const devVerificationUrl = `/verify?token=${verificationToken}`;

    return NextResponse.json(
      {
        message: "Registration successful. Please verify your email before logging in.",
        user: {
          id: user.id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        devVerificationUrl,
        verificationToken,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
