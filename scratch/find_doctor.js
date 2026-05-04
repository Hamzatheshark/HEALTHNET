const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const doctors = await prisma.user.findMany({
    where: { role: "MEDECIN" },
    take: 5,
    select: { email: true }
  })
  console.log(JSON.stringify(doctors, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
