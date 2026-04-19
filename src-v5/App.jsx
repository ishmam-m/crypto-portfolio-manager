import AddTradeModal from './components/AddTradeModal'
import AddTradeConfirmationModal from './components/AddTradeConfirmationModal'
import AllAllocationsScreen from './components/AllAllocationsScreen'
import AllTradesScreen from './components/AllTradesScreen'
import AllocationPanel from './components/AllocationPanel'
import DashboardHeader from './components/DashboardHeader'
import DeleteUndoToast from './components/DeleteUndoToast'
import PortfolioStats from './components/PortfolioStats'
import RecentTradesPanel from './components/RecentTradesPanel'
import usePortfolioDashboard from './hooks/usePortfolioDashboard'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  const {
    allocations,
    compactMoney,
    deleteTrade,
    defaultTag,
    editTrade,
    formError,
    formData,
    formatTradeTimestamp,
    handleAddTrade,
    isEditMode,
    isModalOpen,
    money,
    onInputChange,
    openTradeModal,
    portfolioStats,
    renderTradeLine,
    tagOptions,
    trades,
    closeTradeModal,
    closeTradeConfirmationModal,
    dismissDeleteUndo,
    pendingDeletedTrade,
    recentlyAddedTrade,
    sellableAmount,
    undoDeleteTrade,
  } = usePortfolioDashboard()

  function openTradesScreen() {
    navigate('/trades')
  }

  function openDashboardScreen() {
    navigate('/')
  }

  function openAllocationsScreen() {
    navigate('/allocations')
  }

  return (
    <main className="min-h-screen px-4 py-10 text-slate-100">
      <section
          className="
            mx-auto w-full max-w-480
            px-4 sm:px-6 lg:px-10
            rounded-3xl
            bg-slate-950/60
            p-6 lg:p-8
            ring-1 ring-white/10
            shadow-2xl backdrop-blur-sm
          "
      >
        <DashboardHeader />

        <Routes>
          <Route
            path="/"
            element={
              <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
                <section className="space-y-7">
                  <PortfolioStats
                    portfolioStats={portfolioStats}
                    compactMoney={compactMoney}
                    money={money}
                  />

                  <AllocationPanel
                    allocations={allocations}
                    money={money}
                    onOpenAllocationsScreen={openAllocationsScreen}
                  />
                </section>

                <RecentTradesPanel
                  trades={trades}
                  defaultTag={defaultTag}
                  onOpenTradeModal={openTradeModal}
                  onOpenTradesScreen={openTradesScreen}
                  renderTradeLine={renderTradeLine}
                  formatTradeTimestamp={formatTradeTimestamp}
                />
              </div>
            }
          />
          <Route
            path="/trades"
            element={
              <AllTradesScreen
                trades={trades}
                defaultTag={defaultTag}
                portfolioStats={portfolioStats}
                compactMoney={compactMoney}
                money={money}
                renderTradeLine={renderTradeLine}
                formatTradeTimestamp={formatTradeTimestamp}
                onBackToDashboard={openDashboardScreen}
                onOpenTradeModal={openTradeModal}
                onEditTrade={editTrade}
                onDeleteTrade={deleteTrade}
              />
            }
          />
          <Route
            path="/allocations"
            element={
              <AllAllocationsScreen
                allocations={allocations}
                compactMoney={compactMoney}
                money={money}
                onBackToDashboard={openDashboardScreen}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </section>

      <AddTradeModal
        isOpen={isModalOpen}
        formData={formData}
        tagOptions={tagOptions}
        onClose={closeTradeModal}
        onInputChange={onInputChange}
        onSubmit={handleAddTrade}
        title={isEditMode ? 'Edit Trade' : 'Add Trade'}
        submitLabel={isEditMode ? 'Save Changes' : 'Confirm Trade'}
        formError={formError}
        sellableAmount={sellableAmount}
      />

      <AddTradeConfirmationModal
        trade={recentlyAddedTrade}
        defaultTag={defaultTag}
        money={money}
        renderTradeLine={renderTradeLine}
        formatTradeTimestamp={formatTradeTimestamp}
        onClose={closeTradeConfirmationModal}
      />

      <DeleteUndoToast
        deletedTrade={pendingDeletedTrade?.trade ?? null}
        onUndo={undoDeleteTrade}
        onDismiss={dismissDeleteUndo}
        renderTradeLine={renderTradeLine}
      />
    </main>
  )
}

export default App
