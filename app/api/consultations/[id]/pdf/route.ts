import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import PDFDocument from "pdfkit"
import fs from "fs"
import path from "path"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["MEDECIN", "SECRETAIRE", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 })
    }

    // PDF generation
    const doc = new PDFDocument()
    const fileName = `ordonnance_${consultation.patient.lastName}_${new Date().getTime()}.pdf`
    const outputDir = "D:\\healthnet-pdfs"
    
    // Check if D: exists, if not use a relative path as fallback but warn
    let finalPath = path.join(outputDir, fileName)
    
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }
    } catch (err) {
      console.error("Failed to create D:\\healthnet-pdfs, falling back to local storage", err)
      const fallbackDir = path.join(process.cwd(), "public", "pdfs")
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true })
      }
      finalPath = path.join(fallbackDir, fileName)
    }

    const stream = fs.createWriteStream(finalPath)
    doc.pipe(stream)

    // Header
    doc.fontSize(20).text("HEALTHNET - ORDONNANCE", { align: "center" })
    doc.moveDown()
    
    // Doctor info
    doc.fontSize(12).text(`Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`)
    doc.text(`Spécialité : ${consultation.doctor.specialty || "Médecine Générale"}`)
    doc.moveDown()
    
    // Date
    doc.text(`Date : ${new Date().toLocaleDateString()}`, { align: "right" })
    doc.moveDown()
    
    // Patient info
    doc.text(`Patient : ${consultation.patient.firstName} ${consultation.patient.lastName}`)
    doc.moveDown()
    
    // Content
    doc.fontSize(14).text("Traitement prescrit :", { underline: true })
    doc.fontSize(12).text(consultation.treatment || "Aucun traitement spécifié")
    doc.moveDown()
    
    doc.fontSize(14).text("Recommandations :", { underline: true })
    doc.fontSize(12).text(consultation.recommendations || "Aucune recommandation")
    doc.moveDown()
    
    // Footer
    doc.fontSize(10).text("Document généré par HealthNet", { align: "center", baseline: "bottom" })

    doc.end()

    return NextResponse.json({ success: true, path: finalPath })

  } catch (error) {
    console.error("PDF Generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
