import { surfacePanelClass } from '../lib/uiTheme'

function AllocationPanel({ allocations, money }) {
  return (
    <section className={`${surfacePanelClass} p-5`}>
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
                className="h-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
                style={{ width: `${Math.max(holding.percentage, 2)}%` }}
              />
            </div>

            <p className="mt-1 text-xs text-slate-400">{money.format(holding.value)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AllocationPanel
