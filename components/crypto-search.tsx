"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Check, Search, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { searchCrypto, type CryptoPrice } from "@/lib/api/crypto"

interface CryptoSearchProps {
  value?: CryptoPrice | null
  onSelect: (crypto: CryptoPrice) => void
  placeholder?: string
}

export function CryptoSearch({ value, onSelect, placeholder = "Buscar criptomoeda..." }: CryptoSearchProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.length >= 2) {
        setLoading(true)
        setError(false)
        try {
          const results = await searchCrypto(search)
          setCryptos(results)
        } catch (err) {
          console.error('Erro na busca:', err)
          setError(true)
          setCryptos([])
        } finally {
          setLoading(false)
        }
      } else {
        setCryptos([])
        setError(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <span className="flex items-center gap-2">
              {value.image && (
                <div className="relative h-4 w-4">
                  <Image 
                    src={value.image} 
                    alt={value.name} 
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </div>
              )}
              {value.name} ({value.symbol})
            </span>
          ) : (
            placeholder
          )}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Digite o nome ou símbolo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="max-h-60 overflow-auto">
          {loading && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Buscando...
            </div>
          )}
          {error && (
            <div className="p-2 text-center text-sm text-red-500">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Erro ao buscar. Tente novamente.
            </div>
          )}
          {!loading && !error && search.length >= 2 && cryptos.length === 0 && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Nenhuma criptomoeda encontrada.
            </div>
          )}
          {!loading && search.length < 2 && search.length > 0 && (
            <div className="p-2 text-center text-sm text-muted-foreground">
              Digite pelo menos 2 caracteres...
            </div>
          )}
          {cryptos.map((crypto) => (
            <button
              key={crypto.id}
              onClick={() => {
                onSelect(crypto)
                setOpen(false)
                setSearch("")
              }}
              className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
            >
              {crypto.image && (
                <div className="relative h-4 w-4 shrink-0">
                  <Image 
                    src={crypto.image} 
                    alt={crypto.name} 
                    fill
                    className="object-contain"
                    sizes="16px"
                  />
                </div>
              )}
              <span className="flex-1 text-left">
                {crypto.name} ({crypto.symbol})
              </span>
              <span className="text-xs text-muted-foreground">
                {crypto.current_price > 0 
                  ? `R$ ${crypto.current_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  : 'Preço indisponível'
                }
              </span>
              {value?.id === crypto.id && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}