import {
  cyanFocusRingClass,
  primaryButtonClass,
  surfaceInsetClass,
  surfacePanelClass,
} from '../lib/uiTheme'

function RecentTradesPanel({
  trades,
  defaultTag,
  onOpenTradeModal,
  onOpenTradesScreen,
  renderTradeLine,
  formatTradeTimestamp,
}) {
  return (
    <aside className={`${surfacePanelClass} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onOpenTradesScreen}
          className={`text-lg font-medium text-white transition hover:text-cyan-300 ${cyanFocusRingClass}`}
        >
          Trades
        </button>
        <span className="text-xs tracking-wider text-slate-400">RECENT</span>
      </div>

      <div className="space-y-3">
        {trades.slice(0, 5).map((trade) => (
          <article key={trade.id} className={`${surfaceInsetClass} p-3`}>
            <p className="text-sm font-medium text-slate-100">{renderTradeLine(trade)}</p>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
              <span>{trade.tag ?? defaultTag}</span>
              <span>{formatTradeTimestamp(trade.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenTradeModal}
        className={`${primaryButtonClass} mt-4 w-full rounded-xl px-4 py-2.5 text-sm`}
      >
        Add Trade
      </button>
    </aside>
  )
}

export default RecentTradesPanel
