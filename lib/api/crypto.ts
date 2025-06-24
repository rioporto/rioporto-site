// Serviço para buscar dados de criptomoedas
// Usando nossa API proxy para evitar problemas de CORS

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h?: number
  image?: string
}

export interface CryptoDetail {
  id: string
  symbol: string
  name: string
  market_data: {
    current_price: {
      brl: number
      usd: number
    }
    price_change_percentage_24h: number
  }
  image?: {
    small: string
  }
}

// Cache para evitar muitas requisições
const priceCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 60000 // 1 minuto

export async function getBitcoinPriceBRL(): Promise<number> {
  try {
    const cacheKey = 'btc-brl'
    const cached = priceCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    const response = await fetch('/api/crypto?action=bitcoin-price', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Failed to fetch Bitcoin price:', response.status)
      throw new Error('Failed to fetch Bitcoin price')
    }
    
    const data = await response.json()
    const price = data.price || 250000
    
    priceCache.set(cacheKey, { data: price, timestamp: Date.now() })
    
    return price
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error)
    // Retorna um valor padrão em caso de erro
    return 250000
  }
}

export async function getTop300Cryptos(): Promise<CryptoPrice[]> {
  try {
    const cacheKey = 'top300-cryptos'
    const cached = priceCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 5) { // Cache por 5 minutos
      return cached.data
    }

    const response = await fetch('/api/crypto?action=top-cryptos')
    
    if (!response.ok) throw new Error('Failed to fetch crypto list')
    
    const data = await response.json()
    
    const cryptos: CryptoPrice[] = data.cryptos.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      image: coin.image
    }))
    
    priceCache.set(cacheKey, { data: cryptos, timestamp: Date.now() })
    
    return cryptos
  } catch (error) {
    console.error('Error fetching crypto list:', error)
    return []
  }
}

export async function searchCrypto(query: string): Promise<CryptoPrice[]> {
  try {
    if (!query || query.length < 2) return []
    
    const response = await fetch(`/api/crypto?action=search&q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Failed to search crypto:', response.status)
      throw new Error('Failed to search crypto')
    }
    
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error searching crypto:', error)
    // Retorna algumas criptos padrão em caso de erro
    return FALLBACK_CRYPTOS.filter(crypto => 
      crypto.name.toLowerCase().includes(query.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(query.toLowerCase())
    )
  }
}

// Lista de criptomoedas de fallback
const FALLBACK_CRYPTOS: CryptoPrice[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 250000, image: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 12000, image: 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', current_price: 5.05, image: 'https://assets.coingecko.com/coins/images/325/thumb/Tether.png' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', current_price: 5.05, image: 'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', current_price: 1500, image: 'https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', current_price: 3.50, image: 'https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', current_price: 2.50, image: 'https://assets.coingecko.com/coins/images/975/thumb/cardano.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 450, image: 'https://assets.coingecko.com/coins/images/4128/thumb/solana.png' },
]

// Lista de stablecoins populares
export const POPULAR_STABLECOINS = [
  { id: 'tether', symbol: 'USDT', name: 'Tether' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin' },
  { id: 'binance-usd', symbol: 'BUSD', name: 'Binance USD' },
  { id: 'dai', symbol: 'DAI', name: 'Dai' },
  { id: 'true-usd', symbol: 'TUSD', name: 'TrueUSD' },
  { id: 'paxos-standard', symbol: 'PAX', name: 'Pax Dollar' },
  { id: 'gemini-dollar', symbol: 'GUSD', name: 'Gemini Dollar' },
]

// Função helper para formatar preço em BRL
export function formatCryptoPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: price < 1 ? 6 : 2
  }).format(price)
}