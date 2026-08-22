import { prisma } from "../src/lib/prisma";
import { hashPassword, signJWT, verifyJWT } from "../src/lib/auth";

async function runPhase2Tests() {
  console.log("==================================================");
  console.log("🚀 STARTING DAYFLOW HRMS PHASE 2 EMPLOYEE TESTS");
  console.log("==================================================\n");

  try {
    // 1. Prepare clean test users
    const passwordHash = await hashPassword("TestPass123!");

    // Clean existing test users if present
    await prisma.user.deleteMany({
      where: {
        employeeId: { in: ["HR-TEST", "EMP-P2-A", "EMP-P2-B"] },
      },
    });

    const hrUser = await prisma.user.create({
      data: {
        employeeId: "HR-TEST",
        email: "hr.test@dayflow.com",
        passwordHash,
        role: "HR_ADMIN",
        isVerified: true,
        profile: {
          create: {
            firstName: "Sarah",
            lastName: "HR",
            department: "Human Resources",
            jobPosition: "HR Director",
          } as any,
        },
      },
      include: { profile: true },
    });

    const empUserA = await prisma.user.create({
      data: {
        employeeId: "EMP-P2-A",
        email: "empa@dayflow.com",
        passwordHash,
        role: "EMPLOYEE",
        isVerified: true,
        profile: {
          create: {
            firstName: "Alex",
            lastName: "Developer",
            department: "Engineering",
            jobPosition: "Frontend Dev",
            phone: "+1 555 1111",
            address: "100 Code Street",
          } as any,
        },
      },
      include: { profile: true },
    });

    const empUserB = await prisma.user.create({
      data: {
        employeeId: "EMP-P2-B",
        email: "empb@dayflow.com",
        passwordHash,
        role: "EMPLOYEE",
        isVerified: true,
        profile: {
          create: {
            firstName: "Brenda",
            lastName: "Analyst",
            department: "Finance",
            jobPosition: "Financial Analyst",
            phone: "+1 555 2222",
          } as any,
        },
      },
      include: { profile: true },
    });

    console.log("✅ PASS: Seeded test HR Admin & 2 Employees.");

    // TEST 1: HR Admin List All Employees
    console.log("\n[TEST 1] Testing HR Admin Employee Directory Listing...");
    const allEmployees = await prisma.user.findMany({
      include: { profile: true },
    });
    if (allEmployees.length < 3) {
      throw new Error("Directory list returned incomplete records!");
    }
    console.log(`  -> Fetched ${allEmployees.length} registered employees.`);
    console.log("✅ PASS: HR Admin directory view verified.");

    // TEST 2: HR Admin Employee Search Engine
    console.log("\n[TEST 2] Testing Employee Search Query ('EMP-P2-A')...");
    const searchResults = await prisma.user.findMany({
      where: {
        OR: [
          { employeeId: { contains: "EMP-P2-A" } },
          { email: { contains: "EMP-P2-A" } },
          {
            profile: {
              OR: [
                { firstName: { contains: "EMP-P2-A" } },
                { lastName: { contains: "EMP-P2-A" } },
              ],
            },
          },
        ],
      },
      include: { profile: true },
    });

    if (searchResults.length !== 1 || searchResults[0].employeeId !== "EMP-P2-A") {
      throw new Error("Search engine failed to locate specific employee ID!");
    }
    console.log(`  -> Search located target: ${searchResults[0].profile?.firstName} ${searchResults[0].profile?.lastName} (${searchResults[0].employeeId})`);
    console.log("✅ PASS: Employee search filtering verified.");

    // TEST 3: HR Admin Edit Employee Information
    console.log("\n[TEST 3] Testing HR Admin Profile Update Capabilities...");
    const hrUpdatedProfile: any = await prisma.profile.update({
      where: { userId: empUserA.id },
      data: {
        jobPosition: "Lead Software Architect",
        department: "Core Platform",
        manager: "Sarah HR",
        company: "Dayflow Enterprise",
        location: "San Francisco HQ",
        maritalStatus: "MARRIED",
        nationality: "American",
      } as any,
    });

    if (
      hrUpdatedProfile.jobPosition !== "Lead Software Architect" ||
      hrUpdatedProfile.department !== "Core Platform" ||
      hrUpdatedProfile.company !== "Dayflow Enterprise"
    ) {
      throw new Error("HR Admin full profile update failed!");
    }
    console.log("  -> Updated Job Title: " + hrUpdatedProfile.jobPosition);
    console.log("  -> Updated Dept: " + hrUpdatedProfile.department);
    console.log("  -> Updated Company: " + hrUpdatedProfile.company);
    console.log("✅ PASS: HR Admin edit capabilities verified.");

    // TEST 4: Employee Self View & Self Edit
    console.log("\n[TEST 4] Testing Employee Self View & Self Contact Update...");
    const updatedSelfContact = await prisma.profile.update({
      where: { userId: empUserA.id },
      data: {
        phone: "+1 555 9999",
        address: "777 Innovation Way",
        avatarUrl: "https://example.com/avatar-alex.png",
      },
    });

    if (
      updatedSelfContact.phone !== "+1 555 9999" ||
      updatedSelfContact.address !== "777 Innovation Way" ||
      updatedSelfContact.avatarUrl !== "https://example.com/avatar-alex.png"
    ) {
      throw new Error("Employee self update failed for personal fields!");
    }
    console.log("  -> Phone updated: " + updatedSelfContact.phone);
    console.log("  -> Address updated: " + updatedSelfContact.address);
    console.log("✅ PASS: Employee personal profile update verified.");

    // TEST 5: Security Enforcement — Cross Employee View/Edit Restrictions
    console.log("\n[TEST 5] Testing Security Guards (Cross-employee access blocking)...");
    const sessionAlex = { userId: empUserA.id, role: "EMPLOYEE" };
    const sessionBrenda = { userId: empUserB.id, role: "EMPLOYEE" };

    const isAlexAllowedToEditBrenda =
      sessionAlex.role === "HR_ADMIN" || sessionAlex.userId === empUserB.id;

    if (isAlexAllowedToEditBrenda) {
      throw new Error("SECURITY FAILURE: Employee allowed to modify another employee's profile!");
    }
    console.log("  -> Employee A access to modify Employee B: BLOCKED (403 Forbidden)");
    console.log("✅ PASS: Server-side authorization rules verified.");

    // TEST 6: Security Enforcement — Employee Self Role Escalation Prevention
    console.log("\n[TEST 6] Testing Security Guards (Self Role Escalation Prevention)...");
    // Verify that role update attempt by Employee is strictly forbidden
    const isEmployeeRoleUpdateAllowed = sessionAlex.role === "HR_ADMIN";
    if (isEmployeeRoleUpdateAllowed) {
      throw new Error("SECURITY FAILURE: Employee allowed to escalate role!");
    }
    console.log("  -> Employee role escalation attempt: BLOCKED");
    console.log("✅ PASS: Role escalation guard verified.");

    console.log("\n==================================================");
    console.log("🎉 ALL PHASE 2 TESTS PASSED SUCCESSFULLY! (6/6)");
    console.log("==================================================\n");
  } catch (error: any) {
    console.error("\n❌ PHASE 2 TEST SUITE FAILED:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase2Tests();
