import { Shield, Users, Award, Target } from "lucide-react"

export default function SobrePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Sobre a Rio Porto P2P</h1>
          <p className="text-lg text-muted-foreground">
            Facilitando o acesso ao mundo das criptomoedas com segurança e transparência
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <h2 className="mb-6 text-2xl font-bold">Nossa História</h2>
            <p className="mb-6 text-muted-foreground">
              A RIO PORTO MEDIAÇÃO LTDA nasceu da necessidade de oferecer um serviço 
              confiável e transparente para compra e venda de criptomoedas no Brasil. 
              Com sede no coração do Rio de Janeiro, nossa empresa combina a tradição 
              do mercado financeiro carioca com a inovação da tecnologia blockchain.
            </p>
            
            <p className="mb-8 text-muted-foreground">
              Especializados em transações P2P (peer-to-peer), eliminamos intermediários 
              desnecessários e oferecemos as melhores taxas do mercado, sempre com foco 
              na segurança e satisfação dos nossos clientes.
            </p>

            <h2 className="mb-6 text-2xl font-bold">Nossa Missão</h2>
            <p className="mb-8 text-muted-foreground">
              Democratizar o acesso ao Bitcoin e outras criptomoedas, oferecendo um 
              serviço personalizado, seguro e educativo, capacitando nossos clientes 
              a tomarem as melhores decisões financeiras no mundo digital.
            </p>

            <h2 className="mb-6 text-2xl font-bold">Nossos Valores</h2>
          </div>
          
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <Shield className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Segurança</h3>
                <p className="text-sm text-muted-foreground">
                  Protoclos rigorosos de KYC e verificação para proteger nossos clientes
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Users className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Transparência</h3>
                <p className="text-sm text-muted-foreground">
                  Taxas claras e processos transparentes em todas as transações
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Award className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Excelência</h3>
                <p className="text-sm text-muted-foreground">
                  Compromisso com a qualidade no atendimento e satisfação do cliente
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Target className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Educação</h3>
                <p className="text-sm text-muted-foreground">
                  Capacitação contínua através de cursos e conteúdo educativo
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Info */}
      <section className="bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold">Informações Legais</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-background p-6">
              <h3 className="mb-4 text-lg font-semibold">Dados da Empresa</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium">Razão Social:</dt>
                  <dd className="text-muted-foreground">RIO PORTO MEDIAÇÃO LTDA</dd>
                </div>
                <div>
                  <dt className="font-medium">Nome Fantasia:</dt>
                  <dd className="text-muted-foreground">RIO PORTO P2P</dd>
                </div>
                <div>
                  <dt className="font-medium">CNPJ:</dt>
                  <dd className="text-muted-foreground">11.741.563/0001-57</dd>
                </div>
              </dl>
            </div>
            
            <div className="rounded-lg bg-background p-6">
              <h3 className="mb-4 text-lg font-semibold">Atividades</h3>
              <p className="text-sm text-muted-foreground">
                Atividades auxiliares dos serviços financeiros, portais e 
                provedores de conteúdo, marketing direto, intermediação e 
                agenciamento de serviços, e atividades de ensino.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}