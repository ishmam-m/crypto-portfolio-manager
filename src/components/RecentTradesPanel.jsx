function RecentTradesPanel({
  trades,
  defaultTag,
  onOpenTradeModal,
  renderTradeLine,
  formatTradeTimestamp,
}) {
  return (
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
              <span>{trade.tag ?? defaultTag}</span>
              <span>{formatTradeTimestamp(trade.createdAt)}</span>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenTradeModal}
        className="mt-4 w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        Add Trade
      </button>
    </aside>
  )
}

export default RecentTradesPanel
