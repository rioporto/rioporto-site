import { Button } from "@/components/ui/button"
import { ArrowRight, Bitcoin, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center lg:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Compre e Venda Bitcoin com
            <span className="block text-primary">Segurança e Praticidade</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            A Rio Porto P2P facilita suas transações de Bitcoin e criptomoedas 
            com atendimento personalizado e as melhores taxas do mercado.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/cotacao">
                Fazer Cotação <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/servicos">
                Nossos Serviços
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Por que escolher a Rio Porto P2P?
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Segurança Total</h3>
              <p className="text-muted-foreground">
                Transações seguras com KYC completo e verificação de identidade
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Zap className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Rapidez</h3>
              <p className="text-muted-foreground">
                Suas criptomoedas direto na sua wallet em minutos
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Bitcoin className="h-12 w-12 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Melhores Taxas</h3>
              <p className="text-muted-foreground">
                Comissões transparentes e competitivas no mercado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Pronto para começar?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Entre em contato conosco e faça sua primeira transação hoje mesmo
          </p>
          <Button size="lg" asChild>
            <Link href="/contato">
              Falar com Especialista <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}