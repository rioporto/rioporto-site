"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CryptoSearch } from "@/components/crypto-search"
import { Bitcoin, DollarSign, Info, ArrowRight, Calculator, Shield, TrendingUp, TrendingDown, Loader2, User, CheckCircle2, XCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { formatBRL, cn } from "@/lib/utils"
import { getBitcoinPriceBRL, type CryptoPrice } from "@/lib/api/crypto"
import { abrirWhatsApp } from "@/lib/whatsapp-simple"

interface CotacaoForm {
  tipo: "compra" | "venda"
  moeda: "btc" | "outra"
  moedaSelecionada?: CryptoPrice
  valorBRL: string
  valorCripto: string
  nome: string
  email: string
  telefone: string
  wallet?: string
  observacoes?: string
}

// Interface para dados da cotação enviada
interface DadosCotacaoEnviada {
  tipo: "compra" | "venda"
  moeda: string
  valorBRL: string
  valorCripto: string
  nome: string
  email: string
  telefone?: string
  observacoes?: string
}

const COMMISSION_RATES = [
  { limit: 4999, rate: 0.035 },
  { limit: 50000, rate: 0.025 },
  { limit: 100000, rate: 0.015 },
  { limit: Infinity, rate: 0.01 },
]

// Valor padrão do Bitcoin caso a API falhe
const DEFAULT_BITCOIN_PRICE = 250000

export default function CotacaoPage() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [loadingPrice, setLoadingPrice] = useState(true)
  const [bitcoinPrice, setBitcoinPrice] = useState(DEFAULT_BITCOIN_PRICE)
  const [priceChange, setPriceChange] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [priceError, setPriceError] = useState(false)
  const [cotacaoEnviada, setCotacaoEnviada] = useState(false)
  const [dadosCotacaoEnviada, setDadosCotacaoEnviada] = useState<DadosCotacaoEnviada | null>(null)
  
  const [formData, setFormData] = useState<CotacaoForm>({
    tipo: "compra",
    moeda: "btc",
    valorBRL: "",
    valorCripto: "",
    nome: profile?.name || "",
    email: profile?.email || "",
    telefone: profile?.phone || "",
    wallet: "",
    observacoes: "",
  })

  // Função para buscar o preço do Bitcoin
  const fetchBitcoinPrice = useCallback(async () => {
    try {
      setLoadingPrice(true)
      setPriceError(false)
      const price = await getBitcoinPriceBRL()
      
      if (price && price > 0) {
        setBitcoinPrice(prevPrice => {
          // Só calcula a mudança se não for o primeiro carregamento
          if (prevPrice !== DEFAULT_BITCOIN_PRICE) {
            setPriceChange(((price - prevPrice) / prevPrice) * 100)
          }
          return price
        })
        
        setLastUpdate(new Date())
      } else {
        throw new Error('Invalid price')
      }
    } catch (error) {
      console.error('Erro ao buscar preço do Bitcoin:', error)
      setPriceError(true)
      // Mantém o último preço válido
    } finally {
      setLoadingPrice(false)
    }
  }, [])

  // Busca o preço do Bitcoin ao carregar a página
  useEffect(() => {
    fetchBitcoinPrice()
    const interval = setInterval(fetchBitcoinPrice, 60000) // Atualiza a cada minuto
    return () => clearInterval(interval)
  }, [fetchBitcoinPrice])

  // Atualiza os dados do formulário quando o perfil do usuário é carregado
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        nome: profile.name || prev.nome,
        email: profile.email || prev.email,
        telefone: profile.phone || prev.telefone,
      }))
    }
  }, [profile])

  const getCommissionRate = (value: number) => {
    const tier = COMMISSION_RATES.find(tier => value <= tier.limit)
    return tier?.rate || 0.01
  }

  const getCurrentPrice = () => {
    if (formData.moeda === "btc") {
      return bitcoinPrice
    } else if (formData.moedaSelecionada) {
      return formData.moedaSelecionada.current_price
    }
    return 0
  }

  const calculateValues = (brlValue: string, cryptoValue: string, field: "brl" | "crypto") => {
    const price = getCurrentPrice()
    if (!price) return

    if (field === "brl" && brlValue) {
      const brl = parseFloat(brlValue)
      if (!isNaN(brl)) {
        const commission = brl * getCommissionRate(brl)
        const netValue = formData.tipo === "compra" ? brl - commission : brl + commission
        const crypto = netValue / price
        const decimals = formData.moeda === "btc" || formData.moedaSelecionada?.symbol === "BTC" ? 8 : 2
        setFormData(prev => ({ 
          ...prev, 
          valorBRL: brlValue, 
          valorCripto: crypto.toFixed(decimals) 
        }))
      }
    } else if (field === "crypto" && cryptoValue) {
      const crypto = parseFloat(cryptoValue)
      if (!isNaN(crypto)) {
        const grossValue = crypto * price
        const commission = grossValue * getCommissionRate(grossValue)
        const brl = formData.tipo === "compra" ? grossValue + commission : grossValue - commission
        setFormData(prev => ({ 
          ...prev, 
          valorBRL: brl.toFixed(2), 
          valorCripto: cryptoValue 
        }))
      }
    }
  }

  const handleCryptoSelect = (crypto: CryptoPrice) => {
    setFormData(prev => ({ 
      ...prev, 
      moedaSelecionada: crypto,
      valorBRL: "",
      valorCripto: ""
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar dados essenciais
    if (!user) {
      // Usuário não logado - nome e email são obrigatórios
      if (!formData.nome.trim() || !formData.email.trim()) {
        toast.error('Por favor, preencha nome e email')
        return
      }
    }
    
    // Validar valores
    if (!formData.valorBRL || !formData.valorCripto) {
      toast.error('Por favor, preencha os valores da cotação')
      return
    }
    
    setLoading(true)

    try {
      const cryptoName = formData.moeda === "btc" 
        ? "Bitcoin (BTC)" 
        : formData.moedaSelecionada 
          ? `${formData.moedaSelecionada.name} (${formData.moedaSelecionada.symbol})`
          : "Criptomoeda"

      // Usar dados do perfil se o usuário estiver logado
      const dadosEnvio = {
        ...formData,
        nome: profile?.name || formData.nome,
        email: profile?.email || formData.email,
        telefone: profile?.phone || formData.telefone || '',
        cryptoName,
        price: getCurrentPrice()
      }
      
      console.log('Enviando dados:', dadosEnvio);

      const response = await fetch("/api/cotacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosEnvio),
      })

      console.log('Response status:', response.status);
      const data = await response.json()
      console.log('Response data:', data);
      console.log('Response data type:', typeof data);
      console.log('Response data.details type:', typeof data.details);

      if (response.ok) {
        toast.success("Cotação enviada com sucesso!")
        
        // Salvar dados da cotação para o botão de reabrir WhatsApp
        const dadosSalvos: DadosCotacaoEnviada = {
          tipo: formData.tipo,
          moeda: cryptoName,
          valorBRL: formData.valorBRL,
          valorCripto: formData.valorCripto,
          nome: profile?.name || formData.nome,
          email: profile?.email || formData.email,
          telefone: profile?.phone || formData.telefone,
          observacoes: formData.observacoes
        }
        setDadosCotacaoEnviada(dadosSalvos)
        setCotacaoEnviada(true)
        
        // Abrir WhatsApp automaticamente após 2 segundos
        setTimeout(() => {
          abrirWhatsApp(dadosSalvos);
        }, 2000);
        
        // Limpar formulário mantendo dados do usuário se logado
        setFormData({
          tipo: "compra",
          moeda: "btc",
          valorBRL: "",
          valorCripto: "",
          nome: profile?.name || "",
          email: profile?.email || "",
          telefone: profile?.phone || "",
          wallet: "",
          observacoes: "",
        })
        
        // Resetar estado após 30 segundos
        setTimeout(() => {
          setCotacaoEnviada(false)
          setDadosCotacaoEnviada(null)
        }, 30000)
      } else {
        // Tratar erros específicos
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details.map((d: any) => `${d.field}: ${d.message}`).join(', ')
          toast.error(`Erro de validação: ${errorMessages}`)
        } else if (data.details) {
          toast.error(`Erro: ${data.details}`)
        } else {
          throw new Error(data.error || "Erro ao enviar cotação")
        }
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : "Erro ao enviar cotação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">Cotação P2P</h1>
            <p className="text-lg text-muted-foreground">
              Compre ou venda criptomoedas com as melhores taxas do mercado
            </p>
            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className="gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                {priceError ? "Valor de referência" : "Dados em tempo real"}
              </Badge>
            </div>
          </div>

          {/* Alerta de sucesso após envio */}
          {cotacaoEnviada && dadosCotacaoEnviada && (
            <Alert className="mb-8 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900 dark:text-green-100">Cotação enviada com sucesso!</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>Recebemos sua solicitação e nossa equipe entrará em contato em breve.</p>
                <div className="mt-3 space-y-2">
                  <p className="font-semibold">Próximos passos:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Sua cotação foi salva em nosso sistema</li>
                    <li>O WhatsApp abrirá automaticamente em instantes</li>
                    <li>Envie a mensagem pré-formatada para nossa equipe</li>
                    <li>Aguarde nosso contato para finalizar a operação</li>
                  </ul>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="default"
                      onClick={() => {
                        if (dadosCotacaoEnviada) {
                          abrirWhatsApp(dadosCotacaoEnviada);
                        }
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Abrir WhatsApp Novamente
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                    >
                      <a 
                        href="https://wa.me/552120187776" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Contato Direto
                      </a>
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Formulário Principal */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Cotação</CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo para receber sua cotação personalizada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alerta para usuários não logados */}
                    {!user && (
                      <Alert>
                        <User className="h-4 w-4" />
                        <AlertTitle>Faça login para uma experiência melhor</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>Com uma conta você terá:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Dados preenchidos automaticamente</li>
                            <li>Histórico de transações</li>
                            <li>Acesso a cursos gratuitos</li>
                            <li>Atendimento prioritário</li>
                          </ul>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" asChild>
                              <Link href="/login">Fazer Login</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href="/cadastro">Criar Conta</Link>
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Badge indicando usuário logado */}
                    {user && profile && (
                      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                        <User className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-900 dark:text-green-100">Olá, {profile.name}!</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>Seus dados para a cotação:</p>
                          <div className="text-sm space-y-1">
                            <p><strong>Email:</strong> {profile.email}</p>
                            {profile.phone && <p><strong>WhatsApp:</strong> {profile.phone}</p>}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Campo de telefone para usuários logados sem telefone */}
                    {user && (!profile?.phone || !profile.phone.trim()) && (
                      <div className="space-y-2">
                        <Label htmlFor="telefone-logado">WhatsApp (opcional - para contato rápido)</Label>
                        <Input
                          id="telefone-logado"
                          type="tel"
                          placeholder="+55 21 99999-9999"
                          value={formData.telefone}
                          onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                        />
                        <p className="text-sm text-muted-foreground">
                          Adicione seu WhatsApp para facilitar o contato sobre sua cotação
                        </p>
                      </div>
                    )}

                    {/* Tipo de Operação */}
                    <div className="space-y-3">
                      <Label>Tipo de Operação</Label>
                      <RadioGroup
                        value={formData.tipo}
                        onValueChange={(value: "compra" | "venda") => 
                          setFormData(prev => ({ ...prev, tipo: value }))
                        }
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 rounded-lg border p-4">
                            <RadioGroupItem value="compra" id="compra" />
                            <Label htmlFor="compra" className="flex-1 cursor-pointer">
                              <span className="block font-semibold">Comprar</span>
                              <span className="text-sm text-muted-foreground">
                                R$ → Cripto
                              </span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-lg border p-4">
                            <RadioGroupItem value="venda" id="venda" />
                            <Label htmlFor="venda" className="flex-1 cursor-pointer">
                              <span className="block font-semibold">Vender</span>
                              <span className="text-sm text-muted-foreground">
                                Cripto → R$
                              </span>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Seleção de Moeda */}
                    <div className="space-y-2">
                      <Label htmlFor="moeda">Criptomoeda</Label>
                      <Select
                        value={formData.moeda}
                        onValueChange={(value: "btc" | "outra") => {
                          setFormData(prev => ({ 
                            ...prev, 
                            moeda: value,
                            moedaSelecionada: undefined,
                            valorBRL: "",
                            valorCripto: ""
                          }))
                        }}
                      >
                        <SelectTrigger id="moeda">
                          <SelectValue placeholder="Selecione a criptomoeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btc">
                            <span className="flex items-center gap-2">
                              <Bitcoin className="h-4 w-4 bitcoin-text" />
                              <span className="font-semibold">Bitcoin (BTC)</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Recomendado
                              </Badge>
                            </span>
                          </SelectItem>
                          <SelectItem value="outra">
                            <span className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Outra Criptomoeda
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Campo de busca para outras criptomoedas */}
                      {formData.moeda === "outra" && (
                        <div className="mt-2">
                          <CryptoSearch
                            value={formData.moedaSelecionada}
                            onSelect={handleCryptoSelect}
                            placeholder="Buscar criptomoeda..."
                          />
                        </div>
                      )}
                    </div>

                    {/* Valores */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="valorBRL">Valor em R$</Label>
                        <Input
                          id="valorBRL"
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={formData.valorBRL}
                          onChange={(e) => calculateValues(e.target.value, formData.valorCripto, "brl")}
                          required
                          disabled={formData.moeda === "outra" && !formData.moedaSelecionada}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="valorCripto">
                          Valor em {
                            formData.moeda === "btc" 
                              ? "BTC" 
                              : formData.moedaSelecionada?.symbol || "Cripto"
                          }
                        </Label>
                        <Input
                          id="valorCripto"
                          type="number"
                          step={formData.moeda === "btc" || formData.moedaSelecionada?.symbol === "BTC" ? "0.00000001" : "0.01"}
                          placeholder="0,00"
                          value={formData.valorCripto}
                          onChange={(e) => calculateValues(formData.valorBRL, e.target.value, "crypto")}
                          required
                          disabled={formData.moeda === "outra" && !formData.moedaSelecionada}
                        />
                      </div>
                    </div>

                    {/* Alerta KYC */}
                    {parseFloat(formData.valorBRL) > 5000 && (
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Verificação KYC necessária</strong><br />
                          Para valores acima de R$ 5.000,00 é necessário completar o processo de verificação de identidade.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Dados Pessoais - Só mostra se não estiver logado */}
                    {!user && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nome">Nome Completo</Label>
                          <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefone">WhatsApp (opcional)</Label>
                            <Input
                              id="telefone"
                              type="tel"
                              placeholder="+55 21 99999-9999"
                              value={formData.telefone}
                              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                            />
                            <p className="text-xs text-muted-foreground">
                              Adicione para receber notificações importantes
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Campos Adicionais */}
                    {formData.tipo === "compra" && (
                      <div className="space-y-2">
                        <Label htmlFor="wallet">
                          Endereço da Wallet (opcional)
                        </Label>
                        <Input
                          id="wallet"
                          placeholder="Endereço para receber as criptomoedas"
                          value={formData.wallet}
                          onChange={(e) => setFormData(prev => ({ ...prev, wallet: e.target.value }))}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="observacoes">Observações (opcional)</Label>
                      <Textarea
                        id="observacoes"
                        rows={3}
                        value={formData.observacoes}
                        onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Enviar Cotação
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar com Informações */}
            <div className="space-y-6">
              {/* Cotação do Bitcoin em Tempo Real */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="h-5 w-5 bitcoin-text" />
                    Bitcoin Agora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingPrice && !priceError ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-3xl font-bold">{formatBRL(bitcoinPrice)}</p>
                          {priceChange !== 0 && !priceError && (
                            <p className={cn(
                              "flex items-center gap-1 text-sm",
                              priceChange > 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {priceChange > 0 ? (
                                <TrendingUp className="h-4 w-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4" />
                              )}
                              {Math.abs(priceChange).toFixed(2)}%
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {priceError ? "Valor de referência" : `Atualizado: ${lastUpdate.toLocaleTimeString('pt-BR')}`}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tabela de Comissões */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Tabela de Comissões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Até R$ 4.999</span>
                      <span className="font-semibold">3,5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">R$ 5.000 - R$ 50.000</span>
                      <span className="font-semibold">2,5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">R$ 50.001 - R$ 100.000</span>
                      <span className="font-semibold">1,5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Acima de R$ 100.000</span>
                      <span className="font-semibold">Negociável</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Como Funciona */}
              <Card>
                <CardHeader>
                  <CardTitle>Como Funciona?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">1.</span>
                      <span>Preencha o formulário com os dados da operação</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">2.</span>
                      <span>Nossa equipe analisará sua solicitação</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">3.</span>
                      <span>
                        {formData.tipo === "compra" 
                          ? "Realize o pagamento conforme instruções" 
                          : "Envie suas criptomoedas para a wallet indicada"}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-primary">4.</span>
                      <span>
                        {formData.tipo === "compra" 
                          ? "Receba suas criptomoedas na wallet indicada" 
                          : "Receba o valor em R$ via PIX ou conta bancária"}
                      </span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Contato Direto */}
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle>Atendimento Direto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    Prefere falar diretamente com nossa equipe?
                  </p>
                  <Button 
                    asChild 
                    className="w-full"
                    variant="outline"
                  >
                    <a 
                      href="https://wa.me/552120187776?text=Olá!%20Gostaria%20de%20fazer%20uma%20cotação%20P2P"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      💬 WhatsApp: +55 21 2018-7776
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Atendimento de segunda a sábado
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
