import Link from "next/link"
import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Calendar,
  FileText,
  Shield,
  Clock,
  Users,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Prise de rendez-vous en ligne",
    description: "Reservez vos consultations en quelques clics, 24h/24 et 7j/7.",
  },
  {
    icon: FileText,
    title: "Dossier medical numerique",
    description: "Accedez a votre historique medical complet de maniere securisee.",
  },
  {
    icon: Shield,
    title: "Donnees securisees",
    description: "Vos informations sont protegees selon les normes les plus strictes.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Fini les files d attente, gerez tout depuis votre espace personnel.",
  },
]

const stats = [
  { value: "50+", label: "Medecins partenaires" },
  { value: "10k+", label: "Patients satisfaits" },
  { value: "25k+", label: "Rendez-vous geres" },
  { value: "98%", label: "Taux de satisfaction" },
]

const services = [
  {
    icon: Stethoscope,
    title: "Consultation generale",
    description: "Consultez un medecin generaliste pour tous vos besoins de sante.",
  },
  {
    icon: Users,
    title: "Specialistes",
    description: "Acces a un reseau de specialistes qualifies dans tous les domaines.",
  },
  {
    icon: Calendar,
    title: "Teleconsultation",
    description: "Consultez votre medecin a distance, depuis chez vous.",
  },
]

const testimonials = [
  {
    name: "Marie Dupont",
    role: "Patiente",
    content: "HealthNet a revolutionne ma facon de gerer ma sante. Plus besoin d attendre des heures au telephone pour un rendez-vous !",
    rating: 5,
  },
  {
    name: "Dr. Jean Martin",
    role: "Medecin generaliste",
    content: "La plateforme me permet de mieux organiser mes consultations et de suivre mes patients de maniere efficace.",
    rating: 5,
  },
  {
    name: "Pierre Leroy",
    role: "Patient",
    content: "L acces a mon dossier medical en ligne est un vrai plus. Je peux partager mes informations avec n importe quel medecin.",
    rating: 5,
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 sm:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-3xl" />
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Votre sante, notre priorite
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                HealthNet simplifie la gestion de vos services medicaux. 
                Prenez rendez-vous, consultez votre dossier et suivez vos soins 
                depuis une seule plateforme.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link href="/register">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/services">Decouvrir nos services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Pourquoi choisir HealthNet ?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Une solution complete pour gerer tous vos besoins de sante au quotidien.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/50 bg-card transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                  Nos services medicaux
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  Un large eventail de services pour repondre a tous vos besoins de sante.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/services">
                  Voir tous les services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <Card key={service.title} className="group border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                      <service.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{service.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                    <Link 
                      href="/services" 
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                      En savoir plus
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Comment ca marche ?
              </h2>
              <p className="mt-4 text-muted-foreground">
                En 3 etapes simples, accedez a tous vos services de sante.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                { step: "1", title: "Creez votre compte", description: "Inscrivez-vous gratuitement en quelques minutes." },
                { step: "2", title: "Trouvez votre medecin", description: "Recherchez parmi nos medecins partenaires." },
                { step: "3", title: "Prenez rendez-vous", description: "Reservez votre creneau en ligne instantanement." },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center">
                  {index < 2 && (
                    <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border md:block" />
                  )}
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                Ce que disent nos utilisateurs
              </h2>
              <p className="mt-4 text-muted-foreground">
                Decouvrez les temoignages de ceux qui nous font confiance.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="border-border/50 bg-card">
                  <CardContent className="p-6">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">&ldquo;{testimonial.content}&rdquo;</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-primary px-6 py-16 text-center sm:px-16">
              <h2 className="text-balance text-3xl font-bold text-primary-foreground sm:text-4xl">
                Pret a prendre soin de votre sante ?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Rejoignez des milliers d utilisateurs qui gerent leur sante simplement avec HealthNet.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Creer un compte gratuit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/contact">Nous contacter</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Inscription gratuite
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Sans engagement
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Support 24/7
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
