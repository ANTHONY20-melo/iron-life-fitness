import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function main() {
  const prisma = new PrismaClient()
  
  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@ironlife.com' }
  })
  
  if (existingAdmin) {
    console.log('Admin already exists:', existingAdmin.email, '- Role:', existingAdmin.role)
    await prisma.$disconnect()
    return
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ironlife.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })
  
  console.log('Admin created:', admin.email)
  
  // Create unit admin relationship (assuming unit exists)
  const unit = await prisma.unit.findFirst({
    where: { email: 'matriz@ironlifefitness.com.br' }
  })
  
  if (unit) {
    await prisma.unitAdmin.create({
      data: { userId: admin.id, unitId: unit.id }
    })
    console.log('Unit admin relationship created')
  }
  
  await prisma.$disconnect()
}

main().catch(console.error)