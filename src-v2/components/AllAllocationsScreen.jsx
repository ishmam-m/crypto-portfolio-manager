import { secondaryButtonClass, surfaceInsetClass, surfacePanelClass } from '../lib/uiTheme'

function AllAllocationsScreen({ allocations, compactMoney, money, onBackToDashboard }) {
  const totalValue = allocations.reduce((sum, holding) => sum + holding.value, 0)

  return (
    <section className={`${surfacePanelClass} p-5`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">All Allocations</h2>
          <p className="mt-1 text-sm text-slate-400">Complete portfolio allocation breakdown</p>
        </div>

        <button
          type="button"
          onClick={onBackToDashboard}
          className={`${secondaryButtonClass} px-3 py-2 text-sm font-medium`}
        >
          Back
        </button>
      </header>

      <div className="mt-4 space-y-3">
        <article className={`${surfaceInsetClass} grid p-4 text-sm sm:grid-cols-2`}>
          <div>
            <p className="text-slate-500">Portfolio Value</p>
            <p className="mt-1 text-base font-medium text-slate-100">{money.format(totalValue)}</p>
          </div>
          <div>
            <p className="text-slate-500">Total Assets</p>
            <p className="mt-1 text-base font-medium text-slate-100">{allocations.length}</p>
          </div>
        </article>

        {allocations.length === 0 ? (
          <article className="rounded-xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-center text-sm text-slate-400">
            No holdings yet. Add a buy trade to build allocations.
          </article>
        ) : (
          allocations.map((holding) => {
            const costBasis = holding.amount * holding.avgCost
            const pnl = holding.value - costBasis
            const pnlTextClass = pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'

            return (
              <article key={holding.asset} className={`${surfaceInsetClass} p-4`}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-medium text-slate-100">{holding.asset}</h3>
                  <p className="text-sm font-medium text-slate-200">{holding.percentage.toFixed(1)}%</p>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
                    style={{ width: `${Math.max(holding.percentage, 2)}%` }}
                  />
                </div>

                <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                  <p>
                    <span className="text-slate-500">Value:</span> {money.format(holding.value)}
                  </p>
                  <p>
                    <span className="text-slate-500">Amount:</span> {holding.amount}
                  </p>
                  <p>
                    <span className="text-slate-500">Current Price:</span>{' '}
                    {money.format(holding.currentPrice)}
                  </p>
                  <p>
                    <span className="text-slate-500">Avg Cost:</span> {money.format(holding.avgCost)}
                  </p>
                  <p>
                    <span className="text-slate-500">Cost Basis:</span> {money.format(costBasis)}
                  </p>
                  <p>
                    <span className="text-slate-500">Unrealized P/L:</span>{' '}
                    <span className={pnlTextClass}>{compactMoney.format(pnl)}</span>
                  </p>
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
