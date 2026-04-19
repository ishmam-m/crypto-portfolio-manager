import { primaryButtonClass, surfacePanelClass } from '../lib/uiTheme'
import TooltipIcon from './TooltipIcon'

function AllocationPanel({ allocations, money, onOpenAllocationsScreen }) {
  const allocationTooltip =
    'Allocation shows how your portfolio is distributed across assets by percentage and value. View Allocations opens the full allocation breakdown for every holding.'
  const topHolding = allocations[0] ?? null
  const hasConcentrationWarning = topHolding && topHolding.percentage >= 35

  return (
    <section className={`${surfacePanelClass} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-1 text-lg font-medium text-white">
          <span>Allocation</span>
          <TooltipIcon text={allocationTooltip} label="Allocation explanation" />
        </h2>
        <span className="text-xs tracking-wider text-slate-300">TOP 4 HOLDINGS</span>
      </div>

      <div className="mt-4 space-y-3">
        {allocations.length === 0 ? (
          <article className="rounded-xl bg-slate-950/60 p-4 text-sm text-slate-300">
            No allocations yet.
          </article>
        ) : (
          allocations.slice(0, 4).map((holding) => (
            <article key={holding.asset} className="rounded-xl bg-slate-950/58 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-100">
                  {holding.asset}{' '}
                  <span className="font-medium text-slate-300">· {holding.percentage.toFixed(1)}%</span>
                </p>
                <p className="text-sm font-semibold tabular-nums text-slate-100">{money.format(holding.value)}</p>
              </div>

              <div className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-3">
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
            </article>
          ))
        )}
      </div>

      {hasConcentrationWarning ? (
        <p className="mt-4 rounded-lg bg-amber-400/15 px-3 py-2 text-xs font-medium text-amber-200">
          Concentration warning: {topHolding.asset} is {topHolding.percentage.toFixed(1)}% of portfolio value.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onOpenAllocationsScreen}
        className={`${primaryButtonClass} mt-4 w-full rounded-xl px-4 py-2.5 text-sm`}
      >
        View Allocations
      </button>
    </section>
  )
}

export default AllocationPanel
