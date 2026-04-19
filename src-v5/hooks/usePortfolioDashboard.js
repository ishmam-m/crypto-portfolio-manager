import { useEffect, useMemo, useRef, useState } from 'react'
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

function getSellableAmountForAsset(holdings, asset) {
  const matchingHolding = holdings.find((holding) => holding.asset === asset)
  return matchingHolding?.amount ?? 0
}

function getOversellError(trade, holdingsSnapshot) {
  if (trade.order !== 'Sell') {
    return null
  }

  const available = getSellableAmountForAsset(holdingsSnapshot, trade.asset)
  if (trade.amount <= available) {
    return null
  }

  return `Sell amount exceeds current holdings. You can sell up to ${available} ${trade.asset}.`
}

const DELETE_UNDO_TIMEOUT_MS = 10_000

function usePortfolioDashboard() {
  const [trades, setTrades] = useState(loadTrades)
  const [holdings, setHoldings] = useState(loadHoldings)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(getInitialForm)
  const [editingTradeId, setEditingTradeId] = useState(null)
  const [recentlyAddedTrade, setRecentlyAddedTrade] = useState(null)
  const [formError, setFormError] = useState('')
  const [pendingDeletedTrade, setPendingDeletedTrade] = useState(null)
  const deleteUndoTimeoutRef = useRef(null)

  const portfolioStats = useMemo(() => calculatePortfolioStats(holdings), [holdings])
  const allocations = useMemo(() => calculateAllocations(holdings), [holdings])
  const sellableAmount = useMemo(() => {
    if (formData.order !== 'Sell') {
      return null
    }

    const asset = formData.asset.trim().toUpperCase()
    if (!asset) {
      return 0
    }

    if (!editingTradeId) {
      return getSellableAmountForAsset(holdings, asset)
    }

    const existingTrade = trades.find((entry) => entry.id === editingTradeId)
    if (!existingTrade) {
      return getSellableAmountForAsset(holdings, asset)
    }

    const holdingsWithoutExistingTrade = removeTradeFromHoldings(holdings, existingTrade)
    return getSellableAmountForAsset(holdingsWithoutExistingTrade, asset)
  }, [editingTradeId, formData.asset, formData.order, holdings, trades])

  useEffect(() => {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades))
  }, [trades])

  useEffect(() => {
    localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(holdings))
  }, [holdings])

  useEffect(() => {
    return () => {
      if (deleteUndoTimeoutRef.current) {
        clearTimeout(deleteUndoTimeoutRef.current)
      }
    }
  }, [])

  function clearDeleteUndoTimeout() {
    if (!deleteUndoTimeoutRef.current) {
      return
    }

    clearTimeout(deleteUndoTimeoutRef.current)
    deleteUndoTimeoutRef.current = null
  }

  function openTradeModal() {
    setRecentlyAddedTrade(null)
    setFormData(getInitialForm())
    setEditingTradeId(null)
    setFormError('')
    setIsModalOpen(true)
  }

  function closeTradeModal() {
    setIsModalOpen(false)
    setEditingTradeId(null)
    setFormError('')
  }

  function onInputChange(event) {
    const { name, value } = event.target
    setFormError('')
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
    setFormError('')
    setIsModalOpen(true)
  }

  function closeTradeConfirmationModal() {
    setRecentlyAddedTrade(null)
  }

  function deleteTrade(tradeId) {
    const tradeIndex = trades.findIndex((entry) => entry.id === tradeId)
    const trade = tradeIndex === -1 ? null : trades[tradeIndex]

    if (!trade) {
      return
    }

    clearDeleteUndoTimeout()
    setPendingDeletedTrade({ trade, index: tradeIndex })
    deleteUndoTimeoutRef.current = window.setTimeout(() => {
      setPendingDeletedTrade(null)
      deleteUndoTimeoutRef.current = null
    }, DELETE_UNDO_TIMEOUT_MS)

    setTrades((current) => current.filter((entry) => entry.id !== tradeId))
    setHoldings((current) => removeTradeFromHoldings(current, trade))

    if (editingTradeId === tradeId) {
      closeTradeModal()
    }
  }

  function undoDeleteTrade() {
    if (!pendingDeletedTrade) {
      return
    }

    clearDeleteUndoTimeout()

    const { trade, index } = pendingDeletedTrade
    setTrades((current) => {
      const nextTrades = [...current]
      const safeIndex = Math.max(0, Math.min(index, nextTrades.length))
      nextTrades.splice(safeIndex, 0, trade)
      return nextTrades
    })
    setHoldings((current) => applyTradeToHoldings(current, trade))
    setPendingDeletedTrade(null)
  }

  function dismissDeleteUndo() {
    clearDeleteUndoTimeout()
    setPendingDeletedTrade(null)
  }

  function handleAddTrade(event) {
    event.preventDefault()
    setFormError('')

    const tradeDraft = createTradeFromForm(formData)

    if (!tradeDraft) {
      setFormError('Enter a valid asset, amount, and price greater than 0.')
      return
    }

    if (editingTradeId) {
      const existingTrade = trades.find((entry) => entry.id === editingTradeId)

      if (!existingTrade) {
        return
      }

      const holdingsWithoutExistingTrade = removeTradeFromHoldings(holdings, existingTrade)
      const oversellError = getOversellError(tradeDraft, holdingsWithoutExistingTrade)
      if (oversellError) {
        setFormError(oversellError)
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

    const oversellError = getOversellError(tradeDraft, holdings)
    if (oversellError) {
      setFormError(oversellError)
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
    formError,
    formData,
    formatTradeTimestamp,
    handleAddTrade,
    isEditMode: Boolean(editingTradeId),
    isModalOpen,
    pendingDeletedTrade,
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
    sellableAmount,
    undoDeleteTrade,
    dismissDeleteUndo,
  }
}

export default usePortfolioDashboard
