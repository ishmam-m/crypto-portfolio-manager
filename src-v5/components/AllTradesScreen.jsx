import { useMemo, useState } from 'react'
import DeleteTradeModal from './DeleteTradeModal'
import {
  cyanOutlineButtonClass,
  inlineSelectClass,
  primaryButtonClass,
  roseOutlineButtonClass,
  secondaryButtonClass,
  surfaceInsetClass,
  surfacePanelClass,
} from '../lib/uiTheme'

const ALL_FILTER = 'All'

function getTradeTimestamp(trade) {
  const timeValue = Date.parse(trade.createdAt ?? '')
  return Number.isNaN(timeValue) ? 0 : timeValue
}

function AllTradesScreen({
  trades,
  defaultTag,
  portfolioStats,
  compactMoney,
  money,
  renderTradeLine,
  formatTradeTimestamp,
  onBackToDashboard,
  onOpenTradeModal,
  onEditTrade,
  onDeleteTrade,
}) {
  const [pendingDeleteTrade, setPendingDeleteTrade] = useState(null)
  const [assetFilter, setAssetFilter] = useState(ALL_FILTER)
  const [orderFilter, setOrderFilter] = useState(ALL_FILTER)
  const [tagFilter, setTagFilter] = useState(ALL_FILTER)
  const [sortOrder, setSortOrder] = useState('Newest')

  const assetOptions = useMemo(() => {
    const sortedAssets = [...new Set(trades.map((trade) => trade.asset).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    )
    return [ALL_FILTER, ...sortedAssets]
  }, [trades])

  const filteredTrades = useMemo(() => {
    const nextTrades = trades.filter((trade) => {
      const matchesAsset = assetFilter === ALL_FILTER || trade.asset === assetFilter
      const matchesOrder = orderFilter === ALL_FILTER || trade.order === orderFilter
      const matchesTag = tagFilter === ALL_FILTER || (trade.tag ?? defaultTag) === tagFilter
      return matchesAsset && matchesOrder && matchesTag
    })

    nextTrades.sort((leftTrade, rightTrade) => {
      if (sortOrder === 'Oldest') {
        return getTradeTimestamp(leftTrade) - getTradeTimestamp(rightTrade)
      }

      return getTradeTimestamp(rightTrade) - getTradeTimestamp(leftTrade)
    })

    return nextTrades
  }, [assetFilter, defaultTag, orderFilter, sortOrder, tagFilter, trades])

  function requestDeleteTrade(trade) {
    setPendingDeleteTrade(trade)
  }

  function closeDeleteModal() {
    setPendingDeleteTrade(null)
  }

  function confirmDeleteTrade() {
    if (!pendingDeleteTrade) {
      return
    }

    onDeleteTrade(pendingDeleteTrade.id)
    closeDeleteModal()
  }

  function resetFilters() {
    setAssetFilter(ALL_FILTER)
    setOrderFilter(ALL_FILTER)
    setTagFilter(ALL_FILTER)
    setSortOrder('Newest')
  }

  return (
    <>
      <section className={`${surfacePanelClass} p-5`}>
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">All Trades</h2>
            <p className="mt-1 text-sm text-slate-300">Full trade history with filtering, sorting, and trade actions.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToDashboard}
              className={`${secondaryButtonClass} px-3 py-2 text-sm font-medium`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={onOpenTradeModal}
              className={`${primaryButtonClass} px-3 py-2 text-sm`}
            >
              Add Trade
            </button>
          </div>
        </header>

        <article className="mt-5 rounded-xl bg-slate-950/62 p-3.5">
          <div className="grid gap-2 sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Portfolio Value</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{compactMoney.format(portfolioStats.value)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Cost Basis</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{compactMoney.format(portfolioStats.costBasis)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Net P/L</p>
              <p className={`mt-1 text-sm font-semibold ${portfolioStats.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {compactMoney.format(portfolioStats.pnl)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-300">Trades Showing</p>
              <p className="mt-1 text-sm font-semibold text-slate-100 tabular-nums">
                {filteredTrades.length} / {trades.length}
              </p>
            </div>
          </div>
        </article>

        <article className="mt-4 rounded-xl bg-slate-950/62 p-3.5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-300">Filter and Sort</p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md px-2 py-1 text-xs font-medium text-cyan-200 transition hover:bg-cyan-500/15"
            >
              Reset
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-200">Asset</span>
              <select
                value={assetFilter}
                onChange={(event) => setAssetFilter(event.target.value)}
                className={inlineSelectClass}
              >
                {assetOptions.map((asset) => (
                  <option key={asset} value={asset}>
                    {asset}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-200">Order</span>
              <select
                value={orderFilter}
                onChange={(event) => setOrderFilter(event.target.value)}
                className={inlineSelectClass}
              >
                <option value={ALL_FILTER}>{ALL_FILTER}</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-200">Horizon</span>
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className={inlineSelectClass}
              >
                <option value={ALL_FILTER}>{ALL_FILTER}</option>
                <option value="Short-Term">Short-Term</option>
                <option value="Long-Term">Long-Term</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-200">Sort</span>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className={inlineSelectClass}
              >
                <option value="Newest">Newest first</option>
                <option value="Oldest">Oldest first</option>
              </select>
            </label>
          </div>
        </article>

        <div className="mt-4 space-y-3">
          {filteredTrades.length === 0 ? (
            <article className="rounded-xl bg-slate-950/55 p-5 text-center text-sm text-slate-300">
              {trades.length === 0 ? 'No trades yet.' : 'No trades match the selected filters.'}
            </article>
          ) : (
            filteredTrades.map((trade) => {
              const tradeValue =
                Number.isFinite(trade.amount) && Number.isFinite(trade.price)
                  ? trade.amount * trade.price
                  : null

              return (
                <article
                  key={trade.id}
                  className={`${surfaceInsetClass} p-4`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{renderTradeLine(trade)}</p>
                      <p className="mt-1 text-xs text-slate-300 tabular-nums">{formatTradeTimestamp(trade.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-semibold">
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          trade.order === 'Buy' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'
                        }`}
                      >
                        {trade.order ?? '-'}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-100">
                        {trade.tag ?? defaultTag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-300">Amount</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-100 tabular-nums">
                        {Number.isFinite(trade.amount) ? trade.amount : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-300">Price</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-100">
                        {Number.isFinite(trade.price) ? money.format(trade.price) : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-300">Trade Value</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-100">
                        {tradeValue === null ? '-' : money.format(tradeValue)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-300">Asset</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-100">{trade.asset ?? '-'}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditTrade(trade.id)}
                      className={`${cyanOutlineButtonClass} px-3 py-1.5 text-xs font-medium`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeleteTrade(trade)}
                      className={`${roseOutlineButtonClass} px-3 py-1.5 text-xs font-medium`}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      <DeleteTradeModal
        trade={pendingDeleteTrade}
        defaultTag={defaultTag}
        money={money}
        renderTradeLine={renderTradeLine}
        formatTradeTimestamp={formatTradeTimestamp}
        onCancel={closeDeleteModal}
        onConfirm={confirmDeleteTrade}
      />
    </>
  )
}

export default AllTradesScreen
