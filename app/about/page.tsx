import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, Users, Award, Clock } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Bien-etre du patient",
    description: "Votre sante est notre priorite absolue. Chaque decision est prise en pensant a votre bien-etre.",
  },
  {
    icon: Users,
    title: "Accessibilite",
    description: "Nous croyons que les soins de qualite doivent etre accessibles a tous, partout.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Nous nous engageons a fournir des services de la plus haute qualite.",
  },
  {
    icon: Clock,
    title: "Reactivite",
    description: "Votre temps est precieux. Nous optimisons chaque interaction pour plus d efficacite.",
  },
]

const team = [
  {
    name: "Dr. Sophie Bernard",
    role: "Directrice Medicale",
    description: "20 ans d experience en medecine generale et en e-sante.",
  },
  {
    name: "Thomas Mercier",
    role: "Directeur Technique",
    description: "Expert en securite des donnees de sante et systemes d information.",
  },
  {
    name: "Claire Dubois",
    role: "Responsable Experience Patient",
    description: "Passionnee par l amelioration du parcours patient.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                A propos de HealthNet
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Notre mission est de revolutionner l acces aux soins de sante 
                en rendant la medecine plus accessible, plus simple et plus humaine.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-2">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <Target className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-foreground">Notre Mission</h2>
                  <p className="mt-4 text-muted-foreground">
                    Simplifier le parcours de soins des patients et optimiser le quotidien 
                    des professionnels de sante grace a une plateforme intuitive et securisee. 
                    Nous croyons que la technologie doit etre au service de l humain, 
                    pas l inverse.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-secondary/20 bg-secondary/5">
                <CardContent className="p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Eye className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold text-foreground">Notre Vision</h2>
                  <p className="mt-4 text-muted-foreground">
                    Devenir la reference en matiere de gestion des services medicaux numeriques 
                    en France et en Europe. Nous aspirons a un monde ou chacun peut acceder 
                    facilement a des soins de qualite, quelle que soit sa situation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Nos valeurs</h2>
              <p className="mt-4 text-muted-foreground">
                Les principes qui guident chacune de nos actions.
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Notre equipe</h2>
              <p className="mt-4 text-muted-foreground">
                Des experts passionnes au service de votre sante.
              </p>
            </div>
            
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {team.map((member) => (
                <Card key={member.name} className="border-border/50 text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { value: "2018", label: "Annee de creation" },
                { value: "50+", label: "Medecins partenaires" },
                { value: "10k+", label: "Patients actifs" },
                { value: "15", label: "Collaborateurs" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{stat.label}</p>
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
