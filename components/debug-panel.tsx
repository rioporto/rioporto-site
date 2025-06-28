// components/debug-panel.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Bug } from 'lucide-react'

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  
  useEffect(() => {
    // Interceptar console.log
    const originalLog = console.log
    const originalError = console.error
    
    console.log = (...args) => {
      originalLog(...args)
      setLogs(prev => [...prev, `[LOG] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`])
    }
    
    console.error = (...args) => {
      originalError(...args)
      setLogs(prev => [...prev, `[ERROR] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`])
    }
    
    // Interceptar erros de rede
    window.addEventListener('error', (event) => {
      setLogs(prev => [...prev, `[WINDOW ERROR] ${event.message}`])
    })
    
    return () => {
      console.log = originalLog
      console.error = originalError
    }
  }, [])
  
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        size="icon"
        variant="outline"
      >
        <Bug className="w-4 h-4" />
      </Button>
    )
  }
  
  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 z-50 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">Debug Panel</CardTitle>
        <Button
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
          className="h-6 w-6"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-2">
        <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs font-mono h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">Aguardando logs...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className={log.includes('[ERROR]') ? 'text-red-400' : ''}>
                {log}
              </div>
            ))
          )}
        </div>
        <Button
          onClick={() => setLogs([])}
          size="sm"
          variant="outline"
          className="mt-2 w-full"
        >
          Limpar Logs
        </Button>
      </CardContent>
    </Card>
  )
}
