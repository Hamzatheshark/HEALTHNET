import { prisma } from '../lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthnet.com' },
    update: {},
    create: {
      email: 'admin@healthnet.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'HealthNet',
      role: 'ADMIN',
    },
  })

  // Doctors
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@healthnet.com' },
    update: {},
    create: {
      email: 'dr.smith@healthnet.com',
      password: hashedPassword,
      firstName: 'Dr. John',
      lastName: 'Smith',
      role: 'MEDECIN',
      specialty: 'Cardiologie',
    },
  })

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.jones@healthnet.com' },
    update: {},
    create: {
      email: 'dr.jones@healthnet.com',
      password: hashedPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Jones',
      role: 'MEDECIN',
      specialty: 'Dermatologie',
    },
  })

  // Patients
  const patient1 = await prisma.user.upsert({
    where: { email: 'patient1@healthnet.com' },
    update: {},
    create: {
      email: 'patient1@healthnet.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Martin',
      role: 'PATIENT',
      phone: '+33123456789',
    },
  })

  const patient2 = await prisma.user.upsert({
    where: { email: 'patient2@healthnet.com' },
    update: {},
    create: {
      email: 'patient2@healthnet.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Wilson',
      role: 'PATIENT',
      phone: '+33987654321',
    },
  })

  // Secretary
  const secretary = await prisma.user.upsert({
    where: { email: 'sec@healthnet.com' },
    update: {},
    create: {
      email: 'sec@healthnet.com',
      password: hashedPassword,
      firstName: 'Marie',
      lastName: 'Dubois',
      role: 'SECRETAIRE',
    },
  })

  // Create appointments
  const appointment1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      date: new Date('2024-06-15'),
      time: '10:00',
      type: 'IN_PERSON',
      location: 'Cabinet 1',
      status: 'CONFIRMED',
      reason: 'Consultation de routine',
    },
  })

  const appointment2 = await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      date: new Date('2024-06-16'),
      time: '14:30',
      type: 'TELECONSULTATION',
      status: 'PENDING',
      reason: 'Suivi dermatologique',
    },
  })

  // Create consultations
  await prisma.consultation.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor1.id,
      date: new Date('2024-05-20'),
      reason: 'Douleurs thoraciques',
      diagnosis: 'Hypertension légère',
      prescription: true,
      followUp: 'Contrôle dans 3 mois',
      notes: 'Patient stable, traitement prescrit',
      appointmentId: appointment1.id,
    },
  })

  await prisma.consultation.create({
    data: {
      patientId: patient2.id,
      doctorId: doctor2.id,
      date: new Date('2024-05-10'),
      reason: 'Éruption cutanée',
      diagnosis: 'Dermatite allergique',
      prescription: true,
      followUp: 'Application crème 2x/jour',
      notes: 'Réaction à un nouveau savon',
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📋 Test accounts:')
  console.log('Admin: admin@healthnet.com / password123')
  console.log('Doctor: dr.smith@healthnet.com / password123')
  console.log('Patient: patient1@healthnet.com / password123')
  console.log('Secretary: sec@healthnet.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })