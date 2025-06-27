'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Headphones,
  CheckCircle,
  Lock,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  audioUrl?: string;
  duration?: string;
  isCompleted?: boolean;
}

interface MinicursoProgress {
  currentChapter: number;
  completedChapters: string[];
  totalTimeSpent: number;
  lastAccess: string;
  audioProgress: { [key: string]: number };
}

const STORAGE_KEY = 'rioporto_minicurso_progress';

export function MinicursoViewer() {
  const { user } = useAuth();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<MinicursoProgress>({
    currentChapter: 0,
    completedChapters: [],
    totalTimeSpent: 0,
    lastAccess: new Date().toISOString(),
    audioProgress: {}
  });
  const [showTranscript, setShowTranscript] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // Capítulos do minicurso
  const chapters: Chapter[] = [
    {
      id: 'capa',
      title: 'Manual P2P: Negocie Bitcoin como um Profissional',
      subtitle: 'O Guia Definitivo para comprar ou vender seu Bitcoin com segurança e privacidade.',
      content: `<div class="text-center space-y-4">
        <h1 class="text-4xl font-bold">Bem-vindo ao Minicurso!</h1>
        <p class="text-xl text-muted-foreground">Aprenda a negociar Bitcoin de forma profissional com nosso guia completo.</p>
        <p class="text-lg">Por: Johnny Ferreira</p>
      </div>`,
      audioUrl: '/minicurso/audios/intro-capa.mp3',
      duration: '0:30'
    },
    {
      id: 'sobre-autor',
      title: 'Sobre o Autor',
      content: `<div class="space-y-4">
        <h2 class="text-2xl font-bold mb-4">Johnny Ferreira</h2>
        <p>Johnny Ferreira é um especialista em Bitcoin e criptomoedas, com uma trajetória de aprendizado e prática que começou em 2016. Autodidata e dedicado, investiu anos em cursos e treinamentos para se aprofundar em segurança de ativos digitais e transações P2P.</p>
        <p>Movido pela paixão pela liberdade financeira, geográfica e de tempo que as criptomoedas proporcionam, Johnny escreveu este minicurso com o objetivo de democratizar o conhecimento.</p>
        <p>Com uma abordagem técnica, porém acessível, Johnny combina sua expertise com o compromisso de capacitar você a tomar decisões conscientes, promovendo segurança e confiança em cada transação no universo cripto.</p>
      </div>`,
      audioUrl: '/minicurso/audios/sobre-autor.mp3',
      duration: '2:30'
    },
    {
      id: 'introducao',
      title: 'Introdução: A Revolução Silenciosa do Dinheiro Ponto a Ponto',
      content: `<div class="space-y-4">
        <p>Em 2008, um documento revolucionário intitulado "Bitcoin: Um Sistema de Dinheiro Eletrônico Peer-to-Peer" foi publicado por uma figura anônima conhecida como Satoshi Nakamoto.</p>
        <p>A visão era clara e poderosa: permitir que pagamentos online fossem enviados diretamente de uma parte para outra, sem a necessidade de passar por uma instituição financeira.</p>
        <p>Com o tempo, para facilitar o acesso, surgiram as corretoras (exchanges). Elas ofereceram conveniência, mas com um custo: a reintrodução de intermediários.</p>
        <p class="font-semibold">Este manual é seu guia. Nosso objetivo é fornecer o conhecimento para você negociar não como um espectador, mas como um profissional — com segurança, confiança e total controle sobre seu patrimônio.</p>
      </div>`,
      audioUrl: '/minicurso/audios/introducao.mp3',
      duration: '3:30'
    },
    {
      id: 'cap1',
      title: 'Capítulo 1: Descomplicando o P2P',
      subtitle: 'O Que é e Como Funciona na Prática?',
      content: `<div class="space-y-4">
        <p><strong>P2P é a abreviação de Peer-to-Peer ("ponto a ponto").</strong> Pense em vender um item usado online. Você negocia diretamente com o comprador, sem uma loja como intermediária.</p>
        <p>No mundo cripto, é a mesma lógica: comprar e vender criptomoedas diretamente entre duas pessoas, fora de uma corretora.</p>
        <h3 class="text-xl font-semibold mt-6 mb-4">O Passo a Passo de uma Negociação P2P</h3>
        <ol class="list-decimal list-inside space-y-2">
          <li><strong>Contato e Cotação:</strong> Você entra em contato com o vendedor e recebe a cotação.</li>
          <li><strong>Acordo de Termos:</strong> Definem a quantidade e o meio de pagamento.</li>
          <li><strong>Pagamento e Confirmação:</strong> O comprador transfere o valor em Reais.</li>
          <li><strong>Liberação das Criptos:</strong> O vendedor envia as criptomoedas para sua carteira.</li>
        </ol>
      </div>`,
      audioUrl: '/minicurso/audios/cap1-descomplicando.mp3',
      duration: '4:30'
    },
    {
      id: 'cap2',
      title: 'Capítulo 2: P2P vs. Corretoras',
      subtitle: 'Qual o Melhor Caminho para Você?',
      content: `<div class="space-y-4">
        <p><strong>A negociação P2P oferece vantagens que as corretoras não conseguem replicar:</strong></p>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Privacidade e Controle:</strong> Menos dados pessoais compartilhados.</li>
          <li><strong>Flexibilidade de Pagamento:</strong> Vasta gama de métodos aceitos.</li>
          <li><strong>Custos Menores:</strong> Taxas mais competitivas e transparentes.</li>
          <li><strong>Soberania e Autocustódia:</strong> Seus fundos nunca ficam sob custódia de terceiros.</li>
        </ul>
        <div class="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mt-6">
          <p class="font-bold">Cansado de taxas surpresa?</p>
          <p>Na RIO PORTO P2P, o preço é fixo e você sabe exatamente quanto vai receber!</p>
        </div>
      </div>`,
      audioUrl: '/minicurso/audios/cap2-p2p-vs-corretoras.mp3',
      duration: '4:00'
    },
    {
      id: 'cap3',
      title: 'Capítulo 3: Sua Fortaleza Digital',
      subtitle: 'O Poder da Autocustódia e das Carteiras',
      content: `<div class="space-y-4">
        <div class="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg text-center">
          <h3 class="text-2xl font-bold">"Not Your Keys, Not Your Coins"</h3>
          <p class="mt-2">"Se as chaves não são suas, as moedas não são suas."</p>
        </div>
        <p>Este é o mantra da soberania. Deixar suas criptos em uma corretora é como deixar ouro no cofre de um banco.</p>
        <p><strong>A negociação P2P, combinada com a autocustódia, resolve isso.</strong> Você recebe as criptomoedas diretamente em uma carteira que só você controla.</p>
        <h3 class="text-xl font-semibold mt-6 mb-4">Hot vs. Cold Wallets</h3>
        <ul class="space-y-3">
          <li><strong>Hot Wallets:</strong> Conectadas à internet, práticas para o dia a dia.</li>
          <li><strong>Cold Wallets:</strong> Offline, máxima segurança para grandes valores.</li>
        </ul>
      </div>`,
      audioUrl: '/minicurso/audios/cap3-autocustodia.mp3',
      duration: '4:30'
    },
    {
      id: 'cap4',
      title: 'Capítulo 4: Navegando em Águas Seguras',
      subtitle: 'O Guia Antifraude Definitivo',
      content: `<div class="space-y-4">
        <p>O medo de ser enganado é uma grande barreira no P2P. Ao entender como os golpes funcionam, você se torna capaz de evitá-los.</p>
        <h3 class="text-xl font-semibold mt-6 mb-4">Principais Golpes:</h3>
        <div class="space-y-3">
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <strong>Golpe do Comprovante Falso:</strong> Nunca confie em imagens, apenas no seu extrato bancário.
          </div>
          <div class="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <strong>Golpe da Triangulação:</strong> Aceite pagamentos apenas do titular da conta.
          </div>
        </div>
        <h3 class="text-xl font-semibold mt-6 mb-4">Checklist de Segurança:</h3>
        <ul class="list-disc list-inside space-y-2">
          <li>✓ Confie APENAS no seu extrato bancário</li>
          <li>✓ Negocie apenas com o titular da conta</li>
          <li>✓ Comece com pouco ao negociar com alguém novo</li>
          <li>✓ Desconfie de ofertas milagrosas</li>
        </ul>
      </div>`,
      audioUrl: '/minicurso/audios/cap4-seguranca.mp3',
      duration: '5:00'
    },
    {
      id: 'cap5',
      title: 'Capítulo 5: A Burocracia sem Medo',
      subtitle: 'Legalidade e Impostos no Brasil',
      content: `<div class="space-y-4">
        <div class="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <p><strong>P2P é Legal no Brasil?</strong> Sim! Não há nenhuma lei que proíba a compra e venda de criptomoedas entre pessoas.</p>
        </div>
        <h3 class="text-xl font-semibold mt-6 mb-4">Obrigações Fiscais:</h3>
        <div class="space-y-3">
          <div>
            <strong>IN 1888 da Receita Federal:</strong>
            <p>Declaração mensal se operações ultrapassarem R$ 30.000/mês.</p>
          </div>
          <div>
            <strong>Imposto de Renda:</strong>
            <p>Isenção para vendas até R$ 35.000/mês. Acima disso, o lucro é tributado.</p>
          </div>
        </div>
        <p class="text-sm text-muted-foreground mt-4">*Consulte sempre um contador especializado.</p>
      </div>`,
      audioUrl: '/minicurso/audios/cap5-legalidade.mp3',
      duration: '3:30'
    },
    {
      id: 'cap6',
      title: 'Capítulo 6: A Vantagem RIO PORTO P2P',
      content: `<div class="space-y-4">
        <h3 class="text-xl font-semibold mb-4">Por que escolher a RIO PORTO P2P?</h3>
        <div class="grid gap-4">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
            <strong>Segurança Garantida:</strong> Processos rigorosos contra fraudes.
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
            <strong>Suporte Humano:</strong> Você fala com pessoas, não robôs.
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
            <strong>Soberania Total:</strong> Ativos direto para sua carteira.
          </div>
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
            <strong>Taxa Fixa:</strong> Sem surpresas, total transparência.
          </div>
        </div>
        <p class="text-center mt-6 text-lg font-semibold">Bitcoin a partir de R$100, com taxa fixa e sem asteriscos!</p>
      </div>`,
      audioUrl: '/minicurso/audios/cap6-rioporto.mp3',
      duration: '3:00'
    },
    {
      id: 'conclusao',
      title: 'Conclusão: Dê o Próximo Passo com Confiança',
      content: `<div class="space-y-4 text-center">
        <p class="text-lg">Parabéns! Você completou o minicurso.</p>
        <p>A complexidade do P2P se transformou em conhecimento claro. Você agora entende como negociar, proteger seus ativos e praticar a autocustódia.</p>
        <p class="text-xl font-bold mt-6">Você está pronto para negociar Bitcoin com segurança!</p>
        <div class="mt-8">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600">
            Começar a Negociar com a RIO PORTO P2P
          </Button>
        </div>
      </div>`,
      audioUrl: '/minicurso/audios/conclusao.mp3',
      duration: '2:00'
    }
  ];

  // Carregar progresso do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedProgress = JSON.parse(saved);
        setProgress(savedProgress);
        setCurrentChapter(savedProgress.currentChapter);
      } catch (error) {
        console.error('Erro ao carregar progresso:', error);
      }
    }
  }, []);

  // Salvar progresso
  useEffect(() => {
    const newProgress = {
      ...progress,
      currentChapter,
      lastAccess: new Date().toISOString()
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, [currentChapter]);

  // Controlar áudio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setAudioCurrentTime(audioRef.current.currentTime);
    
    // Salvar progresso do áudio
    const newProgress = {
      ...progress,
      audioProgress: {
        ...progress.audioProgress,
        [chapters[currentChapter].id]: audioRef.current.currentTime
      }
    };
    setProgress(newProgress);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setAudioDuration(audioRef.current.duration);
    
    // Restaurar posição do áudio
    const savedTime = progress.audioProgress[chapters[currentChapter].id];
    if (savedTime) {
      audioRef.current.currentTime = savedTime;
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    
    // Marcar capítulo como completo
    if (!progress.completedChapters.includes(chapters[currentChapter].id)) {
      const newProgress = {
        ...progress,
        completedChapters: [...progress.completedChapters, chapters[currentChapter].id]
      };
      setProgress(newProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      
      // Mostrar notificação
      toast.success('Capítulo concluído! 🎉');
      
      // Avançar automaticamente se não for o último
      if (currentChapter < chapters.length - 1) {
        setTimeout(() => {
          setCurrentChapter(currentChapter + 1);
        }, 2000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    return (progress.completedChapters.length / chapters.length) * 100;
  };

  const current = chapters[currentChapter];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header com progresso */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Minicurso P2P Bitcoin</h1>
            <p className="text-muted-foreground">
              {progress.completedChapters.length} de {chapters.length} capítulos concluídos
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Award className="mr-2 h-4 w-4" />
            {Math.round(calculateProgress())}%
          </Badge>
        </div>
        <Progress value={calculateProgress()} className="h-3" />
      </Card>

      {/* Conteúdo do capítulo */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Título do capítulo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Capítulo {currentChapter + 1}</Badge>
              {progress.completedChapters.includes(current.id) && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Concluído
                </Badge>
              )}
            </div>
            <h2 className="text-3xl font-bold">{current.title}</h2>
            {current.subtitle && (
              <p className="text-xl text-muted-foreground">{current.subtitle}</p>
            )}
          </div>

          {/* Player de áudio */}
          {current.audioUrl && (
            <Card className="p-4 bg-muted/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="default"
                      onClick={togglePlayPause}
                      className="h-12 w-12"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <div className="space-y-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        Narração em áudio
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(audioCurrentTime)} / {formatTime(audioDuration || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTranscript(!showTranscript)}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      {showTranscript ? 'Ocultar' : 'Mostrar'} Texto
                    </Button>
                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                      className="px-3 py-1 rounded-md border bg-background text-sm"
                    >
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                    </select>
                  </div>
                </div>
                
                {/* Barra de progresso do áudio */}
                <div className="w-full">
                  <input
                    type="range"
                    min={0}
                    max={audioDuration || 100}
                    value={audioCurrentTime}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Number(e.target.value);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
              
              <audio
                ref={audioRef}
                src={current.audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleAudioEnded}
              />
            </Card>
          )}

          {/* Conteúdo do capítulo */}
          {showTranscript && (
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: current.content }}
            />
          )}
        </div>
      </Card>

      {/* Navegação */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
            disabled={currentChapter === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentChapter + 1} de {chapters.length}
          </span>
          
          <Button
            onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
            disabled={currentChapter === chapters.length - 1}
          >
            Próximo
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Certificado ao completar */}
      {progress.completedChapters.length === chapters.length && (
        <Card className="p-8 text-center bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <Award className="h-16 w-16 mx-auto mb-4 text-orange-500" />
          <h3 className="text-2xl font-bold mb-2">Parabéns! 🎉</h3>
          <p className="text-lg mb-4">
            Você concluiu o Minicurso P2P Bitcoin com sucesso!
          </p>
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600">
            Baixar Certificado
          </Button>
        </Card>
      )}
    </div>
  );
}