// app/curso-p2p/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Bitcoin, 
  BookOpen, 
  Shield, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle2,
  Gift,
  Zap,
  Lock,
  ArrowRight,
  Star,
  Award,
  Target,
  DollarSign
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DebugPanel } from '@/components/debug-panel'
import { SystemCheck } from '@/components/system-check'

export default function CursoP2PLandingPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('Iniciando submit do formulário...')
    console.log('Dados:', formData)

    try {
      // Enviar para API de captura de leads
      const response = await fetch('/api/lead-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          lead_source: 'curso-p2p-landing'
        })
      })

      console.log('Resposta da API:', response.status)
      const data = await response.json()
      console.log('Dados da resposta:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar cadastro')
      }

      // Sucesso! Redirecionar para o minicurso com o token
      toast.success('Cadastro realizado com sucesso!')
      
      // Salvar token no localStorage para acesso posterior
      if (data.accessToken) {
        localStorage.setItem('minicurso_token', data.accessToken)
        console.log('Token salvo no localStorage')
      }

      // Redirecionar para o minicurso
      console.log('Redirecionando para o minicurso...')
      router.push(`/minicurso?token=${data.accessToken}`)

    } catch (error) {
      console.error('Erro no submit:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao processar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Aprenda a negociar com proteção máxima contra golpes e fraudes"
    },
    {
      icon: TrendingUp,
      title: "Melhores Taxas",
      description: "Descubra como conseguir as melhores cotações do mercado P2P"
    },
    {
      icon: Clock,
      title: "Economia de Tempo",
      description: "Técnicas para fechar negócios em minutos, não horas"
    },
    {
      icon: Users,
      title: "Rede de Contatos",
      description: "Construa uma rede confiável de parceiros de negociação"
    }
  ]

  const curriculum = [
    "O que é negociação P2P e por que é revolucionária",
    "Como identificar e evitar os 7 golpes mais comuns",
    "Estratégias profissionais de precificação",
    "Técnicas de negociação que aumentam seus lucros",
    "Como construir reputação sólida no mercado",
    "Ferramentas essenciais para operar com segurança",
    "Análise de mercado e timing perfeito",
    "Casos reais de sucesso e fracasso"
  ]

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Investidor há 3 anos",
      content: "Antes do curso, tinha medo de P2P. Agora faço 20+ operações por mês com total segurança!",
      rating: 5
    },
    {
      name: "Ana Rodrigues",
      role: "Trader Profissional",
      content: "O manual me economizou milhares em taxas. ROI incrível em apenas 1 mês!",
      rating: 5
    },
    {
      name: "Roberto Mendes",
      role: "Empresário",
      content: "Conteúdo direto ao ponto, sem enrolação. Exatamente o que eu precisava!",
      rating: 5
    }
  ]

  const faqs = [
    {
      question: "Por quanto tempo terei acesso ao curso?",
      answer: "Você terá acesso completo por 30 dias, tempo mais que suficiente para dominar todo o conteúdo e aplicar na prática."
    },
    {
      question: "Preciso ter experiência com Bitcoin?",
      answer: "Não! O curso foi criado para iniciantes e avançados. Começamos do zero e vamos até estratégias profissionais."
    },
    {
      question: "O curso tem certificado?",
      answer: "Sim! Ao completar 100% do conteúdo, você recebe um certificado de conclusão para adicionar ao seu portfólio."
    },
    {
      question: "Posso acessar pelo celular?",
      answer: "Absolutamente! Nossa plataforma é 100% responsiva e funciona perfeitamente em qualquer dispositivo."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 blur-3xl" />
        
        <div className="relative container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
              <Gift className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">
                CURSO GRATUITO POR TEMPO LIMITADO
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Domine a Arte da Negociação P2P de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
                Bitcoin Como um Profissional
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Descubra os segredos que os traders profissionais usam para 
              <span className="text-orange-400 font-semibold"> economizar milhares em taxas </span>
              e negociar com segurança total
            </p>

            {/* CTA Button */}
            <div className="pt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-8 py-6 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
              >
                QUERO ACESSO GRATUITO AGORA
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-sm text-gray-400 mt-4">
                🔥 437 pessoas acessaram nas últimas 24 horas
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { value: "16", label: "Aulas Práticas" },
              { value: "2h+", label: "De Conteúdo" },
              { value: "1.2k+", label: "Alunos" },
              { value: "4.9", label: "Avaliação" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="px-4 py-20 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Por Que Este Curso é <span className="text-orange-400">Diferente?</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-700 hover:border-orange-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-orange-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* O que você vai aprender */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            O Que Você Vai <span className="text-orange-400">Aprender</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {curriculum.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300 text-lg">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-orange-500/30 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <Award className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Certificado de Conclusão
                </h3>
                <p className="text-gray-300">
                  Ao completar 100% do curso, você recebe um certificado para comprovar seus conhecimentos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="px-4 py-20 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            O Que Dizem Nossos <span className="text-orange-400">Alunos</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formulário de Cadastro */}
      <section id="cadastro" className="px-4 py-20">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <Zap className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">
                  Garanta Seu Acesso Gratuito
                </h2>
                <p className="text-gray-300">
                  Preencha seus dados abaixo e receba acesso instantâneo ao curso completo
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-300">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-gray-300">WhatsApp (opcional)</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg py-6 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    "Processando..."
                  ) : (
                    <>
                      LIBERAR MEU ACESSO AGORA
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Seus dados estão seguros e não serão compartilhados</span>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Garantias */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Acesso imediato após o cadastro</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>100% online e gratuito</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Certificado de conclusão incluso</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 bg-gray-800/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Perguntas <span className="text-orange-400">Frequentes</span>
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Não Perca Esta <span className="text-orange-400">Oportunidade</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            O acesso gratuito é limitado e pode acabar a qualquer momento
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-8 py-6 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-200"
            onClick={() => document.getElementById('cadastro')?.scrollIntoView({ behavior: 'smooth' })}
          >
            GARANTIR MEU ACESSO GRATUITO
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl text-center text-gray-400">
          <p className="mb-2">© 2025 Rio Porto P2P. Todos os direitos reservados.</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Link href="/termos" className="hover:text-orange-400 transition-colors">
              Termos de Uso
            </Link>
            <span>•</span>
            <Link href="/privacidade" className="hover:text-orange-400 transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </footer>

      {/* Debug Panel */}
      <DebugPanel />
      
      {/* System Check */}
      <SystemCheck />
    </div>
  )
}
