import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const orientationRules = [
  { 
    keywords: ["tete", "migraine", "cephalee", "cerveau"], 
    specialty: "Neurologue", 
    advice: "Il est conseillé de consulter un neurologue si les maux de tête sont persistants ou accompagnés de troubles de la vision.",
    recommendation: "En attendant, reposez-vous dans une pièce sombre et calme. Évitez les écrans."
  },
  { 
    keywords: ["coeur", "palpitations", "poitrine", "tension", "bras gauche"], 
    specialty: "Cardiologue", 
    advice: "Une douleur à la poitrine irradiant vers le bras gauche nécessite une consultation en urgence.",
    recommendation: "Asseyez-vous, restez calme et appelez le 15 si la douleur persiste plus de quelques minutes."
  },
  { 
    keywords: ["dos", "articulation", "genou", "os", "coude", "hanche"], 
    specialty: "Rhumatologue", 
    advice: "Un rhumatologue pourra vous aider pour vos douleurs articulaires chroniques.",
    recommendation: "Appliquez du chaud ou du froid selon le type de douleur pour soulager l'inflammation."
  },
  { 
    keywords: ["peau", "bouton", "demangeaison", "acne", "grain de beaute", "rougeur"], 
    specialty: "Dermatologue", 
    advice: "Consultez un dermatologue pour tout changement suspect d'un grain de beauté.",
    recommendation: "Évitez de gratter les lésions et utilisez des soins doux sans parfum."
  },
  { 
    keywords: ["oeil", "yeux", "vue", "vision", "lunettes"], 
    specialty: "Ophtalmologue", 
    advice: "Un bilan de la vue chez un ophtalmologue est recommandé tous les 2 ans.",
    recommendation: "Reposez vos yeux régulièrement en suivant la règle des 20-20-20 (toutes les 20 min, regardez à 20 pieds pendant 20 sec)."
  },
  { 
    keywords: ["enfant", "bebe", "nourrisson", "pediatrie"], 
    specialty: "Pédiatre", 
    advice: "Les soins pour enfants doivent être suivis par un pédiatre pour un développement optimal.",
    recommendation: "Veillez à ce que le carnet de santé soit à jour pour les vaccinations."
  },
  { 
    keywords: ["ventre", "estomac", "digestion", "nausee", "diarrhee"], 
    specialty: "Gastro-entérologue", 
    advice: "Un gastro-entérologue pourra explorer vos problèmes digestifs chroniques.",
    recommendation: "Privilégiez une alimentation légère et hydratez-vous abondamment avec de l'eau ou des infusions."
  },
  { 
    keywords: ["dent", "gencive", "bouche", "carie"], 
    specialty: "Dentiste", 
    advice: "Une visite annuelle chez le dentiste prévient la majorité des complications dentaires.",
    recommendation: "Brossez-vous les dents 2 fois par jour pendant 2 minutes avec un dentifrice fluoré."
  },
  { 
    keywords: ["stress", "anxiete", "sommeil", "deprime", "moral", "triste"], 
    specialty: "Psychologue", 
    advice: "Parler à un professionnel peut grandement aider à surmonter les périodes difficiles.",
    recommendation: "Pratiquez la cohérence cardiaque ou la méditation pour réguler votre stress au quotidien."
  },
  { 
    keywords: ["femme", "grossesse", "regles", "enceinte", "gyneco"], 
    specialty: "Gynécologue", 
    advice: "Un suivi gynécologique régulier est essentiel pour la santé reproductive.",
    recommendation: "N'oubliez pas d'effectuer vos frottis de dépistage tous les 3 ans."
  },
  { 
    keywords: ["poumons", "toux", "respiration", "asthme", "souffle"], 
    specialty: "Pneumologue", 
    advice: "Une toux persistante de plus de 3 semaines nécessite un avis médical spécialisé.",
    recommendation: "Évitez les environnements enfumés ou pollués qui irritent les voies respiratoires."
  },
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
          specialty: { contains: foundRule.specialty }
        },
        select: { id: true, firstName: true, lastName: true, specialty: true },
        take: 3
      })

      const responseText = `D'après vos symptômes, je vous oriente vers un **${foundRule.specialty}**. ${foundRule.advice}\n\n**Conseil santé :** ${foundRule.recommendation}`

      return NextResponse.json({
        response: responseText,
        specialty: foundRule.specialty,
        doctors: suggestedDoctors,
        suggestion: suggestedDoctors.length > 0 
          ? `Voici quelques praticiens en ${foundRule.specialty} disponibles :`
          : `Malheureusement, aucun ${foundRule.specialty} n'est inscrit pour le moment. Vous pouvez consulter un Généraliste en attendant.`
      })
    }

    if (normalizedMessage.includes("merci") || normalizedMessage.includes("remercie")) {
      return NextResponse.json({
        response: "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Prenez soin de vous !",
        doctors: []
      })
    }

    if (normalizedMessage.includes("bonjour") || normalizedMessage.includes("salut") || normalizedMessage.includes("hello")) {
      return NextResponse.json({
        response: "Bonjour ! Je suis l'assistant HealthNet. Je peux vous orienter vers le bon spécialiste en fonction de vos symptômes. Comment vous sentez-vous ?",
        doctors: []
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
