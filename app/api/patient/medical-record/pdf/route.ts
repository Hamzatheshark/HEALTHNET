import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const patient = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        medicalRecord: {
          include: {
            treatments: true,
            vaccinations: true,
          }
        },
        consultationsAsPatient: {
          include: { doctor: true },
          orderBy: { createdAt: "desc" },
          take: 50 // Limit to avoid too large PDFs
        }
      }
    })

    if (!patient || !patient.medicalRecord) {
      return NextResponse.json({ error: "Dossier médical non trouvé" }, { status: 404 })
    }

    // PDF generation with pdf-lib
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    let page = pdfDoc.addPage([595, 842])
    const { width, height } = page.getSize()
    let y = height - 50

    const checkPage = (requiredHeight: number) => {
      if (y < requiredHeight) {
        page = pdfDoc.addPage([595, 842])
        y = height - 50
        return true
      }
      return false
    }

    // Header
    page.drawText("DOSSIER MÉDICAL PERSONNEL", { x: width / 2 - 100, y, size: 20, font: boldFont, color: rgb(0.1, 0.4, 0.7) })
    y -= 30
    page.drawText("HEALTHNET", { x: width / 2 - 40, y, size: 14, font: boldFont })
    y -= 50

    // 1. Personal Info
    page.drawText("1. INFORMATIONS PERSONNELLES", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    page.drawText(`Nom complet : ${patient.lastName} ${patient.firstName}`, { x: 50, y, size: 11, font })
    y -= 15
    page.drawText(`Email : ${patient.email}`, { x: 50, y, size: 11, font })
    y -= 15
    page.drawText(`Date de naissance : ${patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("fr-FR") : "N/A"}`, { x: 50, y, size: 11, font })
    y -= 15
    page.drawText(`Groupe Sanguin : ${patient.medicalRecord.bloodType || "Inconnu"}`, { x: 50, y, size: 11, font })
    y -= 40

    // 2. Vitals
    checkPage(150)
    page.drawText("2. DONNÉES MORPHOLOGIQUES", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    page.drawText(`Taille : ${patient.medicalRecord.height || "N/A"} cm`, { x: 50, y, size: 11, font })
    y -= 15
    page.drawText(`Poids : ${patient.medicalRecord.weight || "N/A"} kg`, { x: 50, y, size: 11, font })
    y -= 40

    // 3. History
    checkPage(150)
    page.drawText("3. ANTÉCÉDENTS & ALLERGIES", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    page.drawText(`Allergies : ${patient.medicalRecord.allergies || "Aucune allergie connue"}`, { x: 50, y, size: 11, font })
    y -= 15
    page.drawText(`Maladies Chroniques : ${patient.medicalRecord.chronicDiseases || "Aucune"}`, { x: 50, y, size: 11, font })
    y -= 40

    // 4. Treatments
    checkPage(150)
    page.drawText("4. TRAITEMENTS EN COURS", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    if (patient.medicalRecord.treatments.length > 0) {
      for (const t of patient.medicalRecord.treatments) {
        checkPage(50)
        page.drawText(`- ${t.name} (${t.dosage}) : ${t.frequency}`, { x: 60, y, size: 11, font })
        y -= 15
      }
    } else {
      page.drawText("Aucun traitement actif enregistré.", { x: 60, y, size: 11, font })
      y -= 15
    }
    y -= 30

    // 5. Consultations
    checkPage(150)
    page.drawText("5. HISTORIQUE DES CONSULTATIONS", { x: 50, y, size: 14, font: boldFont })
    y -= 25
    if (patient.consultationsAsPatient.length > 0) {
      for (const c of patient.consultationsAsPatient) {
        checkPage(60)
        const cDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString("fr-FR") : "N/A"
        const doctorName = c.doctor ? `${c.doctor.firstName} ${c.doctor.lastName}` : "Inconnu"
        page.drawText(`${cDate} - Dr. ${doctorName} : ${c.reason}`, { x: 60, y, size: 11, font })
        y -= 15
        if (c.diagnosis) {
          page.drawText(`  Diagnostic : ${c.diagnosis}`, { x: 80, y, size: 10, font })
          y -= 15
        }
      }
    } else {
      page.drawText("Aucune consultation enregistrée.", { x: 60, y, size: 11, font })
      y -= 15
    }

    const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes)

    const outputDir = "D:\\healthnet-pdfs"
    const fileName = `dossier_${patient.lastName}_${Date.now()}.pdf`

    // Save to disk (Best effort for local dev)
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      const fullPath = path.join(outputDir, fileName)
      fs.writeFileSync(fullPath, pdfBuffer)
      console.log(`Dossier PDF sauvegardé localement : ${fullPath}`)
    } catch (err) {
      console.warn("Échec de la sauvegarde locale sur D:\\ :", err)
    }

    return NextResponse.json({ 
      success: true, 
      message: "Dossier médical sauvegardé localement",
      path: path.join(outputDir, fileName)
    })

  } catch (error: any) {
    console.error("PDF LIB ERROR:", error)
    return NextResponse.json({ 
      error: "Erreur lors de la génération du dossier PDF",
      details: error?.message || String(error)
    }, { status: 500 })
  }
}
