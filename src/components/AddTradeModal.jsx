function AddTradeModal({
  isOpen,
  formData,
  tagOptions,
  onClose,
  onInputChange,
  onSubmit,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-trade-title"
        className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-trade-title" className="text-center text-2xl font-semibold text-white">
          Add Trade
        </h2>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block space-y-1.5">
            <span className="text-sm text-slate-300">Asset</span>
            <input
              name="asset"
              type="text"
              value={formData.asset}
              onChange={onInputChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm text-slate-300">Amount</span>
              <input
                name="amount"
                type="number"
                step="any"
                min="0"
                value={formData.amount}
                onChange={onInputChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                required
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm text-slate-300">Price</span>
              <input
                name="price"
                type="number"
                step="any"
                min="0"
                value={formData.price}
                onChange={onInputChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm text-slate-300">Order</span>
              <select
                name="order"
                value={formData.order}
                onChange={onInputChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
              >
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm text-slate-300">Tag</span>
              <select
                name="tag"
                value={formData.tag}
                onChange={onInputChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
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
            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Confirm Trade
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AddTradeModal
