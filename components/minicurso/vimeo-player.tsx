"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, X } from 'lucide-react'

interface VimeoPlayerProps {
  videoId: string
  title?: string
  className?: string
  onComplete?: () => void
}

export function VimeoPlayer({ videoId, title = "Vídeo", className = "", onComplete }: VimeoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const handlePlay = () => {
    setShowVideo(true)
    setIsPlaying(true)
  }

  const handleClose = () => {
    setShowVideo(false)
    setIsPlaying(false)
  }

  return (
    <>
      {!showVideo ? (
        <Card className={`relative overflow-hidden cursor-pointer group ${className}`} onClick={handlePlay}>
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 mb-4 mx-auto w-fit group-hover:bg-primary/20 transition-colors">
                <Play className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">Clique para assistir</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className={`relative ${className}`}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="aspect-video">
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={title}
              onEnded={onComplete}
            />
          </div>
        </div>
      )}
    </>
  )
}
