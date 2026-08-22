import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: { passwordHash: hash }, // Ensure password is set
    create: {
      email: 'admin@dayflow.com',
      passwordHash: hash,
      role: 'ADMIN',
      name: 'HR Admin',
      companyName: 'Dayflow Inc.'
    }
  })
  console.log('Admin user created successfully!')
  console.log(`Email: ${admin.email}`)
  console.log('Password: admin123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
