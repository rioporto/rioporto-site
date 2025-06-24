import { Button } from "@/components/ui/button"
import { Bitcoin, Shield, Users, Cpu } from "lucide-react"
import Link from "next/link"

export default function ServicosPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Nossos Serviços</h1>
          <p className="text-lg text-muted-foreground">
            Soluções completas para suas necessidades em criptomoedas
          </p>
        </div>
      </section>

      {/* P2P Service */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Bitcoin className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Serviço P2P</h2>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-muted-foreground">
                Compra e Venda Direta de Criptomoedas
              </h3>
              <p className="mb-6 text-muted-foreground">
                Nossa plataforma P2P oferece a maneira mais rápida e segura de comprar 
                e vender Bitcoin, stablecoins e outras criptomoedas. Com atendimento 
                personalizado, garantimos que suas transações sejam realizadas com 
                total transparência e segurança.
              </p>
              <ul className="mb-8 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Compra: R$ → Bitcoin direto na sua wallet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Venda: Bitcoin → R$ direto na sua conta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Suporte para Bitcoin, USDT, USDC e mais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Pagamento via PIX ou transferência bancária</span>
                </li>
              </ul>
              <Button size="lg" asChild>
                <Link href="/cotacao">Fazer Cotação</Link>
              </Button>
            </div>
            <div className="rounded-lg bg-muted/50 p-8">
              <h4 className="mb-4 text-lg font-semibold">Tabela de Comissões</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Até R$ 4.999</span>
                  <span className="font-semibold">3,5%</span>
                </div>
                <div className="flex justify-between">
                  <span>R$ 5.000 até R$ 50.000</span>
                  <span className="font-semibold">2,5%</span>
                </div>
                <div className="flex justify-between">
                  <span>R$ 50.001 até R$ 100.000</span>
                  <span className="font-semibold">1,5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Acima de R$ 100.000</span>
                  <span className="font-semibold">Negociável</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultoria Service */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Consultoria Especializada</h2>
            <p className="text-lg text-muted-foreground">
              Apoio completo para sua jornada no mundo das criptomoedas
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <Shield className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Segurança Digital</h3>
              <p className="text-sm text-muted-foreground">
                Proteja seus ativos digitais com as melhores práticas de segurança
              </p>
            </div>
            
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <Bitcoin className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Padrão Bitcoin</h3>
              <p className="text-sm text-muted-foreground">
                Adote o Bitcoin como reserva de valor e meio de pagamento
              </p>
            </div>
            
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <Users className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Recebíveis em BTC</h3>
              <p className="text-sm text-muted-foreground">
                Configure sua empresa para receber pagamentos em Bitcoin
              </p>
            </div>
            
            <div className="rounded-lg bg-background p-6 shadow-sm">
              <Cpu className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Mineração BTC</h3>
              <p className="text-sm text-muted-foreground">
                Aprenda sobre mineração doméstica e com energia limpa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Pronto para começar sua jornada cripto?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Entre em contato com nossos especialistas e descubra a melhor solução para você
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/contato">Falar com Especialista</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cursos">Ver Cursos</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}