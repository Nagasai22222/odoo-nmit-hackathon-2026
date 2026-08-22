import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const { id } = params;
    const isHrAdmin = session.role === "HR_ADMIN";
    const isSelf = session.userId === id;

    // Security Check: Employee can only view their own profile
    if (!isHrAdmin && !isSelf) {
      return NextResponse.json(
        { error: "Forbidden: You are not authorized to view this profile." },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Employee profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee: user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/employees/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve employee profile." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const { id } = params;
    const isHrAdmin = session.role === "HR_ADMIN";
    const isSelf = session.userId === id;

    // Security Check: Users can only update their own profile or must be HR Admin
    if (!isHrAdmin && !isSelf) {
      return NextResponse.json(
        { error: "Forbidden: You cannot modify another employee's profile." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Employee profile not found." },
        { status: 404 }
      );
    }

    if (isHrAdmin) {
      // HR Admin Full Edit Access
      const {
        role,
        email,
        employeeId,
        firstName,
        lastName,
        phone,
        address,
        designation,
        department,
        jobPosition,
        manager,
        company,
        location,
        dateOfJoining,
        dateOfBirth,
        gender,
        nationality,
        maritalStatus,
        avatarUrl,
      } = body;

      // Update User table if email/role/employeeId changed
      const userUpdates: any = {};
      if (role && (role === "EMPLOYEE" || role === "HR_ADMIN")) {
        userUpdates.role = role;
      }
      if (email && email.trim().toLowerCase() !== targetUser.email) {
        userUpdates.email = email.trim().toLowerCase();
      }
      if (employeeId && employeeId.trim().toUpperCase() !== targetUser.employeeId) {
        userUpdates.employeeId = employeeId.trim().toUpperCase();
      }

      if (Object.keys(userUpdates).length > 0) {
        await prisma.user.update({
          where: { id },
          data: userUpdates,
        });
      }

      const tp: any = targetUser.profile || {};

      // Upsert Profile table
      const profileData: any = {
        firstName: firstName ?? tp.firstName ?? "Employee",
        lastName: lastName ?? tp.lastName ?? "",
        phone: phone ?? tp.phone,
        address: address ?? tp.address,
        designation: designation ?? tp.designation,
        department: department ?? tp.department,
        jobPosition: jobPosition ?? tp.jobPosition ?? designation,
        manager: manager ?? tp.manager,
        company: company ?? tp.company ?? "Dayflow HRMS",
        location: location ?? tp.location,
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : tp.dateOfJoining,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : tp.dateOfBirth,
        gender: gender ?? tp.gender,
        nationality: nationality ?? tp.nationality,
        maritalStatus: maritalStatus ?? tp.maritalStatus,
        avatarUrl: avatarUrl ?? tp.avatarUrl,
      };

      const updatedProfile = await prisma.profile.upsert({
        where: { userId: id },
        create: { userId: id, ...profileData },
        update: profileData,
      });

      const updatedUser = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          employeeId: true,
          email: true,
          role: true,
          isVerified: true,
          profile: true,
        },
      });

      return NextResponse.json(
        { message: "Employee profile updated successfully.", employee: updatedUser },
        { status: 200 }
      );
    } else {
      // Employee Self Limited Edit Access
      // Strictly restricted to personal contact fields
      const {
        phone,
        address,
        avatarUrl,
        gender,
        maritalStatus,
      } = body;

      const tp: any = targetUser.profile || {};

      const profileData: any = {
        phone: phone ?? tp.phone,
        address: address ?? tp.address,
        avatarUrl: avatarUrl ?? tp.avatarUrl,
        gender: gender ?? tp.gender,
        maritalStatus: maritalStatus ?? tp.maritalStatus,
      };

      await prisma.profile.upsert({
        where: { userId: id },
        create: {
          userId: id,
          firstName: targetUser.profile?.firstName || "Employee",
          lastName: targetUser.profile?.lastName || "",
          ...profileData,
        },
        update: profileData,
      });

      const updatedUser = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          employeeId: true,
          email: true,
          role: true,
          isVerified: true,
          profile: true,
        },
      });

      return NextResponse.json(
        { message: "Personal profile updated successfully.", employee: updatedUser },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("PUT /api/employees/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update employee profile." },
      { status: 500 }
    );
  }
}
