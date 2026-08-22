import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to check in." },
        { status: 401 }
      );
    }

    // Always use authenticated session identity — never trust employee ID sent from client
    const userId = session.userId;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Prevent duplicate active check-ins for today
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return NextResponse.json(
        { error: "Duplicate Check-In: You already have an active check-in session for today." },
        { status: 400 }
      );
    }

    let attendance;
    if (existingAttendance) {
      attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkIn: now,
          status: "PRESENT",
        },
      });
    } else {
      attendance = await prisma.attendance.create({
        data: {
          userId,
          date: now,
          checkIn: now,
          status: "PRESENT",
        },
      });
    }

    return NextResponse.json(
      { message: "Check-in successful!", attendance },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/attendance/check-in error:", error);
    return NextResponse.json(
      { error: "Internal server error during check-in." },
      { status: 500 }
    );
  }
}
