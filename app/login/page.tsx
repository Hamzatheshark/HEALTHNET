"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const roles = [
  { value: "patient", label: "Patient", description: "Acceder a vos rendez-vous et dossier medical" },
  { value: "medecin", label: "Medecin", description: "Gerer vos consultations et patients" },
  { value: "secretaire", label: "Secretaire", description: "Gerer les rendez-vous et planning" },
  { value: "admin", label: "Administrateur", description: "Administrer la plateforme" },
]

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo: redirect based on selected role
    const roleRoutes = {
      patient: "/dashboard/patient/rendez-vous",
      medecin: "/dashboard/medecin/dashboard",
      secretaire: "/dashboard/secretaire/agenda-global",
      admin: "/dashboard/admin/utilisateurs",
    }
    router.push(roleRoutes[selectedRole as keyof typeof roleRoutes])
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4 py-12">
      {/* Back to home */}
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>

      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">HealthNet</span>
      </Link>

      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous a votre espace HealthNet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection (for demo) */}
            <div className="space-y-3">
              <Label>Selectionner un role (demo)</Label>
              <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <Label
                      key={role.value}
                      htmlFor={role.value}
                      className={`flex cursor-pointer flex-col rounded-lg border p-3 transition-colors ${
                        selectedRole === role.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={role.value} id={role.value} />
                        <span className="font-medium text-foreground">{role.label}</span>
                      </div>
                      <span className="mt-1 text-xs text-muted-foreground">{role.description}</span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@healthnet.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Mot de passe oublie ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Se connecter
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        En vous connectant, vous acceptez nos{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          politique de confidentialite
        </Link>
        .
      </p>
    </div>
  )
}
