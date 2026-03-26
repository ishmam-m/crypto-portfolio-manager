import { modalInputClass, primaryButtonClass, secondaryButtonClass } from '../lib/uiTheme'
import TooltipIcon from './TooltipIcon'

function AddTradeModal({
  isOpen,
  formData,
  tagOptions,
  onClose,
  onInputChange,
  onSubmit,
  title = 'Add Trade',
  submitLabel = 'Confirm Trade',
}) {
  const assetTooltip = 'Ticker symbol for the coin or token, like BTC or ETH.'
  const amountTooltip = 'How many units you bought or sold.'
  const priceTooltip = 'Price per unit at the time of the trade.'
  const orderTooltip = 'Choose Buy when entering, Sell when exiting.'
  const tagTooltip = 'Optional strategy label to organize trades.'

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-trade-title"
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
      >
        <h2 id="add-trade-title" className="text-center text-2xl font-semibold text-white">
          {title}
        </h2>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="flex items-center gap-1 text-sm text-slate-300">
              <span>Asset</span>
              <TooltipIcon text={assetTooltip} label="Asset field help" />
            </span>
            <input
              name="asset"
              type="text"
              value={formData.asset}
              onChange={onInputChange}
              className={modalInputClass}
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="flex items-center gap-1 text-sm text-slate-300">
                <span>Amount</span>
                <TooltipIcon text={amountTooltip} label="Amount field help" />
              </span>
              <input
                name="amount"
                type="number"
                step="any"
                min="0"
                value={formData.amount}
                onChange={onInputChange}
                className={modalInputClass}
                required
              />
            </label>

            <label className="block space-y-1.5">
              <span className="flex items-center gap-1 text-sm text-slate-300">
                <span>Price</span>
                <TooltipIcon text={priceTooltip} label="Price field help" />
              </span>
              <input
                name="price"
                type="number"
                step="any"
                min="0"
                value={formData.price}
                onChange={onInputChange}
                className={modalInputClass}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="flex items-center gap-1 text-sm text-slate-300">
                <span>Order</span>
                <TooltipIcon text={orderTooltip} label="Order field help" />
              </span>
              <select
                name="order"
                value={formData.order}
                onChange={onInputChange}
                className={modalInputClass}
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="flex items-center gap-1 text-sm text-slate-300">
                <span>Tag</span>
                <TooltipIcon text={tagTooltip} label="Tag field help" />
              </span>
              <select
                name="tag"
                value={formData.tag}
                onChange={onInputChange}
                className={modalInputClass}
              >
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`${secondaryButtonClass} px-4 py-2.5 text-sm font-medium`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`${primaryButtonClass} px-4 py-2.5`}
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddTradeModal
