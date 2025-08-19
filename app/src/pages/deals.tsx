import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DealForm from '../components/DealForm'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api'

const columns = {
  Lead: { name: 'Lead', items: [] },
  Analyzing: { name: 'Analyzing', items: [] },
  'Offer Made': { name: 'Offer Made', items: [] },
  'Under Contract': { name: 'Under Contract', items: [] },
  Closed: { name: 'Closed', items: [] },
  Lost: { name: 'Lost', items: [] },
}

function DealCard({ deal, index, onEdit }) {
  return (
    <Draggable key={deal.id} draggableId={String(deal.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-3 bg-white rounded-lg shadow ${
            snapshot.isDragging ? 'bg-slate-100' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{deal.address}</p>
              <p className="text-sm text-slate-600">{deal.city}, {deal.state}</p>
            </div>
            <button onClick={() => onEdit(deal)} className="text-sm text-blue-600 hover:underline">Edit</button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {deal.list_price
              ? `List: ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(deal.list_price)}`
              : 'Price not set'}
          </p>
        </div>
      )}
    </Draggable>
  )
}

export default function DealsPage() {
  const [dealColumns, setDealColumns] = useState(columns)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/deals`)
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const deals = await res.json()

      const newColumns = JSON.parse(JSON.stringify(columns))
      deals.forEach((deal) => {
        if (newColumns[deal.status]) {
          newColumns[deal.status].items.push(deal)
        }
      })
      setDealColumns(newColumns)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  const onDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination } = result
    const newColumns = { ...dealColumns }
    const sourceColumn = newColumns[source.droppableId]
    const destColumn = newColumns[destination.droppableId]
    const [removed] = sourceColumn.items.splice(source.index, 1)

    if (source.droppableId !== destination.droppableId) {
      destColumn.items.splice(destination.index, 0, removed)
      setDealColumns(newColumns)

      try {
        await fetch(`${API_BASE}/deals/${removed.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: destination.droppableId }),
        })
      } catch (err) {
        console.error('Failed to update deal status', err)
        // Revert state on error
        fetchDeals()
      }
    } else {
      sourceColumn.items.splice(destination.index, 0, removed)
      setDealColumns(newColumns)
    }
  }

  const handleOpenModal = (deal = null) => {
    setEditingDeal(deal)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditingDeal(null)
    setIsModalOpen(false)
  }

  const handleSaveDeal = () => {
    fetchDeals()
    handleCloseModal()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Deal Funnel</h1>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Deal
        </button>
      </div>

      {isModalOpen && (
        <DealForm
          deal={editingDeal}
          onSave={handleSaveDeal}
          onCancel={handleCloseModal}
        />
      )}

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="flex gap-4 overflow-x-auto">
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.entries(dealColumns).map(([columnId, column]) => (
              <div key={columnId} className="w-80 bg-slate-100 rounded-lg p-3">
                <h2 className="font-semibold mb-3">{column.name}</h2>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-96 ${
                        snapshot.isDraggingOver ? 'bg-slate-200' : ''
                      }`}
                    >
                      {column.items.map((item, index) => (
                        <DealCard key={item.id} deal={item} index={index} onEdit={handleOpenModal} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      )}
    </div>
  )
}