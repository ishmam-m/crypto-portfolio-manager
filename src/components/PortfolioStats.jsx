import { surfacePanelClass } from '../lib/uiTheme'

function PortfolioStats({ portfolioStats, compactMoney, money }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <article className={`${surfacePanelClass} p-4`}>
        <p className="text-xs uppercase tracking-widest text-slate-400">Portfolio Value</p>
        <p className="mt-2 text-2xl font-semibold text-white">{compactMoney.format(portfolioStats.value)}</p>
      </article>

      <article className={`${surfacePanelClass} p-4`}>
        <p className="text-xs uppercase tracking-widest text-slate-400">Cost Basis</p>
        <p className="mt-2 text-2xl font-semibold text-white">{compactMoney.format(portfolioStats.costBasis)}</p>
      </article>

      <article className={`${surfacePanelClass} p-4`}>
        <p className="text-xs uppercase tracking-widest text-slate-400">Net P/L</p>
        <p className={`mt-2 text-2xl font-semibold ${portfolioStats.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
          {money.format(portfolioStats.pnl)}
        </p>
        <p className={`mt-1 text-sm ${portfolioStats.pnl >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
          {portfolioStats.pnlPercent >= 0 ? '+' : ''}
          {portfolioStats.pnlPercent.toFixed(2)}%
        </p>
      </article>
    </div>
  )
}

export default PortfolioStats
