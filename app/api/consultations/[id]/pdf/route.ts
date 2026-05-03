import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import PDFDocument from "pdfkit"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: consultationId } = params

    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        patient: true,
        doctor: true,
      }
    })

    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 })
    }

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))

    // Header
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("HealthNet - Compte-rendu de Consultation", { align: "center" })
      .moveDown()

    doc
      .fontSize(10)
      .text(`Date: ${consultation.date.toLocaleDateString()}`, { align: "right" })
      .text(`Reference: ${consultation.id}`, { align: "right" })
      .moveDown()

    // Doctor & Patient Info
    doc
      .fontSize(12)
      .text("Informations Medecin:", { underline: true })
      .text(`Dr. ${consultation.doctor.firstName} ${consultation.doctor.lastName}`)
      .text(`Specialite: ${consultation.doctor.specialty || "Generaliste"}`)
      .moveDown()

    doc
      .text("Informations Patient:", { underline: true })
      .text(`Nom: ${consultation.patient.firstName} ${consultation.patient.lastName}`)
      .text(`Email: ${consultation.patient.email}`)
      .moveDown()

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Consultation Details
    doc
      .fontSize(14)
      .text("Details de la Consultation", { bold: true })
      .moveDown(0.5)

    doc
      .fontSize(12)
      .text("Motif:", { bold: true })
      .text(consultation.reason)
      .moveDown()

    if (consultation.diagnosis) {
      doc
        .text("Diagnostic:", { bold: true })
        .text(consultation.diagnosis)
        .moveDown()
    }

    if (consultation.treatment) {
      doc
        .text("Traitement prescrit:", { bold: true })
        .text(consultation.treatment)
        .moveDown()
    }

    if (consultation.recommendations) {
      doc
        .text("Recommandations:", { bold: true })
        .text(consultation.recommendations)
        .moveDown()
    }

    if (consultation.notes) {
      doc
        .text("Notes complementaires:", { bold: true })
        .text(consultation.notes)
        .moveDown()
    }

    // Footer
    const bottom = 750
    doc
      .fontSize(10)
      .text(
        "Ce document est un compte-rendu officiel genere par la plateforme HealthNet.",
        50,
        bottom,
        { align: "center", width: 500 }
      )

    doc.end()

    // Wait for the PDF to be fully generated
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks))
      })
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="consultation_${consultation.id}.pdf"`,
      }
    })

  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
