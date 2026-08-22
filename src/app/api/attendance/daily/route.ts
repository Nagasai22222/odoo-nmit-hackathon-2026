import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");
    const targetUserId = searchParams.get("targetUserId");

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);

    const isHrAdmin = session.role === "HR_ADMIN";

    // Security check: Regular employees cannot view other employees' daily records
    if (!isHrAdmin && targetUserId && targetUserId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view another employee's attendance record." },
        { status: 403 }
      );
    }

    const userIdToQuery = isHrAdmin ? targetUserId : session.userId;

    const whereClause: any = {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (userIdToQuery) {
      whereClause.userId = userIdToQuery;
    }

    const records = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        date: startOfDay.toISOString().split("T")[0],
        records,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/attendance/daily error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily attendance records." },
      { status: 500 }
    );
  }
}
