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
    const statusParam = searchParams.get("status");
    const targetUserId = searchParams.get("targetUserId");

    const isHrAdmin = session.role === "HR_ADMIN";

    // Security Guard: Employee cannot query another employee's attendance history
    if (!isHrAdmin && targetUserId && targetUserId !== session.userId) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view another employee's attendance history." },
        { status: 403 }
      );
    }

    const userIdToQuery = isHrAdmin ? targetUserId : session.userId;

    const whereClause: any = {};

    if (userIdToQuery) {
      whereClause.userId = userIdToQuery;
    }

    if (statusParam && statusParam !== "ALL") {
      whereClause.status = statusParam;
    }

    if (startDateParam || endDateParam) {
      whereClause.date = {};
      if (startDateParam) whereClause.date.gte = new Date(startDateParam);
      if (endDateParam) whereClause.date.lte = new Date(endDateParam);
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
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error("GET /api/attendance/history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance history." },
      { status: 500 }
    );
  }
}
