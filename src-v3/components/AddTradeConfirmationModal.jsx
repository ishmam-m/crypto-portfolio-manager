import { createPortal } from 'react-dom'
import { primaryButtonClass } from '../lib/uiTheme'

function AddTradeConfirmationModal({
  trade,
  defaultTag,
  money,
  renderTradeLine,
  formatTradeTimestamp,
  onClose,
}) {
  if (!trade) {
    return null
  }

  const tradeValue =
    Number.isFinite(trade.amount) && Number.isFinite(trade.price) ? trade.amount * trade.price : null

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="trade-added-title"
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <h2 id="trade-added-title" className="text-xl font-semibold text-white">
          Trade Added
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Your trade was saved successfully and portfolio stats were updated.
        </p>

        <article className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm font-medium text-slate-100">{renderTradeLine(trade)}</p>
          <div className="mt-2 space-y-1 text-xs text-slate-400">
            <p>Tag: {trade.tag ?? defaultTag}</p>
            <p>Date: {formatTradeTimestamp(trade.createdAt)}</p>
            <p>Value: {tradeValue === null ? '-' : money.format(tradeValue)}</p>
          </div>
        </article>

        <div className="mt-5 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`${primaryButtonClass} px-4 py-2.5 text-sm`}
          >
            Done
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}

export default AddTradeConfirmationModal
