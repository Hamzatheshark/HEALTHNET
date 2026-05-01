"use client"

import { useState } from "react"
import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@healthnet.fr",
    description: "Reponse sous 24h",
  },
  {
    icon: Phone,
    title: "Telephone",
    value: "+33 1 23 45 67 89",
    description: "Lun-Ven 9h-18h",
  },
  {
    icon: MapPin,
    title: "Adresse",
    value: "123 Avenue de la Sante",
    description: "75001 Paris, France",
  },
  {
    icon: Clock,
    title: "Horaires",
    value: "Lun - Ven",
    description: "9h00 - 18h00",
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contactez-nous
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Une question ? Une suggestion ? Notre equipe est a votre ecoute 
                pour vous accompagner dans votre parcours de sante.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">Envoyez-nous un message</h2>
                <p className="mt-2 text-muted-foreground">
                  Remplissez le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais.
                </p>

                {submitted ? (
                  <Card className="mt-8 border-secondary/50 bg-secondary/10">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                        <CheckCircle className="h-8 w-8 text-secondary-foreground" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">Message envoye !</h3>
                      <p className="mt-2 text-muted-foreground">
                        Merci de nous avoir contactes. Nous vous repondrons sous 24 heures.
                      </p>
                      <Button className="mt-6" onClick={() => setSubmitted(false)}>
                        Envoyer un autre message
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Jean Dupont"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="jean@exemple.fr"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="En quoi pouvons-nous vous aider ?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Decrivez votre demande..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">Informations de contact</h2>
                <p className="mt-2 text-muted-foreground">
                  Vous pouvez egalement nous joindre directement.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {contactInfo.map((info) => (
                    <Card key={info.title} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="mt-4 font-semibold text-foreground">{info.title}</h3>
                        <p className="mt-1 text-sm text-foreground">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Link */}
                <Card className="mt-8 border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground">Questions frequentes</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Consultez notre FAQ pour trouver rapidement des reponses a vos questions les plus courantes.
                    </p>
                    <Button variant="outline" className="mt-4">
                      Voir la FAQ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
