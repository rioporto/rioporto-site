'use client';

import { MINICURSO_CONFIG } from '@/lib/minicurso-config';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  X,
  Home,
  FileText,
  Award,
  Shield,
  TrendingUp,
  Users,
  Loader2,
  Settings,
  BarChart3,
  Clock,
  CheckCircle2,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { VimeoPlayer } from '@/components/minicurso/vimeo-player';
import { useMinicursoTracking } from '@/hooks/use-minicurso-tracking';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from 'sonner';
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

function MinicursoContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [leadInfo, setLeadInfo] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [courseProgress, setCourseProgress] = useState<any>(null);
  
  // Tracking
  const { 
    trackPageView, 
    trackCourseComplete,
    getProgress 
  } = useMinicursoTracking({ 
    token: token || '',
    onError: (error) => console.error('Tracking error:', error)
  });

  // Conteúdo do minicurso - Todos com vídeo
  const chapters = [
    {
      id: 'capa',
      title: 'Manual P2P',
      fullTitle: 'Manual P2P: Negocie Bitcoin como um Profissional',
      icon: <BookOpen className="w-5 h-5" />,
      content: `
        <div class="text-center space-y-6">
          <h1 class="text-4xl md:text-5xl font-bold text-primary">Manual P2P: Negocie Bitcoin como um Profissional</h1>
          <p class="text-xl text-muted-foreground">O Guia Definitivo para comprar ou vender seu Bitcoin com segurança e privacidade.</p>
          <div class="mt-8">
            <p class="text-lg">Por: Johnny Ferreira</p>
            <p class="text-sm text-muted-foreground mt-2">Especialista em Bitcoin e Criptomoedas</p>
          </div>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'introducao',
      title: 'Introdução',
      fullTitle: 'A Revolução Silenciosa do Dinheiro Ponto a Ponto',
      icon: <Home className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">A Revolução Silenciosa do Dinheiro Ponto a Ponto</h2>
        <div class="space-y-4 text-lg">
          <p>Em 2008, um documento revolucionário intitulado "Bitcoin: Um Sistema de Dinheiro Eletrônico Peer-to-Peer" foi publicado por uma figura anônima conhecida como Satoshi Nakamoto.</p>
          <p>A visão era clara e poderosa: permitir que pagamentos online fossem enviados diretamente de uma parte para outra, sem a necessidade de passar por uma instituição financeira.</p>
          <p>Essa ideia de transação "ponto a ponto" (Peer-to-Peer, ou P2P) é a alma do Bitcoin e o fundamento de uma nova era de soberania financeira.</p>
          <p class="font-semibold text-primary">Este manual é seu guia. Nosso objetivo é fornecer o conhecimento para você negociar não como um espectador, mas como um profissional — com segurança, confiança e total controle sobre seu patrimônio.</p>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'cap1',
      title: 'Capítulo 1',
      fullTitle: 'Descomplicando o P2P',
      icon: <Users className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">Descomplicando o P2P</h2>
        <h3 class="text-xl font-semibold mb-4">O Que é e Como Funciona na Prática?</h3>
        <div class="space-y-4">
          <p><strong>P2P é a abreviação de Peer-to-Peer ("ponto a ponto").</strong> Pense em vender um item usado online. Você negocia diretamente com o comprador, sem uma loja como intermediária.</p>
          <p>No mundo cripto, é a mesma lógica: comprar e vender criptomoedas diretamente entre duas pessoas, fora de uma corretora.</p>
          
          <h4 class="text-lg font-semibold mt-6 mb-3">O Passo a Passo de uma Negociação P2P</h4>
          <ol class="list-decimal list-inside space-y-2 ml-4">
            <li><strong>Contato e Cotação:</strong> Você entra em contato com o vendedor e recebe a cotação.</li>
            <li><strong>Acordo de Termos:</strong> Vocês definem a quantidade e o meio de pagamento.</li>
            <li><strong>Pagamento e Confirmação:</strong> O comprador transfere o valor em Reais.</li>
            <li><strong>Liberação das Criptos:</strong> Com o pagamento confirmado, o vendedor envia as criptomoedas.</li>
          </ol>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'cap2',
      title: 'Capítulo 2',
      fullTitle: 'P2P vs. Corretoras',
      icon: <TrendingUp className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">P2P vs. Corretoras</h2>
        <h3 class="text-xl font-semibold mb-4">Qual o Melhor Caminho para Você?</h3>
        <div class="space-y-4">
          <p>A negociação P2P oferece vantagens que as corretoras não conseguem replicar:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Privacidade e Controle:</strong> Menos dados pessoais compartilhados.</li>
            <li><strong>Flexibilidade de Pagamento:</strong> Vasta gama de métodos aceitos.</li>
            <li><strong>Custos Menores:</strong> Taxas mais competitivas e transparentes.</li>
            <li><strong>Soberania e Autocustódia:</strong> Seus fundos nunca ficam sob custódia de terceiros.</li>
          </ul>
          
          <div class="bg-primary/10 p-6 rounded-lg mt-6">
            <p class="font-semibold">Cansado de taxas surpresa e valores que mudam a todo instante?</p>
            <p class="mt-2">Na RIO PORTO P2P, a regra é clara: o preço é fixo e você sabe exatamente quanto vai receber antes mesmo de fechar o negócio.</p>
          </div>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'cap3',
      title: 'Capítulo 3',
      fullTitle: 'Sua Fortaleza Digital',
      icon: <Shield className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">Sua Fortaleza Digital</h2>
        <h3 class="text-xl font-semibold mb-4">O Poder da Autocustódia e das Carteiras</h3>
        
        <div class="bg-yellow-500/20 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-6">
          <h4 class="text-2xl font-bold text-center">"Not Your Keys, Not Your Coins"</h4>
          <p class="text-center mt-2">"Se as chaves não são suas, as moedas não são suas."</p>
        </div>
        
        <div class="space-y-4">
          <p>Este é o mantra da soberania. Deixar suas criptos em uma corretora é como deixar ouro no cofre de um banco: você confia que eles cuidarão bem.</p>
          <p>Mas se o banco (ou a corretora) falir, for hackeado ou congelar sua conta, você perde acesso aos seus ativos.</p>
          <p class="font-semibold">A negociação P2P, combinada com a autocustódia, resolve isso. Ao negociar conosco, você recebe as criptomoedas diretamente em uma carteira que só você controla.</p>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'cap4',
      title: 'Capítulo 4',
      fullTitle: 'Navegando em Águas Seguras',
      icon: <Shield className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">Navegando em Águas Seguras</h2>
        <h3 class="text-xl font-semibold mb-4">O Guia Antifraude Definitivo</h3>
        
        <p class="mb-6">O medo de ser enganado é uma grande barreira no P2P. Ao entender como os golpes funcionam, você se torna capaz de evitá-los.</p>
        
        <div class="space-y-4">
          <div class="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h4 class="font-bold">Golpe do Comprovante Falso</h4>
            <p>O golpista envia um comprovante de PIX/TED falso e pressiona pela liberação das criptos.</p>
          </div>
          
          <div class="bg-red-500/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <h4 class="font-bold">Golpe da Triangulação</h4>
            <p>O golpista usa uma terceira vítima para depositar dinheiro na sua conta.</p>
          </div>
          
          <div class="bg-green-500/20 border-t-4 border-green-500 p-6 rounded-b-lg mt-6">
            <h4 class="text-xl font-bold mb-4">Checklist de Segurança P2P</h4>
            <ul class="space-y-2">
              <li>✓ <strong>Confie APENAS no seu extrato bancário.</strong></li>
              <li>✓ <strong>Negocie apenas com o titular da conta.</strong></li>
              <li>✓ <strong>Comece com pouco ao negociar com alguém novo.</strong></li>
              <li>✓ <strong>Desconfie de ofertas milagrosas.</strong></li>
            </ul>
          </div>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'cap5',
      title: 'Capítulo 5',
      fullTitle: 'A Burocracia sem Medo',
      icon: <FileText className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">A Burocracia sem Medo</h2>
        <h3 class="text-xl font-semibold mb-4">Legalidade e Impostos no Brasil</h3>
        
        <div class="space-y-6">
          <div class="p-4 bg-muted rounded-lg">
            <p><strong>P2P é Legal no Brasil?</strong> Sim. Não há nenhuma lei que proíba a compra e venda de criptomoedas diretamente entre pessoas.</p>
            <p class="mt-2">O Marco Legal das Criptos (Lei nº 14.478/2022) trouxe mais segurança jurídica ao setor.</p>
          </div>
          
          <div>
            <h4 class="font-bold mb-2">IN 1888 da Receita Federal:</h4>
            <p>É uma declaração informativa mensal. Você deve declarar se o total das suas operações (compras + vendas) em P2P ou corretoras estrangeiras <strong>ultrapassar R$ 30.000 no mês</strong>.</p>
          </div>
          
          <div>
            <h4 class="font-bold mb-2">Imposto de Renda (Ganhos de Capital):</h4>
            <p>Há <strong class="text-green-600">isenção de imposto</strong> sobre o lucro para vendas totais de criptoativos de até <strong>R$ 35.000 por mês</strong>. Acima disso, o lucro é tributado.</p>
          </div>
          
          <p class="text-sm text-muted-foreground italic mt-6">*Aviso Legal: As informações são para fins educativos. Consulte sempre um contador especializado.</p>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'cap6',
      title: 'Capítulo 6',
      fullTitle: 'A Vantagem RIO PORTO P2P',
      icon: <Award className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6 text-center">A Vantagem RIO PORTO P2P</h2>
        
        <div class="grid md:grid-cols-2 gap-4 mb-8">
          <div class="bg-muted p-4 rounded-lg">
            <h4 class="font-bold text-primary mb-2">Segurança Garantida</h4>
            <p>Nossos processos rigorosos atuam como um escudo contra fraudes.</p>
          </div>
          
          <div class="bg-muted p-4 rounded-lg">
            <h4 class="font-bold text-primary mb-2">Simplicidade e Suporte Humano</h4>
            <p>Atendimento ágil e especializado. Você fala com pessoas, não robôs.</p>
          </div>
          
          <div class="bg-muted p-4 rounded-lg">
            <h4 class="font-bold text-primary mb-2">Soberania com Tranquilidade</h4>
            <p>Somos defensores da autocustódia. Os ativos são enviados direto para sua carteira.</p>
          </div>
          
          <div class="bg-muted p-4 rounded-lg">
            <h4 class="font-bold text-primary mb-2">Conformidade e Paz de Espírito</h4>
            <p>Operamos com uma empresa estabelecida no país.</p>
          </div>
        </div>
        
        <div class="text-center bg-primary/10 p-6 rounded-lg">
          <h3 class="text-2xl font-bold mb-2">Bitcoin a partir de R$100, com taxa fixa e sem asteriscos.</h3>
          <p class="text-lg">Na RIO PORTO P2P, a transparência vem em primeiro lugar. O valor que você vê é o valor que você recebe.</p>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    },
    {
      id: 'conclusao',
      title: 'Conclusão',
      fullTitle: 'Dê o Próximo Passo com Confiança',
      icon: <BookOpen className="w-5 h-5" />,
      content: `
        <h2 class="text-3xl font-bold mb-6">Conclusão: Dê o Próximo Passo com Confiança</h2>
        
        <div class="space-y-4 text-lg">
          <p>Você chegou ao final. A complexidade do P2P se transformou em conhecimento claro.</p>
          <p>Você agora entende como negociar, proteger seus ativos, praticar a autocustódia e navegar pelo cenário regulatório.</p>
          <p class="font-bold text-primary">A mensagem central é poderosa: o P2P, feito da maneira correta, é a expressão máxima de controle e soberania sobre seu patrimônio digital.</p>
          <p>Agora que você tem o conhecimento, o próximo passo é a ação. Chega de correr riscos desnecessários. Chega de entregar o controle dos seus ativos para grandes corporações.</p>
          <p class="text-xl font-semibold">Você está pronto para negociar Bitcoin com a segurança, a privacidade e a agilidade que você merece.</p>
          
          <div class="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-lg mt-8 text-center">
            <h3 class="text-2xl font-bold mb-4">A RIO PORTO P2P é sua parceira de confiança.</h3>
            <p class="mb-6">Descubra por que nossos clientes negociam com total confiança.</p>
            <a href="/cotacao" class="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
              Quero fazer minha primeira negociação
            </a>
          </div>
        </div>
      `,
      hasVideo: true,
      videoId: MINICURSO_CONFIG.vimeoVideoId
    }
  ];

  useEffect(() => {
    async function checkAccess() {
      if (!token) {
        setError('Token de acesso não fornecido');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/minicurso?token=${token}`);
        const data = await response.json();

        if (response.ok && data.success) {
          setIsAuthorized(true);
          setLeadInfo(data.lead);
          
          // Buscar progresso
          const progress = await getProgress();
          if (progress) {
            setCourseProgress(progress);
          }
        } else {
          setError(data.error || 'Acesso negado');
        }
      } catch (err) {
        setError('Erro ao verificar acesso');
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [token, getProgress]);

  // Rastrear mudança de página
  useEffect(() => {
    if (isAuthorized && chapters[currentPage]) {
      trackPageView(chapters[currentPage].id);
    }
  }, [currentPage, isAuthorized, trackPageView]);

  const handleDownload = async () => {
    if (!token) return;
    window.open(`/api/minicurso/download?token=${token}`, '_blank');
  };

  const goToNextPage = () => {
    if (currentPage < chapters.length - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    } else {
      // Última página - curso completo
      trackCourseComplete();
      toast.success('Parabéns! Você concluiu o Manual P2P! 🎉');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (error || !isAuthorized) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center">
              <X className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
              <p className="text-muted-foreground mb-6">{error || 'Você não tem permissão para acessar este conteúdo.'}</p>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/">Voltar ao Início</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cursos">Ver Cursos</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const currentChapter = chapters[currentPage];
  const progressPercentage = Math.round(((currentPage + 1) / chapters.length) * 100);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar Melhorado */}
          <aside className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-card border-r overflow-y-auto transition-transform ${showMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 shadow-lg`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Conteúdo do Curso</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowMenu(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress Overview */}
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso Geral</span>
                  <span className="font-semibold">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {/* Chapters List */}
              <nav className="space-y-2">
                {chapters.map((chapter, index) => {
                  const isCompleted = courseProgress?.pagesViewed && index < currentPage;
                  const isCurrent = currentPage === index;
                  
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setCurrentPage(index);
                        setShowMenu(false);
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                        isCurrent 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${isCurrent ? 'text-primary-foreground' : ''}`}>
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            chapter.icon
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${isCurrent ? '' : 'group-hover:text-primary'}`}>
                            {chapter.title}
                          </div>
                          <div className={`text-xs mt-1 ${isCurrent ? 'text-primary-foreground/80' : 'text-muted-foreground'} truncate`}>
                            {chapter.fullTitle}
                          </div>
                        </div>
                        {chapter.hasVideo && (
                          <Play className={`h-4 w-4 flex-shrink-0 ${isCurrent ? 'text-primary-foreground/60' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Download Button */}
              <div className="mt-6 pt-6 border-t">
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF Completo
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Header */}
            <div className="sticky top-16 z-30 bg-background border-b p-4 flex items-center justify-between md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMenu(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="text-sm font-medium">{currentChapter.title}</span>
              <div className="flex items-center gap-2">
                <Progress value={progressPercentage} className="w-16 h-2" />
                <span className="text-xs text-muted-foreground">{progressPercentage}%</span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
              {/* Video Player */}
              {currentChapter.hasVideo && currentChapter.videoId && (
                <VimeoPlayer
                  videoId={currentChapter.videoId}
                  title={`Vídeo: ${currentChapter.fullTitle}`}
                  className="mb-6"
                  onComplete={() => {
                    toast.success('Vídeo concluído! Continue com o conteúdo abaixo.');
                  }}
                />
              )}

              {/* Chapter Content */}
              <Card className="p-6 md:p-10">
                <div 
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentChapter.content }}
                />
              </Card>

              {/* Navigation */}
              <div className="flex justify-between items-center py-6">
                <Button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                
                <span className="text-sm text-muted-foreground">
                  Página {currentPage + 1} de {chapters.length}
                </span>
                
                <Button
                  onClick={goToNextPage}
                  className="gap-2"
                >
                  <span className="hidden sm:inline">
                    {currentPage === chapters.length - 1 ? 'Concluir' : 'Próximo'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>

        {/* Mobile menu overlay */}
        {showMenu && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default function MinicursoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <MinicursoContent />
    </Suspense>
  );
}
