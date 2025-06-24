"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, MapPin, Mail, MessageCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Implementar envio para WhatsApp/Zendesk
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.")
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground">
            Estamos aqui para ajudar você em sua jornada cripto
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-6 text-2xl font-bold">Envie sua mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    placeholder="+55 21 99999-9999"
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" name="subject" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    required 
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold">Informações de Contato</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Telefone / WhatsApp</p>
                      <p className="text-muted-foreground">+55 21 3400-3259</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">E-mail</p>
                      <p className="text-muted-foreground">contato@rioporto.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Endereço</p>
                      <p className="text-muted-foreground">
                        Av. Marechal Câmara, 160, Sala 1107<br />
                        Centro - Rio de Janeiro/RJ<br />
                        CEP: 20020-907
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <MessageCircle className="h-5 w-5" />
                  Atendimento Rápido
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Para um atendimento ainda mais rápido, envie uma mensagem 
                  diretamente para nosso WhatsApp!
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a 
                    href="https://wa.me/5521340003259" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Abrir WhatsApp
                  </a>
                </Button>
              </div>

              <div className="rounded-lg bg-primary/10 p-6">
                <h3 className="mb-2 text-lg font-semibold">Horário de Atendimento</h3>
                <p className="text-sm">
                  Segunda a Sexta: 9h às 18h<br />
                  Sábado: 9h às 13h<br />
                  Domingo e Feriados: Fechado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}