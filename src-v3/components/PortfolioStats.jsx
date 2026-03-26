import { surfacePanelClass } from '../lib/uiTheme'
import TooltipIcon from './TooltipIcon'

function PortfolioStats({ portfolioStats, compactMoney, money }) {
  const portfolioValueTooltip =
    'Portfolio Value is the current market value of all your holdings combined based on the latest tracked prices.'
  const costBasisTooltip =
    'Cost Basis is the total amount you originally paid for your current holdings, including all buy trades.'
  const netPnlTooltip =
    'Net P/L (profit/loss) is Portfolio Value minus Cost Basis. Positive means profit, negative means loss.'

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <article className={`${surfacePanelClass} p-4`}>
        <p className="flex items-center gap-1 text-xs uppercase tracking-widest text-slate-400">
          <span>Portfolio Value</span>
          <TooltipIcon text={portfolioValueTooltip} label="Portfolio Value explanation" />
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">{compactMoney.format(portfolioStats.value)}</p>
      </article>

      <article className={`${surfacePanelClass} p-4`}>
        <p className="flex items-center gap-1 text-xs uppercase tracking-widest text-slate-400">
          <span>Cost Basis</span>
          <TooltipIcon text={costBasisTooltip} label="Cost Basis explanation" />
        </p>
        <p className="mt-2 text-2xl font-semibold text-white">{compactMoney.format(portfolioStats.costBasis)}</p>
      </article>

      <article className={`${surfacePanelClass} p-4`}>
        <p className="flex items-center gap-1 text-xs uppercase tracking-widest text-slate-400">
          <span>Net P/L</span>
          <TooltipIcon text={netPnlTooltip} label="Net P/L explanation" />
        </p>
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
