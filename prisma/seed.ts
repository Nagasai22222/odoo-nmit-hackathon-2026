import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // Clean up existing data
  await prisma.attendance.deleteMany()
  await prisma.leaveRequest.deleteMany()
  await prisma.payroll.deleteMany()
  await prisma.document.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dayflow.com',
      passwordHash,
      role: 'ADMIN',
    },
  })

  const adminEmployee = await prisma.employee.create({
    data: {
      userId: adminUser.id,
      employeeId: 'ADM-001',
      firstName: 'Admin',
      lastName: 'User',
      department: 'HR',
      designation: 'HR Manager',
    },
  })

  // Create Employee
  const empUser = await prisma.user.create({
    data: {
      email: 'employee@dayflow.com',
      passwordHash,
      role: 'EMPLOYEE',
    },
  })

  const employee = await prisma.employee.create({
    data: {
      userId: empUser.id,
      employeeId: 'EMP-001',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Engineering',
      designation: 'Software Engineer',
      phone: '123-456-7890',
      address: '123 Main St, City, State',
    },
  })

  // Add Payroll
  await prisma.payroll.create({
    data: {
      employeeId: employee.id,
      baseSalary: 60000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 63000,
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
