import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to check out." },
        { status: 401 }
      );
    }

    // Always use authenticated session identity
    const userId = session.userId;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Find active check-in record for today
    const activeAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        checkIn: { not: null },
        checkOut: null,
      },
    });

    // Prevent checkout without check-in
    if (!activeAttendance || !activeAttendance.checkIn) {
      return NextResponse.json(
        { error: "Invalid Action: Cannot check out without an active check-in session today." },
        { status: 400 }
      );
    }

    const checkInTime = new Date(activeAttendance.checkIn).getTime();
    const checkOutTime = now.getTime();
    const workingHours = Math.round(((checkOutTime - checkInTime) / (1000 * 60 * 60)) * 100) / 100;

    // Automatic status evaluation: >= 4.0 hrs -> PRESENT, < 4.0 hrs -> HALF_DAY
    const status = workingHours >= 4.0 ? "PRESENT" : "HALF_DAY";

    const updatedAttendance = await prisma.attendance.update({
      where: { id: activeAttendance.id },
      data: {
        checkOut: now,
        totalHours: workingHours,
        status,
      },
    });

    return NextResponse.json(
      {
        message: "Check-out recorded successfully!",
        attendance: updatedAttendance,
        workingHours,
        status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/attendance/check-out error:", error);
    return NextResponse.json(
      { error: "Internal server error during check-out." },
      { status: 500 }
    );
  }
}
