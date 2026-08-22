import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ leaves }, { status: 200 });
  } catch (error) {
    console.error("GET /api/leaves error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leave requests." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { leaveType, startDate, endDate, reason } = body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "All leave request fields (leave type, start date, end date, reason) are required." },
        { status: 400 }
      );
    }

    const validLeaveTypes = ["PAID", "SICK", "UNPAID"];
    const normalizedType = String(leaveType).toUpperCase();
    if (!validLeaveTypes.includes(normalizedType)) {
      return NextResponse.json(
        { error: "Invalid leave type. Must be PAID, SICK, or UNPAID." },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format provided for start date or end date." },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: "End date cannot be before start date." },
        { status: 400 }
      );
    }

    if (typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "A valid reason for leave is required." },
        { status: 400 }
      );
    }

    if (reason.trim().length > 500) {
      return NextResponse.json(
        { error: "Reason exceeds maximum length limit of 500 characters." },
        { status: 400 }
      );
    }

    // Overlapping active leave request check
    const overlapping = await prisma.leaveRequest.findFirst({
      where: {
        userId: session.userId,
        status: { in: ["PENDING", "APPROVED"] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "You already have an active or pending leave request for an overlapping period." },
        { status: 400 }
      );
    }

    // Always enforce server-assigned status = PENDING and authenticated session userId
    const leave = await prisma.leaveRequest.create({
      data: {
        userId: session.userId,
        leaveType: normalizedType,
        startDate: start,
        endDate: end,
        reason: reason.trim(),
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Leave request submitted successfully!", leave },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/leaves error:", error);
    return NextResponse.json(
      { error: "Failed to submit leave request." },
      { status: 500 }
    );
  }
}
