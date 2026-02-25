import { useEffect, useMemo, useState } from 'react'
import AddTradeModal from './components/AddTradeModal'
import AllocationPanel from './components/AllocationPanel'
import DashboardHeader from './components/DashboardHeader'
import PortfolioStats from './components/PortfolioStats'
import RecentTradesPanel from './components/RecentTradesPanel'

const TRADES_STORAGE_KEY = 'trades'
const HOLDINGS_STORAGE_KEY = 'holdings'
const TAG_OPTIONS = ['Short-Term', 'Long-Term']

const TRADES = [
  {
    id: crypto.randomUUID(),
    asset: 'BTC',
    amount: 0.015,
    price: 68000,
    order: 'Buy',
    tag: 'Long-Term',
    createdAt: '2026-02-22T05:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    asset: 'ETH',
    amount: 0.42,
    price: 1960,
    order: 'Buy',
    tag: 'Short-Term',
    createdAt: '2026-02-21T05:00:00.000Z',
  },
  {
    id: crypto.randomUUID(),
    asset: 'SOL',
    amount: 2.5,
    price: 82.5,
    order: 'Sell',
    tag: 'Short-Term',
    createdAt: '2026-02-20T05:00:00.000Z',
  },
]

const HOLDINGS = [
  { asset: 'BTC', amount: 0.17, avgCost: 63100, currentPrice: 68640 },
  { asset: 'ETH', amount: 2.8, avgCost: 2810, currentPrice: 3210 },
  { asset: 'SOL', amount: 19, avgCost: 128, currentPrice: 146.3 },
]

const INITIAL_FORM = {
  asset: '',
  amount: '',
  price: '',
  order: 'Buy',
  tag: TAG_OPTIONS[0],
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const compactMoney = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

function formatTradeTimestamp(timestamp) {
  if (!timestamp) {
    return 'No timestamp'
  }

  const parsed = new Date(timestamp)

  if (Number.isNaN(parsed.getTime())) {
    return 'No timestamp'
  }

  return parsed.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function normalizeTrade(rawTrade) {
  if (!rawTrade || typeof rawTrade !== 'object') {
    return null
  }

  return {
    id: rawTrade.id ?? crypto.randomUUID(),
    asset: typeof rawTrade.asset === 'string' ? rawTrade.asset.toUpperCase() : null,
    amount: Number(rawTrade.amount),
    price: Number(rawTrade.price),
    order: rawTrade.order === 'Buy' ? 'Buy' : 'Sell',
    tag: typeof rawTrade.tag === 'string' ? rawTrade.tag : TAG_OPTIONS[0],
    createdAt: rawTrade.createdAt ?? null,
    summary: typeof rawTrade.summary === 'string' ? rawTrade.summary : null,
  }
}

function normalizeHolding(rawHolding) {
  if (!rawHolding || typeof rawHolding !== 'object') {
    return null
  }

  const asset = typeof rawHolding.asset === 'string' ? rawHolding.asset.toUpperCase().trim() : ''
  const amount = Number(rawHolding.amount)
  const avgCost = Number(rawHolding.avgCost)
  const currentPrice = Number(rawHolding.currentPrice)

  if (!asset || !Number.isFinite(amount) || amount <= 0) {
    return null
  }

  return {
    asset,
    amount,
    avgCost: Number.isFinite(avgCost) && avgCost > 0 ? avgCost : 0,
    currentPrice: Number.isFinite(currentPrice) && currentPrice > 0 ? currentPrice : 0,
  }
}

function loadTrades() {
  try {
    const stored = localStorage.getItem(TRADES_STORAGE_KEY)

    if (!stored) {
      return TRADES
    }

    const normalized = JSON.parse(stored).map(normalizeTrade).filter(Boolean)
    return normalized.length ? normalized : TRADES
  } catch {
    return TRADES
  }
}

function loadHoldings() {
  try {
    const stored = localStorage.getItem(HOLDINGS_STORAGE_KEY)

    if (!stored) {
      return HOLDINGS
    }

    const normalized = JSON.parse(stored).map(normalizeHolding).filter(Boolean)
    return normalized.length ? normalized : HOLDINGS
  } catch {
    return HOLDINGS
  }
}

function applyTradeToHoldings(currentHoldings, trade) {
  const holdings = [...currentHoldings]
  const holdingIndex = holdings.findIndex((holding) => holding.asset === trade.asset)

  if (trade.order === 'Buy') {
    if (holdingIndex === -1) {
      return [
        ...holdings,
        {
          asset: trade.asset,
          amount: trade.amount,
          avgCost: trade.price,
          currentPrice: trade.price,
        },
      ]
    }

    const existing = holdings[holdingIndex]
    const nextAmount = existing.amount + trade.amount
    const nextAvgCost =
      (existing.amount * existing.avgCost + trade.amount * trade.price) / nextAmount

    holdings[holdingIndex] = {
      ...existing,
      amount: nextAmount,
      avgCost: nextAvgCost,
      currentPrice: trade.price,
    }

    return holdings
  }

  if (holdingIndex === -1) {
    return holdings
  }

  const existing = holdings[holdingIndex]
  const nextAmount = Math.max(existing.amount - trade.amount, 0)

  if (nextAmount === 0) {
    return holdings.filter((holding) => holding.asset !== trade.asset)
  }

  holdings[holdingIndex] = {
    ...existing,
    amount: nextAmount,
    currentPrice: trade.price,
  }

  return holdings
}

function App() {
  const [trades, setTrades] = useState(loadTrades)
  const [holdings, setHoldings] = useState(loadHoldings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)

  const portfolioStats = useMemo(() => {
    const { value, costBasis } = holdings.reduce(
      (accumulator, holding) => {
        accumulator.value += holding.amount * holding.currentPrice
        accumulator.costBasis += holding.amount * holding.avgCost
        return accumulator
      },
      { value: 0, costBasis: 0 },
    )

    const pnl = value - costBasis
    const pnlPercent = costBasis ? (pnl / costBasis) * 100 : 0

    return { value, costBasis, pnl, pnlPercent }
  }, [holdings])

  const allocations = useMemo(() => {
    const totalValue = holdings.reduce(
      (total, holding) => total + holding.amount * holding.currentPrice,
      0,
    )

    return holdings
      .map((holding) => {
        const value = holding.amount * holding.currentPrice
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0

        return {
          ...holding,
          value,
          percentage,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [holdings])

  useEffect(() => {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades))
  }, [trades])

  useEffect(() => {
    localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(holdings))
  }, [holdings])

  function openTradeModal() {
    setFormData(INITIAL_FORM)
    setIsModalOpen(true)
  }

  function closeTradeModal() {
    setIsModalOpen(false)
  }

  function onInputChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleAddTrade(event) {
    event.preventDefault()

    const asset = formData.asset.trim().toUpperCase()
    const amountValue = Number(formData.amount)
    const priceValue = Number(formData.price)

    if (!asset || !Number.isFinite(amountValue) || !Number.isFinite(priceValue)) {
      return
    }

    if (amountValue <= 0 || priceValue <= 0) {
      return
    }

    const trade = {
      id: crypto.randomUUID(),
      asset,
      amount: amountValue,
      price: priceValue,
      order: formData.order,
      tag: formData.tag,
      createdAt: new Date().toISOString(),
    }

    setTrades((current) => [trade, ...current])
    setHoldings((current) => applyTradeToHoldings(current, trade))
    closeTradeModal()
  }

  function renderTradeLine(trade) {
    if (!Number.isFinite(trade.amount) || !Number.isFinite(trade.price) || !trade.asset) {
      return trade.summary ?? 'Trade entry'
    }

    return `${trade.asset} ${trade.order} ${trade.amount} @ ${money.format(trade.price)}`
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-100">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-sm">
        <DashboardHeader />

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="space-y-6">
            <PortfolioStats
              portfolioStats={portfolioStats}
              compactMoney={compactMoney}
              money={money}
            />

            <AllocationPanel allocations={allocations} money={money} />
          </section>

          <RecentTradesPanel
            trades={trades}
            defaultTag={TAG_OPTIONS[0]}
            onOpenTradeModal={openTradeModal}
            renderTradeLine={renderTradeLine}
            formatTradeTimestamp={formatTradeTimestamp}
          />
        </div>
      </section>

      <AddTradeModal
        isOpen={isModalOpen}
        formData={formData}
        tagOptions={TAG_OPTIONS}
        onClose={closeTradeModal}
        onInputChange={onInputChange}
        onSubmit={handleAddTrade}
      />
    </main>
  )
}

export default App
