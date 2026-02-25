import {useEffect, useMemo, useState} from 'react'

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

    if (!stored) return TRADES

    const normalized = JSON.parse(stored)
        .map(normalizeTrade)
        .filter(Boolean)

    return normalized.length ? normalized : TRADES

  } catch {
    return TRADES
  }
}

function loadHoldings() {
  try {
    const stored = localStorage.getItem(HOLDINGS_STORAGE_KEY)

    if (!stored) return HOLDINGS

    const normalized = JSON.parse(stored)
        .map(normalizeHolding)
        .filter(Boolean)
    return normalized.length ? normalized : HOLDINGS

  } catch {
    return HOLDINGS
  }
}

function applyTradeToHoldings(currentHoldings, trade) {
  const holdings = [...currentHoldings]
  const idx = holdings.findIndex((h) => h.asset === trade.asset)
  const isBuy = trade.order === 'Buy'

  if (isBuy) {
    if (idx === -1) {
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

    const existing = holdings[idx]
    const nextAmount = existing.amount + trade.amount
    const nextAvgCost =
        (existing.amount * existing.avgCost + trade.amount * trade.price) / nextAmount

    holdings[idx] = {
      ...existing,
      amount: nextAmount,
      avgCost: nextAvgCost,
      currentPrice: trade.price,
    }

    return holdings
  }

  // SELL
  if (idx === -1) return holdings

  const existing = holdings[idx]
  const nextAmount = Math.max(existing.amount - trade.amount, 0)

  if (nextAmount === 0) {
    return holdings.filter((h) => h.asset !== trade.asset)
  }

  holdings[idx] = {
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
        (acc, holding) => {
          acc.value += holding.amount * holding.currentPrice
          acc.costBasis += holding.amount * holding.avgCost
          return acc
        },
        { value: 0, costBasis: 0 }
    )

    const pnl = value - costBasis
    const pnlPercent = costBasis ? (pnl / costBasis) * 100 : 0

    return { value, costBasis, pnl, pnlPercent }
  }, [holdings])

  const allocations = useMemo(() => {
    const totalValue = holdings.reduce((total, holding) => total + holding.amount * holding.currentPrice, 0)

    return holdings.map((holding) => {
      const value = holding.amount * holding.currentPrice
      const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0

      return {
        ...holding,
        value,
        percentage,
      }
    }).sort((a, b) => b.value - a.value)
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
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-800 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">Crypto Portfolio</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Dashboard</h1>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">Portfolio Value</p>
                <p className="mt-2 text-2xl font-semibold text-white">{compactMoney.format(portfolioStats.value)}</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">Cost Basis</p>
                <p className="mt-2 text-2xl font-semibold text-white">{compactMoney.format(portfolioStats.costBasis)}</p>
              </article>
              <article className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">Net P/L</p>
                <p className={`mt-2 text-2xl font-semibold ${portfolioStats.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {money.format(portfolioStats.pnl)}
                </p>
                <p className={`mt-1 text-sm ${portfolioStats.pnl >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
                  {portfolioStats.pnlPercent >= 0 ? '+' : ''}
                  {portfolioStats.pnlPercent.toFixed(2)}%
                </p>
              </article>
            </div>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
              <h2 className="text-lg font-medium text-white">Allocation</h2>
              <div className="mt-4 space-y-4">
                {allocations.slice(0, 4).map((holding) => (
                  <article key={holding.asset}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                      <span>{holding.asset}</span>
                      <span>{holding.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${Math.max(holding.percentage, 2)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{money.format(holding.value)}</p>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Trades</h2>
              <span className="text-xs tracking-wider text-slate-400">RECENT</span>
            </div>

            <div className="space-y-3">
              {trades.slice(0, 5).map((trade) => (
                <article key={trade.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <p className="text-sm font-medium text-slate-100">{renderTradeLine(trade)}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>{trade.tag ?? TAG_OPTIONS[0]}</span>
                    <span>{formatTradeTimestamp(trade.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              onClick={openTradeModal}
              className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Add Trade
            </button>
          </aside>
        </div>
      </section>

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={closeTradeModal}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-trade-title"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="add-trade-title" className="text-center text-2xl font-semibold text-white">
              Add Trade
            </h2>

            <form className="mt-6 space-y-4" onSubmit={handleAddTrade}>
              <label className="block space-y-1.5">
                <span className="text-sm text-slate-300">Asset</span>
                <input
                  name="asset"
                  type="text"
                  value={formData.asset}
                  onChange={onInputChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm text-slate-300">Amount</span>
                  <input
                    name="amount"
                    type="number"
                    step="any"
                    min="0"
                    value={formData.amount}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                    required
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm text-slate-300">Price</span>
                  <input
                    name="price"
                    type="number"
                    step="any"
                    min="0"
                    value={formData.price}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-sm text-slate-300">Order</span>
                  <select
                    name="order"
                    value={formData.order}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                  >
                    <option value="Buy">Buy</option>
                    <option value="Sell">Sell</option>
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm text-slate-300">Tag</span>
                  <select
                    name="tag"
                    value={formData.tag}
                    onChange={onInputChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                  >
                    {TAG_OPTIONS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                  Confirm Trade
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  )
}

export default App
