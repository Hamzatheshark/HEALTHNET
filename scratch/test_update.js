const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const patientId = "cmopuv7930009qmtohqjjiqas" // Patient 1 from my previous check
  console.log(`Trying to update patient ${patientId}`)
  
  const updatedUser = await prisma.user.update({
    where: { id: patientId },
    data: {
      birthDate: new Date("1990-01-01"),
      cin: "TEST1234"
    }
  })
  
  console.log("Updated User:", JSON.stringify(updatedUser, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
