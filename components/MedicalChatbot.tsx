"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, X, Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MedicalChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<{ role: "bot" | "user", content: string, doctors?: any[] }[]>([
    { role: "bot", content: "Bonjour ! Je suis votre assistant HealthNet. Décrivez-moi vos symptômes pour que je puisse vous orienter." }
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return

    const userMsg = message
    setMessage("")
    setChat(prev => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await response.json()
      
      setChat(prev => [...prev, { 
        role: "bot", 
        content: data.response + (data.suggestion ? `\n\n${data.suggestion}` : ""),
        doctors: data.doctors 
      }])
    } catch (error) {
      setChat(prev => [...prev, { role: "bot", content: "Désolé, j'ai rencontré un problème. Veuillez réessayer." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-80 shadow-2xl sm:w-96">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b p-4 bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Assistant HealthNet
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {chat.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex gap-2 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === "user" ? "bg-primary" : "bg-muted"
                  )}>
                    {msg.role === "user" ? <User className="h-3 w-3 text-primary-foreground" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={cn(
                    "rounded-2xl p-3 text-sm",
                    msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"
                  )}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.doctors && msg.doctors.length > 0 && (
                      <div className="mt-3 space-y-2 border-t pt-2">
                        {msg.doctors.map((doc: any) => (
                          <div key={doc.id} className="flex flex-col gap-1 rounded bg-background p-2 text-foreground shadow-sm">
                            <span className="font-bold text-xs">Dr. {doc.firstName} {doc.lastName}</span>
                            <span className="text-[10px] opacity-70">{doc.specialty}</span>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="h-auto p-0 text-[10px] text-primary"
                              onClick={() => window.location.href = `/dashboard/patient/rendez-vous?doctorId=${doc.id}`}
                            >
                              Prendre RDV
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 mr-auto">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none p-3 text-sm animate-pulse">
                    En train de réfléchir...
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSend} className="p-4 border-t flex gap-2">
              <Input 
                placeholder="Décrivez vos symptômes..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
