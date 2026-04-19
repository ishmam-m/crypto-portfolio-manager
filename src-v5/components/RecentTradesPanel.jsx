import {
  primaryButtonClass,
  secondaryButtonClass,
  surfaceInsetClass,
  surfacePanelClass,
} from '../lib/uiTheme'
import TooltipIcon from './TooltipIcon'

function RecentTradesPanel({
  trades,
  defaultTag,
  onOpenTradeModal,
  onOpenTradesScreen,
  renderTradeLine,
  formatTradeTimestamp,
}) {
  const tradesTooltip =
    'Trades are your recorded buy and sell transactions, which power your holdings and performance calculations. Add Trade opens the form to log a new transaction. View All Trades opens your complete trade history.'

  return (
    <aside className={`${surfacePanelClass} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-1 text-lg font-medium text-white">
          <span>Trades</span>
          <TooltipIcon text={tradesTooltip} label="Trades explanation" />
        </h2>
        <span className="text-xs tracking-wider text-slate-300">RECENT</span>
      </div>

      <div className="space-y-3">
        {trades.slice(0, 5).map((trade) => (
          <article key={trade.id} className={`${surfaceInsetClass} p-3.5`}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{renderTradeLine(trade)}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  trade.order === 'Buy' ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'
                }`}
              >
                {trade.order}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
              <span>{trade.tag ?? defaultTag}</span>
              <span className="tabular-nums">{formatTradeTimestamp(trade.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOpenTradeModal}
          className={`${primaryButtonClass} w-full rounded-xl px-4 py-2.5 text-sm`}
        >
          Add Trade
        </button>
        <button
          type="button"
          onClick={onOpenTradesScreen}
          className={`${secondaryButtonClass} w-full rounded-xl px-4 py-2.5 text-sm`}
        >
          View All Trades
        </button>
      </div>
    </aside>
  )
}

export default RecentTradesPanel
