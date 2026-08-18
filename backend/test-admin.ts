import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const admin = await prisma.user.findUnique({where: {email: 'admin@ironlife.com'}});
  console.log('Admin:', admin ? 'EXISTS - role: ' + admin.role : 'NOT FOUND');
  await prisma.$disconnect();
}

main().catch(console.error);