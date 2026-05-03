import { NextRequest, NextResponse } from "next/server"

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
    const lowerMessage = message.toLowerCase()

    let foundRule = orientationRules.find(rule => 
      rule.keywords.some(keyword => lowerMessage.includes(keyword))
    )

    if (foundRule) {
      return NextResponse.json({
        response: `D'après vos symptômes, je vous oriente vers un **${foundRule.specialty}**. ${foundRule.advice}`,
        specialty: foundRule.specialty,
        suggestion: `Souhaitez-vous voir la liste de nos ${foundRule.specialty}s ?`
      })
    }

    return NextResponse.json({
      response: "Je ne parviens pas à identifier une spécialité précise. Il est préférable de consulter un **Médecin Généraliste** pour un premier diagnostic.",
      specialty: "Généraliste",
      suggestion: "Souhaitez-vous prendre rendez-vous avec un généraliste ?"
    })

  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
