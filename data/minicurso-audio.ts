export interface ChapterAudio {
  id: string;
  audioUrl: string;
  duration: number; // em segundos
  transcript?: string;
}

// Mapeamento dos áudios de cada capítulo
// NOTA: Os arquivos de áudio precisam ser gerados e colocados em /public/audio/minicurso/
export const chapterAudios: Record<string, ChapterAudio> = {
  'capa': {
    id: 'capa',
    audioUrl: '/audio/minicurso/01-capa.mp3',
    duration: 45,
    transcript: `Bem-vindo ao Manual P2P: Negocie Bitcoin como um Profissional. 
    Este é o guia definitivo para você aprender a comprar ou vender Bitcoin 
    com total segurança e privacidade. Sou Johnny Ferreira, especialista em 
    Bitcoin e criptomoedas, e vou guiar você nesta jornada rumo à soberania financeira.`
  },
  'introducao': {
    id: 'introducao',
    audioUrl: '/audio/minicurso/02-introducao.mp3',
    duration: 120,
    transcript: `Em 2008, um documento revolucionário intitulado "Bitcoin: Um Sistema de Dinheiro 
    Eletrônico Peer-to-Peer" foi publicado por uma figura anônima conhecida como Satoshi Nakamoto. 
    A visão era clara e poderosa: permitir que pagamentos online fossem enviados diretamente de 
    uma parte para outra, sem a necessidade de passar por uma instituição financeira.`
  },
  'cap1': {
    id: 'cap1',
    audioUrl: '/audio/minicurso/03-cap1.mp3',
    duration: 180,
    transcript: `Capítulo 1: Descomplicando o P2P. P2P é a abreviação de Peer-to-Peer, 
    que significa "ponto a ponto". Pense em vender um item usado online. Você negocia 
    diretamente com o comprador, sem uma loja como intermediária. No mundo cripto, 
    é a mesma lógica: comprar e vender criptomoedas diretamente entre duas pessoas.`
  },
  'cap2': {
    id: 'cap2',
    audioUrl: '/audio/minicurso/04-cap2.mp3',
    duration: 150,
    transcript: `Capítulo 2: P2P versus Corretoras. A negociação P2P oferece vantagens 
    que as corretoras não conseguem replicar: privacidade e controle, flexibilidade 
    de pagamento, custos menores e, principalmente, soberania e autocustódia.`
  },
  'cap3': {
    id: 'cap3',
    audioUrl: '/audio/minicurso/05-cap3.mp3',
    duration: 160,
    transcript: `Capítulo 3: Sua Fortaleza Digital. "Not Your Keys, Not Your Coins" - 
    Se as chaves não são suas, as moedas não são suas. Este é o mantra da soberania. 
    A negociação P2P, combinada com a autocustódia, garante que você tenha controle 
    total sobre seus ativos digitais.`
  },
  'cap4': {
    id: 'cap4',
    audioUrl: '/audio/minicurso/06-cap4.mp3',
    duration: 200,
    transcript: `Capítulo 4: Navegando em Águas Seguras. O medo de ser enganado é uma 
    grande barreira no P2P. Mas ao entender como os golpes funcionam, você se torna 
    capaz de evitá-los. Vamos explorar os principais tipos de fraude e como se proteger.`
  },
  'cap5': {
    id: 'cap5',
    audioUrl: '/audio/minicurso/07-cap5.mp3',
    duration: 140,
    transcript: `Capítulo 5: A Burocracia sem Medo. P2P é legal no Brasil? Sim! 
    Não há nenhuma lei que proíba a compra e venda de criptomoedas diretamente 
    entre pessoas. O Marco Legal das Criptos trouxe mais segurança jurídica ao setor.`
  },
  'cap6': {
    id: 'cap6',
    audioUrl: '/audio/minicurso/08-cap6.mp3',
    duration: 130,
    transcript: `Capítulo 6: A Vantagem Rio Porto P2P. Nossa vantagem está em 
    oferecer segurança garantida, simplicidade com suporte humano, soberania 
    com tranquilidade e total conformidade legal. Bitcoin a partir de R$100, 
    com taxa fixa e sem asteriscos.`
  },
  'conclusao': {
    id: 'conclusao',
    audioUrl: '/audio/minicurso/09-conclusao.mp3',
    duration: 90,
    transcript: `Conclusão: Você chegou ao final desta jornada. A complexidade do P2P 
    se transformou em conhecimento claro. Agora você está pronto para negociar Bitcoin 
    com a segurança, a privacidade e a agilidade que você merece. A Rio Porto P2P 
    é sua parceira de confiança nesta nova fase.`
  }
};

// Função auxiliar para obter informações de áudio por ID do capítulo
export function getChapterAudio(chapterId: string): ChapterAudio | undefined {
  return chapterAudios[chapterId];
}

// Função para calcular tempo total do curso
export function getTotalCourseDuration(): number {
  return Object.values(chapterAudios).reduce((total, audio) => total + audio.duration, 0);
}

// Função para formatar duração em minutos
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}