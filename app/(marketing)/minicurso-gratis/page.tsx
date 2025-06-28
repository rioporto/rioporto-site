"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  Play,
  Shield,
  TrendingUp,
  Users,
  FileText,
  Star,
  ArrowRight,
  Loader2
} from "lucide-react"
import toast from "react-hot-toast"

export default function MinicursoGratisPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.whatsapp) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)

    try {
      // Chamar API de lead capture
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.whatsapp,
          whatsapp: formData.whatsapp,
          source: 'minicurso-gratis'
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Acesso liberado! Verifique seu e-mail com o link de acesso.', {
          duration: 6000
        })
        
        // Mensagem adicional com dica
        setTimeout(() => {
          toast('💡 Dica: Verifique também sua caixa de spam ou promoções', {
            duration: 8000
          })
        }, 2000)
        
        // Limpar formulário
        setFormData({
          name: "",
          email: "",
          whatsapp: ""
        })
      } else {
        throw new Error(data.error || 'Erro ao processar cadastro')
      }
    } catch (error: any) {
      console.error('Erro:', error)
      toast.error(error.message || 'Erro ao processar cadastro')
    } finally {
      setLoading(false)
    }
  }

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Investidor",
      text: "O manual me deu confiança para fazer minha primeira compra P2P. Muito didático!",
      rating: 5
    },
    {
      name: "Ana Oliveira", 
      role: "Empreendedora",
      text: "Finalmente entendi como funciona o P2P. O conteúdo é excelente e muito bem explicado.",
      rating: 5
    },
    {
      name: "Roberto Santos",
      role: "Trader",
      text: "Informações valiosas sobre segurança e aspectos legais. Recomendo!",
      rating: 5
    }
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">GRÁTIS POR TEMPO LIMITADO</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Manual P2P: Negocie Bitcoin como um Profissional
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                O guia definitivo para comprar ou vender Bitcoin com segurança e privacidade, 
                sem depender de corretoras centralizadas.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>45-60 minutos de conteúdo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-primary" />
                  <span>Vídeos explicativos em cada capítulo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Certificado de conclusão</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>PDF para download</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  4.9/5 (127 avaliações)
                </span>
              </div>
            </div>

            {/* Form Card */}
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  Acesse Gratuitamente Agora
                </CardTitle>
                <CardDescription>
                  Preencha seus dados e receba o link de acesso por e-mail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="João Silva"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      O link de acesso será enviado para este e-mail
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      placeholder="(21) 99999-9999"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Para futuras comunicações e suporte
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Liberar Meu Acesso Agora
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Ao se cadastrar, você concorda em receber comunicações da Rio Porto P2P. 
                    Seus dados estão seguros conosco.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            O Que Você Vai Aprender
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                title: "Descomplicando o P2P",
                description: "Entenda o que é P2P e como funciona na prática"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "P2P vs. Corretoras",
                description: "Descubra as vantagens de negociar diretamente"
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Segurança Total",
                description: "Aprenda a se proteger de golpes e fraudes"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Autocustódia",
                description: "Tenha controle total sobre seus bitcoins"
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Aspectos Legais",
                description: "Impostos e regulamentações explicados"
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: "Guia Prático",
                description: "Passo a passo para sua primeira negociação"
              }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-4 text-primary flex justify-center">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por Que Este Minicurso é Essencial?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Para Iniciantes</h3>
              <ul className="space-y-3">
                {[
                  "Linguagem simples e didática",
                  "Conceitos explicados do zero",
                  "Exemplos práticos do dia a dia",
                  "Suporte via WhatsApp"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Para Experientes</h3>
              <ul className="space-y-3">
                {[
                  "Estratégias avançadas de segurança",
                  "Otimização tributária legal",
                  "Melhores práticas do mercado",
                  "Atualizações regulatórias"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            O Que Dizem Nossos Alunos
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&quot;{testimonial.text}&quot;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-t from-primary/10 to-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não Perca Esta Oportunidade
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            O conhecimento que você vai adquirir pode economizar milhares de reais em taxas 
            e proteger você de golpes. Comece agora mesmo!
          </p>
          
          <div className="bg-card p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="text-3xl font-bold text-primary mb-2">
              100% GRÁTIS
            </div>
            <p className="text-muted-foreground mb-6">
              Sem pegadinhas, sem cartão de crédito
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Quero Meu Acesso Gratuito
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
