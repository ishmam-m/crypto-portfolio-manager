import { primaryButtonClass, surfacePanelClass } from '../lib/uiTheme'

function AllocationPanel({ allocations, money, onOpenAllocationsScreen }) {
  return (
    <section className={`${surfacePanelClass} p-5`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-lg font-medium text-white`}>Allocation</h2>
        <span className="text-xs tracking-wider text-slate-400">TOP 4 HOLDINGS</span>
      </div>

      <div className="mt-4 space-y-4">
        {allocations.length === 0 ? (
          <article className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-4 text-sm text-slate-400">
            No allocations yet.
          </article>
        ) : (
          allocations.slice(0, 4).map((holding) => (
            <article key={holding.asset}>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                <span>{holding.asset}</span>
                <span>{holding.percentage.toFixed(1)}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
                  style={{ width: `${Math.max(holding.percentage, 2)}%` }}
                />
              </div>

              <p className="mt-1 text-xs text-slate-400">{money.format(holding.value)}</p>
            </article>
          ))
        )}
      </div>

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
