import { secondaryButtonClass, surfacePanelClass } from '../lib/uiTheme'

const ELEVATED_CONCENTRATION_THRESHOLD = 35
const CRITICAL_CONCENTRATION_THRESHOLD = 50

function AllAllocationsScreen({ allocations, compactMoney, money, onBackToDashboard }) {
  const totalValue = allocations.reduce((sum, holding) => sum + holding.value, 0)
  const topHolding = allocations[0] ?? null
  const topThreeShare = allocations.slice(0, 3).reduce((sum, holding) => sum + holding.percentage, 0)
  const elevatedHoldings = allocations.filter(
    (holding) => holding.percentage >= ELEVATED_CONCENTRATION_THRESHOLD,
  )
  const concentrationState = topHolding
    ? topHolding.percentage >= CRITICAL_CONCENTRATION_THRESHOLD
      ? 'Critical'
      : topHolding.percentage >= ELEVATED_CONCENTRATION_THRESHOLD
        ? 'Elevated'
        : 'Balanced'
    : 'Balanced'

  return (
    <section className={`${surfacePanelClass} p-5`}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">All Allocations</h2>
          <p className="mt-1 text-sm text-slate-300">Compare position size, contribution, and concentration risk.</p>
        </div>

        <button
          type="button"
          onClick={onBackToDashboard}
          className={`${secondaryButtonClass} px-3 py-2 text-sm font-medium`}
        >
          Back
        </button>
      </header>

      <div className="mt-5 space-y-3">
        <article className="grid gap-3 rounded-xl bg-slate-950/62 p-3.5 text-sm sm:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">Portfolio Value</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{compactMoney.format(totalValue)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">Total Assets</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{allocations.length}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">Top Holding</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">
              {topHolding ? `${topHolding.asset} (${topHolding.percentage.toFixed(1)}%)` : '-'}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-300">Top 3 Share</p>
            <p className="mt-1 text-sm font-semibold text-slate-100 tabular-nums">
              {topThreeShare.toFixed(1)}%
            </p>
          </div>
        </article>

        <article
          className={`rounded-xl px-3.5 py-2.5 text-sm ${
            concentrationState === 'Critical'
              ? 'bg-rose-500/16 text-rose-200'
              : concentrationState === 'Elevated'
                ? 'bg-amber-500/16 text-amber-200'
                : 'bg-emerald-500/16 text-emerald-200'
          }`}
        >
          <span className="font-semibold">Concentration {concentrationState}.</span>{' '}
          {elevatedHoldings.length === 0
            ? 'No oversized positions detected.'
            : `${elevatedHoldings.map((holding) => holding.asset).join(', ')} exceed ${ELEVATED_CONCENTRATION_THRESHOLD}% allocation.`}
        </article>

        {allocations.length === 0 ? (
          <article className="rounded-xl bg-slate-950/55 p-5 text-center text-sm text-slate-300">
            No holdings yet. Add a buy trade to build allocations.
          </article>
        ) : (
          allocations.map((holding, index) => {
            const costBasis = holding.amount * holding.avgCost
            const pnl = holding.value - costBasis
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0
            const pnlTextClass = pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'
            const isElevatedHolding = holding.percentage >= ELEVATED_CONCENTRATION_THRESHOLD

            return (
              <article key={holding.asset} className="rounded-xl bg-slate-950/62 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-100">
                    #{index + 1} {holding.asset}{' '}
                    <span className="font-medium text-slate-300">· {holding.percentage.toFixed(1)}%</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    {isElevatedHolding ? (
                      <span className="rounded-full bg-amber-500/18 px-2 py-0.5 text-[11px] font-semibold text-amber-200">
                        High concentration
                      </span>
                    ) : null}
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-100">
                      {money.format(holding.value)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-3">
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{ width: `${Math.max(holding.percentage, 2)}%` }}
                    />
                  </div>
                  <span className="text-right text-xs font-semibold tabular-nums text-slate-200">
                    {holding.percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-900/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-300">Value</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-100">{money.format(holding.value)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-300">Cost Basis</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-100">{money.format(costBasis)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/70 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-300">Unrealized P/L</p>
                    <p className={`mt-0.5 text-sm font-semibold ${pnlTextClass}`}>
                      {money.format(pnl)} ({pnlPercent >= 0 ? '+' : ''}
                      {pnlPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg bg-slate-900/50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-300">Amount</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-100 tabular-nums">{holding.amount}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-300">Avg Cost</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-100">{money.format(holding.avgCost)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-900/50 px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-slate-300">Current Price</p>
                    <p className="mt-0.5 text-sm font-medium text-slate-100">{money.format(holding.currentPrice)}</p>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}

export default AllAllocationsScreen
