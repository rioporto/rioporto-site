'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  
  // Número do WhatsApp correto
  const whatsappNumber = '552120187776' // +55 21 2018-7776
  const message = encodeURIComponent('Olá! Gostaria de saber mais sobre compra e venda de Bitcoin.')
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
  
  useEffect(() => {
    // Mostrar o botão após 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-all duration-300 hover:bg-green-600 hover:shadow-xl ${
        isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
      aria-label="Conversar no WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
