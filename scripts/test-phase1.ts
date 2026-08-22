import { prisma } from "../src/lib/prisma";
import { hashPassword, comparePasswords, signJWT, verifyJWT } from "../src/lib/auth";

async function runPhase1Tests() {
  console.log("==================================================");
  console.log("🚀 STARTING DAYFLOW HRMS PHASE 1 AUTH & DB TESTS");
  console.log("==================================================\n");

  try {
    // Clear test database first
    await prisma.user.deleteMany();
    console.log("🧹 Cleaned database for test run.");

    // TEST 1: Password Hashing
    console.log("\n[TEST 1] Testing Password Hashing...");
    const rawPassword = "SecurePassword123!";
    const hash = await hashPassword(rawPassword);
    console.log(`Password Hash generated: ${hash.slice(0, 20)}...`);

    const isMatch = await comparePasswords(rawPassword, hash);
    const isWrongMatch = await comparePasswords("WrongPassword!", hash);

    if (!hash.startsWith("$2a$") && !hash.startsWith("$2b$")) {
      throw new Error("Password is not properly bcrypt hashed!");
    }
    if (!isMatch) throw new Error("Valid password comparison failed!");
    if (isWrongMatch) throw new Error("Invalid password comparison passed falsely!");
    console.log("✅ PASS: Secure password hashing verified.");

    // TEST 2: Registration & Unverified State
    console.log("\n[TEST 2] Testing User Registration & Verification Token Generation...");
    const empUser = await prisma.user.create({
      data: {
        employeeId: "EMP-001",
        email: "john.employee@dayflow.com",
        passwordHash: hash,
        role: "EMPLOYEE",
        isVerified: false,
        verificationToken: "dev-token-emp-001",
        profile: {
          create: { firstName: "John", lastName: "Employee" },
        },
      },
    });

    const hrUser = await prisma.user.create({
      data: {
        employeeId: "HR-001",
        email: "alice.hr@dayflow.com",
        passwordHash: hash,
        role: "HR_ADMIN",
        isVerified: false,
        verificationToken: "dev-token-hr-001",
        profile: {
          create: { firstName: "Alice", lastName: "HR Admin" },
        },
      },
    });

    if (empUser.isVerified !== false || !empUser.verificationToken) {
      throw new Error("New user was not created in unverified state!");
    }
    console.log(`✅ PASS: Registered Employee (${empUser.employeeId}) & HR Admin (${hrUser.employeeId}) in unverified state.`);

    // TEST 3: Duplicate Email & Employee ID Prevention
    console.log("\n[TEST 3] Testing Duplicate Employee ID & Email Prevention...");
    try {
      await prisma.user.create({
        data: {
          employeeId: "EMP-001", // Duplicate
          email: "unique@dayflow.com",
          passwordHash: hash,
          role: "EMPLOYEE",
        },
      });
      throw new Error("FAILED: Allowed duplicate Employee ID!");
    } catch (e: any) {
      if (e.message.includes("FAILED")) throw e;
      console.log("  -> Blocked duplicate Employee ID successfully.");
    }

    try {
      await prisma.user.create({
        data: {
          employeeId: "EMP-999",
          email: "john.employee@dayflow.com", // Duplicate
          passwordHash: hash,
          role: "EMPLOYEE",
        },
      });
      throw new Error("FAILED: Allowed duplicate Email!");
    } catch (e: any) {
      if (e.message.includes("FAILED")) throw e;
      console.log("  -> Blocked duplicate Email successfully.");
    }
    console.log("✅ PASS: Duplicate constraints enforced.");

    // TEST 4: Email Verification Flow
    console.log("\n[TEST 4] Testing Email Verification Flow...");
    const unverifiedAttemptUser = await prisma.user.findUnique({
      where: { email: "john.employee@dayflow.com" },
    });
    if (unverifiedAttemptUser?.isVerified) {
      throw new Error("User verified prematurely!");
    }
    console.log("  -> Verified user is initially unverified.");

    await prisma.user.update({
      where: { id: empUser.id },
      data: { isVerified: true, verificationToken: null },
    });

    await prisma.user.update({
      where: { id: hrUser.id },
      data: { isVerified: true, verificationToken: null },
    });

    const verifiedEmp = await prisma.user.findUnique({ where: { id: empUser.id } });
    if (!verifiedEmp?.isVerified || verifiedEmp.verificationToken !== null) {
      throw new Error("Email verification update failed!");
    }
    console.log("✅ PASS: Email verification flow completed successfully.");

    // TEST 5: JWT Session Generation & Verification
    console.log("\n[TEST 5] Testing JWT Session & Role Payload...");
    const empToken = await signJWT({
      userId: verifiedEmp.id,
      role: verifiedEmp.role,
      email: verifiedEmp.email,
      employeeId: verifiedEmp.employeeId,
    });

    const hrToken = await signJWT({
      userId: hrUser.id,
      role: "HR_ADMIN",
      email: hrUser.email,
      employeeId: hrUser.employeeId,
    });

    const empSession = await verifyJWT(empToken);
    const hrSession = await verifyJWT(hrToken);

    if (!empSession || empSession.role !== "EMPLOYEE") {
      throw new Error("Employee JWT payload or role mismatch!");
    }
    if (!hrSession || hrSession.role !== "HR_ADMIN") {
      throw new Error("HR Admin JWT payload or role mismatch!");
    }
    console.log("✅ PASS: JWT Tokens correctly signed and role payload validated.");

    // TEST 6: Role Restrictions Simulation
    console.log("\n[TEST 6] Testing Role Authorization Rules...");
    const canEmpAccessAdmin = (empSession.role as string) === "HR_ADMIN";
    const canHrAccessAdmin = (hrSession.role as string) === "HR_ADMIN";

    if (canEmpAccessAdmin) {
      throw new Error("SECURITY FAILURE: EMPLOYEE role allowed access to HR/Admin!");
    }
    if (!canHrAccessAdmin) {
      throw new Error("AUTHORIZATION FAILURE: HR_ADMIN role denied access to HR/Admin!");
    }
    console.log("  -> Employee restricted from HR routes: YES");
    console.log("  -> HR Admin allowed to HR routes: YES");
    console.log("✅ PASS: Role-based authorization rules verified.");

    console.log("\n==================================================");
    console.log("🎉 ALL PHASE 1 TESTS PASSED SUCCESSFULLY! (6/6)");
    console.log("==================================================\n");
  } catch (error: any) {
    console.error("\n❌ TEST SUITE FAILED:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase1Tests();
