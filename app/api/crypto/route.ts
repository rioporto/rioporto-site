import { NextResponse } from "next/server"

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

// Headers para evitar problemas com a API
const headers = {
  'Accept': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'bitcoin-price': {
        console.log('Fetching Bitcoin price...')
        const response = await fetch(
          `${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=brl`,
          { 
            headers,
            next: { revalidate: 60 } // Cache por 1 minuto
          }
        )
        
        if (!response.ok) {
          console.error('Bitcoin price response not ok:', response.status)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Bitcoin price data:', data)
        
        const price = data?.bitcoin?.brl || 250000 // Fallback
        return NextResponse.json({ price })
      }

      case 'top-cryptos': {
        console.log('Fetching top cryptos...')
        const response = await fetch(
          `${COINGECKO_API}/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=300&page=1&sparkline=false`,
          { 
            headers,
            next: { revalidate: 300 } // Cache por 5 minutos
          }
        )
        
        if (!response.ok) {
          console.error('Top cryptos response not ok:', response.status)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        return NextResponse.json({ cryptos: data || [] })
      }

      case 'search': {
        const query = searchParams.get('q')
        if (!query) {
          return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
        }

        console.log('Searching for:', query)
        const response = await fetch(
          `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`,
          { 
            headers,
            next: { revalidate: 60 }
          }
        )
        
        if (!response.ok) {
          console.error('Search response not ok:', response.status)
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Busca preços das moedas encontradas
        if (data.coins && data.coins.length > 0) {
          const ids = data.coins.slice(0, 10).map((coin: any) => coin.id).join(',')
          const priceResponse = await fetch(
            `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=brl`,
            { headers }
          )
          
          let prices: Record<string, { brl: number }> = {}
          if (priceResponse.ok) {
            prices = await priceResponse.json()
          }
          
          const results = data.coins.slice(0, 10).map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            current_price: prices[coin.id]?.brl || 0,
            image: coin.thumb
          }))
          
          return NextResponse.json({ results })
        }
        
        return NextResponse.json({ results: [] })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('API Error:', error)
    
    // Retorna valores padrão em caso de erro
    if (action === 'bitcoin-price') {
      return NextResponse.json({ price: 250000 })
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch crypto data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}