import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const orientationRules = [
  { keywords: ["tête", "migraine", "céphalée"], specialty: "Neurologue", advice: "Il est conseillé de consulter un neurologue si les maux de tête sont persistants." },
  { keywords: ["coeur", "palpitations", "poitrine", "tension"], specialty: "Cardiologue", advice: "Une douleur à la poitrine nécessite une consultation rapide chez un cardiologue." },
  { keywords: ["dos", "articulation", "genou", "os"], specialty: "Rhumatologue", advice: "Un rhumatologue pourra vous aider pour vos douleurs articulaires." },
  { keywords: ["peau", "bouton", "démangeaison", "acné"], specialty: "Dermatologue", advice: "Consultez un dermatologue pour tout problème cutané persistant." },
  { keywords: ["oeil", "yeux", "vue", "vision"], specialty: "Ophtalmologue", advice: "Un bilan de la vue chez un ophtalmologue est recommandé." },
  { keywords: ["enfant", "bébé", "nourrisson"], specialty: "Pédiatre", advice: "Les soins pour enfants doivent être suivis par un pédiatre." },
  { keywords: ["ventre", "estomac", "digestion"], specialty: "Gastro-entérologue", advice: "Un gastro-entérologue pourra explorer vos problèmes digestifs." },
  { keywords: ["dent", "gencive", "bouche"], specialty: "Dentiste", advice: "Prenez rendez-vous avec un dentiste pour vos soins dentaires." },
]

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    // Normalisation : enlever les accents et mettre en minuscule
    const normalize = (str: string) => 
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const normalizedMessage = normalize(message)

    let foundRule = orientationRules.find(rule => 
      rule.keywords.some(keyword => normalizedMessage.includes(normalize(keyword)))
    )

    if (foundRule) {
      // Find real doctors with this specialty
      const suggestedDoctors = await prisma.user.findMany({
        where: {
          role: "MEDECIN",
          specialty: foundRule.specialty
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          specialty: true
        },
        take: 3
      })

      return NextResponse.json({
        response: `D'après vos symptômes, je vous oriente vers un **${foundRule.specialty}**. ${foundRule.advice}`,
        specialty: foundRule.specialty,
        doctors: suggestedDoctors,
        suggestion: suggestedDoctors.length > 0 
          ? `Voici quelques ${foundRule.specialty}s disponibles sur notre plateforme :`
          : `Malheureusement, aucun ${foundRule.specialty} n'est inscrit pour le moment. Nous vous conseillons de consulter un Généraliste.`
      })
    }

    // Si aucune règle spécifique, on cherche des généralistes
    const generalistes = await prisma.user.findMany({
      where: {
        role: "MEDECIN",
        specialty: { contains: "Généraliste" }
      },
      select: { id: true, firstName: true, lastName: true, specialty: true },
      take: 3
    })

    return NextResponse.json({
      response: "Je ne parviens pas à identifier une spécialité précise. Il est préférable de consulter un **Médecin Généraliste** pour un premier diagnostic.",
      specialty: "Généraliste",
      doctors: generalistes,
      suggestion: generalistes.length > 0 
        ? "Souhaitez-vous prendre rendez-vous avec l'un de nos généralistes ?"
        : "N'hésitez pas à consulter votre médecin traitant habituel."
    })

  } catch (error) {
    console.error("Chatbot error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
