import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const medicalFile = {
      patientInfo: {
        name: session.user.name ?? "Patient",
        birthDate: "15/03/1985",
        bloodType: "A+",
        height: "165 cm",
        weight: "62 kg",
        allergies: ["Penicilline", "Arachides"],
        chronicConditions: ["Asthme leger"],
      },
      medicalHistory: [
        {
          date: "2026-03-10",
          type: "Consultation",
          doctor: "Dr. Sophie Bernard",
          summary: "Consultation de routine - Renouvellement ordonnance",
          documents: ["Ordonnance", "Compte-rendu"],
        },
        {
          date: "2026-02-15",
          type: "Examen",
          doctor: "Dr. Marie Leroy",
          summary: "Bilan dermatologique annuel - RAS",
          documents: ["Compte-rendu"],
        },
        {
          date: "2026-01-20",
          type: "Analyse",
          doctor: "Laboratoire Central",
          summary: "Bilan sanguin complet",
          documents: ["Resultats analyses"],
        },
      ],
      currentTreatments: [
        {
          name: "Ventoline",
          dosage: "100 mcg",
          frequency: "Si besoin",
          prescribedBy: "Dr. Sophie Bernard",
          startDate: "01/01/2024",
        },
        {
          name: "Vitamine D",
          dosage: "1000 UI",
          frequency: "1x par jour",
          prescribedBy: "Dr. Sophie Bernard",
          startDate: "15/10/2025",
        },
      ],
      vaccinations: [
        { name: "COVID-19 (3e dose)", date: "15/12/2023", nextDue: "-" },
        { name: "Grippe", date: "10/10/2025", nextDue: "Octobre 2026" },
        { name: "Tetanos", date: "20/05/2021", nextDue: "Mai 2031" },
      ],
    }

    return NextResponse.json(medicalFile)
  } catch (error) {
    console.error("Get medical file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
