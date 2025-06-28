// Configurações do Minicurso P2P

export const MINICURSO_CONFIG = {
  // ID do vídeo no Vimeo - SUBSTITUA PELO ID REAL DO SEU VÍDEO
  vimeoVideoId: '1097214225', // Vídeo: Compre Bitcoin na Rio Porto P2P
  
  // Título do vídeo
  videoTitle: 'Compre Bitcoin na Rio Porto P2P',
  
  // Duração do vídeo em segundos (para analytics)
  videoDuration: 180, // 3 minutos
  
  // URLs dos áudios (se você tiver hospedado em algum lugar)
  audioUrls: {
    'capa': '/audio/01-capa.mp3',
    'introducao': '/audio/02-introducao.mp3',
    'cap1': '/audio/03-cap1.mp3',
    'cap2': '/audio/04-cap2.mp3',
    'cap3': '/audio/05-cap3.mp3',
    'cap4': '/audio/06-cap4.mp3',
    'cap5': '/audio/07-cap5.mp3',
    'cap6': '/audio/08-cap6.mp3',
    'conclusao': '/audio/09-conclusao.mp3'
  },
  
  // Configurações de acesso
  accessDuration: 30, // dias
  
  // Configurações de email (quando configurar o serviço)
  email: {
    from: 'cursos@rioporto.com',
    fromName: 'Rio Porto P2P - Cursos',
    replyTo: 'suporte@rioporto.com'
  }
}

// INSTRUÇÕES PARA CONFIGURAR O VÍDEO VIMEO:
// 1. Faça upload do vídeo no Vimeo
// 2. Nas configurações do vídeo, vá em "Embed" 
// 3. Copie o ID do vídeo (números no final da URL)
// 4. Substitua o valor de vimeoVideoId acima
// 5. Configure a privacidade do vídeo para "Unlisted" ou configure domínios permitidos
