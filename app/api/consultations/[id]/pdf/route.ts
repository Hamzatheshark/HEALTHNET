import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fs from "fs"
import path from "path"

export async function POST(
  _request: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await params
    const id = resolvedParams.id

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 })
    }

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: "Consultation non trouvée" }, { status: 404 })
    }

    // Permission check
    if (session.user.role === "PATIENT" && consultation.patientId !== session.user.id) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 })
    }

    // PDF generation with pdf-lib
    const pdfDoc = await PDFDocument.create()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    const page = pdfDoc.addPage([595, 842]) // A4
    const { width, height } = page.getSize()
    
    let y = height - 50

    // Header
    page.drawText("HEALTHNET", { x: width / 2 - 50, y, size: 20, font: boldFont, color: rgb(0.1, 0.4, 0.7) })
    y -= 30
    page.drawText("ORDONNANCE MÉDICALE", { x: width / 2 - 80, y, size: 16, font: boldFont })
    y -= 50

    // Doctor info
    page.drawText(`Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`, { x: 50, y, size: 12, font: boldFont })
    y -= 15
    page.drawText(`Spécialité : ${consultation.doctor.specialty || "Médecine Générale"}`, { x: 50, y, size: 11, font })
    
    // Date
    const dateStr = consultation.createdAt ? new Date(consultation.createdAt).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR")
    page.drawText(`Fait le : ${dateStr}`, { x: width - 150, y: height - 130, size: 11, font })
    y -= 60

    // Patient info
    page.drawText(`À l'attention de : ${consultation.patient.firstName} ${consultation.patient.lastName}`, { x: 50, y, size: 12, font: boldFont })
    y -= 40

    // Content - Traitement
    page.drawText("TRAITEMENT :", { x: 50, y, size: 13, font: boldFont })
    y -= 25
    const treatmentLines = (consultation.treatment || "Pas de traitement spécifié").split('\n')
    for (const line of treatmentLines) {
      page.drawText(line, { x: 60, y, size: 11, font })
      y -= 15
    }
    y -= 20

    // Content - Recommendations
    page.drawText("RECOMMANDATIONS :", { x: 50, y, size: 13, font: boldFont })
    y -= 25
    const recommendLines = (consultation.recommendations || "Aucune recommandation particulière").split('\n')
    for (const line of recommendLines) {
      page.drawText(line, { x: 60, y, size: 11, font })
      y -= 15
    }

    // Footer
    page.drawText("Document généré électroniquement par HealthNet", { x: width / 2 - 120, y: 50, size: 9, font, color: rgb(0.5, 0.5, 0.5) })

    const pdfBytes = await pdfDoc.save()
    const pdfBuffer = Buffer.from(pdfBytes)

    const fileName = `ordonnance_${consultation.patient.lastName}_${Date.now()}.pdf`

    const outputDir = "D:\\healthnet-pdfs"
    // Save to disk (Best effort for local dev)
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
      const fullPath = path.join(outputDir, fileName)
      fs.writeFileSync(fullPath, pdfBuffer)
      console.log(`PDF sauvegardé localement : ${fullPath}`)
    } catch (err) {
      console.warn("Échec de la sauvegarde locale sur D:\\ (normal si hors-ligne ou sans permissions) :", err)
    }

    return NextResponse.json({ 
      success: true, 
      message: "PDF sauvegardé localement",
      path: path.join(outputDir, fileName)
    })

  } catch (error: any) {
    console.error("PDF LIB ERROR:", error)
    return NextResponse.json({ 
      error: "Erreur lors de la génération du PDF",
      details: error?.message || String(error)
    }, { status: 500 })
  }
}
