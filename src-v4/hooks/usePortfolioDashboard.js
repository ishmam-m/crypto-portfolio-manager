import { useEffect, useMemo, useState } from 'react'
import {
  HOLDINGS_STORAGE_KEY,
  INITIAL_FORM,
  TAG_OPTIONS,
  TRADES_STORAGE_KEY,
  applyTradeToHoldings,
  calculateAllocations,
  calculatePortfolioStats,
  compactMoneyFormatter,
  createTradeFromForm,
  formatTradeTimestamp,
  loadHoldings,
  loadTrades,
  moneyFormatter,
  removeTradeFromHoldings,
  renderTradeLine,
  tradeToFormData,
} from '../lib/portfolioLogic'

function getInitialForm() {
  return { ...INITIAL_FORM }
}

function usePortfolioDashboard() {
  const [trades, setTrades] = useState(loadTrades)
  const [holdings, setHoldings] = useState(loadHoldings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(getInitialForm)
  const [editingTradeId, setEditingTradeId] = useState(null)
  const [recentlyAddedTrade, setRecentlyAddedTrade] = useState(null)

  const portfolioStats = useMemo(() => calculatePortfolioStats(holdings), [holdings])
  const allocations = useMemo(() => calculateAllocations(holdings), [holdings])

  useEffect(() => {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades))
  }, [trades])

  useEffect(() => {
    localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(holdings))
  }, [holdings])

  function openTradeModal() {
    setRecentlyAddedTrade(null)
    setFormData(getInitialForm())
    setEditingTradeId(null)
    setIsModalOpen(true)
  }

  function closeTradeModal() {
    setIsModalOpen(false)
    setEditingTradeId(null)
  }

  function onInputChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function editTrade(tradeId) {
    const trade = trades.find((entry) => entry.id === tradeId)

    if (!trade) {
      return
    }

    setRecentlyAddedTrade(null)
    setFormData(tradeToFormData(trade))
    setEditingTradeId(trade.id)
    setIsModalOpen(true)
  }

  function closeTradeConfirmationModal() {
    setRecentlyAddedTrade(null)
  }

  function deleteTrade(tradeId) {
    const trade = trades.find((entry) => entry.id === tradeId)

    if (!trade) {
      return
    }

    setTrades((current) => current.filter((entry) => entry.id !== tradeId))
    setHoldings((current) => removeTradeFromHoldings(current, trade))

    if (editingTradeId === tradeId) {
      closeTradeModal()
    }
  }

  function handleAddTrade(event) {
    event.preventDefault()

    const tradeDraft = createTradeFromForm(formData)

    if (!tradeDraft) {
      return
    }

    if (editingTradeId) {
      const existingTrade = trades.find((entry) => entry.id === editingTradeId)

      if (!existingTrade) {
        return
      }

      const updatedTrade = {
        ...tradeDraft,
        id: existingTrade.id,
        createdAt: existingTrade.createdAt,
      }

      setTrades((current) =>
        current.map((entry) => (entry.id === editingTradeId ? updatedTrade : entry)),
      )
      setHoldings((current) => {
        const withoutExisting = removeTradeFromHoldings(current, existingTrade)
        return applyTradeToHoldings(withoutExisting, updatedTrade)
      })
      closeTradeModal()
      return
    }

    setTrades((current) => [tradeDraft, ...current])
    setHoldings((current) => applyTradeToHoldings(current, tradeDraft))
    closeTradeModal()
    setRecentlyAddedTrade(tradeDraft)
  }

  return {
    allocations,
    compactMoney: compactMoneyFormatter,
    deleteTrade,
    defaultTag: TAG_OPTIONS[0],
    editTrade,
    formData,
    formatTradeTimestamp,
    handleAddTrade,
    isEditMode: Boolean(editingTradeId),
    isModalOpen,
    recentlyAddedTrade,
    money: moneyFormatter,
    onInputChange,
    openTradeModal,
    portfolioStats,
    renderTradeLine,
    tagOptions: TAG_OPTIONS,
    trades,
    closeTradeModal,
    closeTradeConfirmationModal,
  }
}

export default usePortfolioDashboard
