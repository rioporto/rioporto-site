// components/admin/quotations-chart.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface QuotationsChartProps {
  quotations: any[]
}

export function QuotationsChart({ quotations }: QuotationsChartProps) {
  // Dados para o gráfico de barras (últimos 7 dias)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dayQuotations = quotations.filter(q => {
      const qDate = new Date(q.created_at)
      return qDate.toDateString() === date.toDateString()
    })
    
    return {
      date: format(date, 'dd/MM', { locale: ptBR }),
      total: dayQuotations.length,
      compra: dayQuotations.filter(q => q.type === 'buy').length,
      venda: dayQuotations.filter(q => q.type === 'sell').length,
      valor: dayQuotations.reduce((sum, q) => sum + q.total, 0)
    }
  })

  // Dados para o gráfico de pizza (status)
  const statusData = [
    { 
      name: 'Pendentes', 
      value: quotations.filter(q => q.status === 'pending').length,
      color: '#eab308'
    },
    { 
      name: 'Contactados', 
      value: quotations.filter(q => q.status === 'contacted').length,
      color: '#3b82f6'
    },
    { 
      name: 'Completados', 
      value: quotations.filter(q => q.status === 'completed').length,
      color: '#22c55e'
    },
    { 
      name: 'Cancelados', 
      value: quotations.filter(q => q.status === 'cancelled').length,
      color: '#ef4444'
    }
  ].filter(item => item.value > 0)

  // Dados para o gráfico de tipo
  const typeData = [
    {
      name: 'Compra',
      value: quotations.filter(q => q.type === 'buy').length,
      color: '#8b5cf6'
    },
    {
      name: 'Venda',
      value: quotations.filter(q => q.type === 'sell').length,
      color: '#f97316'
    }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'valor' 
                ? `R$ ${entry.value.toFixed(2)}` 
                : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Últimos 7 dias */}
      <Card>
        <CardHeader>
          <CardTitle>Cotações por Dia</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="compra" fill="#8b5cf6" name="Compra" />
              <Bar dataKey="venda" fill="#f97316" name="Venda" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Status</CardTitle>
          <CardDescription>Status atual das cotações</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Valores - Últimos 7 dias */}
      <Card>
        <CardHeader>
          <CardTitle>Volume em R$</CardTitle>
          <CardDescription>Valor total por dia (últimos 7 dias)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" fill="#22c55e" name="Valor Total" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza - Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo</CardTitle>
          <CardDescription>Compra vs Venda</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
