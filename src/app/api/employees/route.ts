import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || session.role !== "HR_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: HR/Admin privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const department = searchParams.get("department")?.trim() || "";

    const whereClause: any = {};

    if (department && department !== "ALL") {
      whereClause.profile = {
        department: {
          equals: department,
        },
      };
    }

    if (query) {
      whereClause.OR = [
        { employeeId: { contains: query } },
        { email: { contains: query } },
        {
          profile: {
            OR: [
              { firstName: { contains: query } },
              { lastName: { contains: query } },
              { department: { contains: query } },
              { designation: { contains: query } },
              { jobPosition: { contains: query } },
            ],
          },
        },
      ];
    }

    const employees = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        profile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees." },
      { status: 500 }
    );
  }
}
