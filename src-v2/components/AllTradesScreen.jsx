import { useState } from 'react'
import DeleteTradeModal from './DeleteTradeModal'
import PortfolioStats from './PortfolioStats'
import {
  cyanOutlineButtonClass,
  primaryButtonClass,
  roseOutlineButtonClass,
  secondaryButtonClass,
  surfaceInsetClass,
  surfacePanelClass,
} from '../lib/uiTheme'

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

  return (
    <>
      <section className={`${surfacePanelClass} p-5`}>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">All Trades</h2>
            <p className="mt-1 text-sm text-slate-400">Full trade history and management</p>
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

        <div className="mt-4 space-y-3">
          <PortfolioStats portfolioStats={portfolioStats} compactMoney={compactMoney} money={money} />

          {trades.length === 0 ? (
            <article className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-center text-sm text-slate-400">
              No trades yet.
            </article>
          ) : (
            trades.map((trade) => {
              const tradeValue =
                Number.isFinite(trade.amount) && Number.isFinite(trade.price)
                  ? trade.amount * trade.price
                  : null

              return (
                <article
                  key={trade.id}
                  className={`${surfaceInsetClass} p-4`}
                >
                  <p className="text-sm font-medium text-slate-100">{renderTradeLine(trade)}</p>

                  <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                    <p>
                      <span className="text-slate-500">Order:</span> {trade.order ?? '-'}
                    </p>
                    <p>
                      <span className="text-slate-500">Tag:</span> {trade.tag ?? defaultTag}
                    </p>
                    <p>
                      <span className="text-slate-500">Amount:</span>{' '}
                      {Number.isFinite(trade.amount) ? trade.amount : '-'}
                    </p>
                    <p>
                      <span className="text-slate-500">Price:</span>{' '}
                      {Number.isFinite(trade.price) ? money.format(trade.price) : '-'}
                    </p>
                    <p>
                      <span className="text-slate-500">Trade Value:</span>{' '}
                      {tradeValue === null ? '-' : money.format(tradeValue)}
                    </p>
                    <p>
                      <span className="text-slate-500">Date:</span>{' '}
                      {formatTradeTimestamp(trade.createdAt)}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="text-slate-500">Trade ID:</span> {trade.id}
                    </p>
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
