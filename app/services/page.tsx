import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Video,
  FileText,
  Pill,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Activity,
  Shield,
} from "lucide-react"

const services = [
  {
    icon: Calendar,
    title: "Prise de rendez-vous",
    description: "Reservez facilement vos consultations en ligne, 24h/24. Choisissez votre medecin, la date et l heure qui vous conviennent.",
    features: ["Disponibilite en temps reel", "Rappels automatiques", "Modification facile"],
  },
  {
    icon: Video,
    title: "Teleconsultation",
    description: "Consultez un medecin depuis chez vous en visioconference. Ideal pour les suivis et les consultations simples.",
    features: ["Video HD securisee", "Ordonnance electronique", "Disponible sur mobile"],
  },
  {
    icon: FileText,
    title: "Dossier medical numerique",
    description: "Accedez a votre historique medical complet : consultations, ordonnances, resultats d analyses.",
    features: ["Acces securise", "Historique complet", "Partage avec vos medecins"],
  },
  {
    icon: Pill,
    title: "Suivi des traitements",
    description: "Gerez vos medicaments et recevez des rappels pour ne jamais oublier une prise.",
    features: ["Rappels personnalises", "Historique des prises", "Alertes interactions"],
  },
  {
    icon: Activity,
    title: "Suivi de sante",
    description: "Suivez vos constantes et indicateurs de sante : tension, poids, glycemie...",
    features: ["Graphiques evolutifs", "Partage medecin", "Alertes automatiques"],
  },
  {
    icon: Shield,
    title: "Assurance et remboursements",
    description: "Simplifiez vos demarches administratives et suivez vos remboursements.",
    features: ["Tiers payant", "Suivi remboursements", "Decomptes en ligne"],
  },
]

const specialties = [
  { icon: Stethoscope, name: "Medecine generale" },
  { icon: Heart, name: "Cardiologie" },
  { icon: Brain, name: "Neurologie" },
  { icon: Bone, name: "Orthopedie" },
  { icon: Eye, name: "Ophtalmologie" },
  { icon: Baby, name: "Pediatrie" },
]

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Nos services
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Decouvrez l ensemble des services que HealthNet met a votre disposition 
                pour simplifier la gestion de votre sante.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.title} className="border-border/50 transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4 text-foreground">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <ul className="mt-4 space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Specialites medicales
              </h2>
              <p className="mt-4 text-muted-foreground">
                Accedez a un large reseau de specialistes dans tous les domaines.
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {specialties.map((specialty) => (
                <div
                  key={specialty.name}
                  className="flex flex-col items-center rounded-xl border border-border/50 bg-card p-6 text-center transition-colors hover:border-primary/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <specialty.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">{specialty.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
