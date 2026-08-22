const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'newadmin@dayflow.com'
  const password = 'admin123'
  
  // Check if exists
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log('Admin already exists!')
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  
  const adminUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'ADMIN',
      name: 'Super Admin',
      companyName: 'Dayflow Inc',
    }
  })
  
  // Create employee record for this admin so profile works
  await prisma.employee.create({
    data: {
      userId: adminUser.id,
      employeeId: 'ADM-002',
      firstName: 'Super',
      lastName: 'Admin',
      department: 'Management',
      designation: 'Director',
    }
  })

  console.log('Successfully created new admin credentials:')
  console.log('Email:', email)
  console.log('Password:', password)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
