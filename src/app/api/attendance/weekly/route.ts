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
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const targetUserId = searchParams.get("targetUserId");

    const isHrAdmin = session.role === "HR_ADMIN";

    // Security Guard: Employee cannot query another employee's weekly logs
    if (!isHrAdmin && targetUserId && targetUserId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view another employee's weekly logs." },
        { status: 403 }
      );
    }

    const userIdToQuery = isHrAdmin ? targetUserId : session.userId;

    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMon = (dayOfWeek + 6) % 7;

    const defaultStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMon);
    const defaultEnd = new Date(defaultStart.getFullYear(), defaultStart.getMonth(), defaultStart.getDate() + 6, 23, 59, 59, 999);

    const startDate = startDateParam ? new Date(startDateParam) : defaultStart;
    const endDate = endDateParam ? new Date(endDateParam) : defaultEnd;

    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate,
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
      orderBy: { date: "asc" },
    });

    const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const presentCount = records.filter((r) => r.status === "PRESENT").length;
    const halfDayCount = records.filter((r) => r.status === "HALF_DAY").length;
    const leaveCount = records.filter((r) => r.status === "LEAVE").length;

    return NextResponse.json(
      {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        totalShifts: records.length,
        totalHours: Math.round(totalHours * 100) / 100,
        summary: { presentCount, halfDayCount, leaveCount },
        records,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/attendance/weekly error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly attendance records." },
      { status: 500 }
    );
  }
}
