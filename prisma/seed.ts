import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "admin@healthnet.com"
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12)
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        firstName: "Admin",
        lastName: "HealthNet",
        password: hashedPassword,
        role: "ADMIN",
        notifications: {
          create: [
            {
              title: "Bienvenue sur HealthNet",
              message: "Votre compte administrateur a ete configure avec succes.",
              type: "SUCCESS",
            },
            {
              title: "Mise a jour systeme",
              message: "Une nouvelle mise a jour de la plateforme est disponible.",
              type: "INFO",
            }
          ]
        }
      }
    })
    console.log("Admin account created: admin@healthnet.com / admin123")
  } else {
    console.log("Admin account already exists")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
