import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { historyService } from '../services/historyService'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => { loadHistory() }, [page])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await historyService.getSymptomHistory({ page, limit: 10 })
      setHistory(response.data)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      try {
        await historyService.deleteHistoryRecord(id)
        toast.success('Record deleted')
        loadHistory()
      } catch {
        toast.error('Failed to delete record')
      }
    }
  }

  const handleDeleteAll = async () => {
    if (window.confirm('Delete all history? This cannot be undone.')) {
      try {
        await historyService.deleteAllHistory()
        toast.success('All history deleted')
        loadHistory()
      } catch {
        toast.error('Failed to delete history')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">Track all your past symptom analyses</p>
        <button onClick={handleDeleteAll} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition">
          Delete All
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : history.length === 0 ? (
        <DashCard className="p-8 text-center">
          <p className="text-gray-500 text-sm">No history found</p>
        </DashCard>
      ) : (
        <>
          <div className="space-y-3">
            {history.map((record) => (
              <DashCard key={record._id} className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-400">{new Date(record.createdAt).toLocaleString()}</p>
                    <p className="font-semibold text-gray-800 text-sm mt-1">{record.selectedSymptoms.join(', ')}</p>
                  </div>
                  <button onClick={() => handleDelete(record._id)} className="text-red-500 hover:text-red-700 text-xs font-medium transition">
                    Delete
                  </button>
                </div>
                {record.textInput && <p className="text-gray-500 text-xs mb-3">{record.textInput}</p>}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">Results: {record.totalResults}</p>
                  {record.results?.slice(0, 3).map((result, idx) => (
                    <div key={idx} className="flex justify-between text-xs p-2 bg-gray-50 rounded-lg mb-1">
                      <span className="text-gray-700">{result.diseaseName}</span>
                      <span className="font-semibold text-indigo-600">{result.probability}%</span>
                    </div>
                  ))}
                </div>
              </DashCard>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition">Previous</button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
            <button onClick={() => setPage(page + 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-white transition">Next</button>
          </div>
        </>
      )}
    </div>
  )
}
