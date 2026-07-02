import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { doctorService } from '../services/doctorService'
import DoctorCard from '../components/appointments/DoctorCard'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'

export default function DoctorList() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ specialization: '', city: '', rating: '' })
  const [page, setPage] = useState(1)

  useEffect(() => { loadDoctors() }, [filters, page])

  const loadDoctors = async () => {
    setLoading(true)
    try {
      const response = await doctorService.getAllDoctors({ ...filters, page, limit: 12 })
      setDoctors(response.data)
    } catch {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm'

  return (
    <div className="space-y-6">
      <DashCard className="p-5">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">Filter Doctors</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input type="text" placeholder="Specialization" value={filters.specialization} onChange={(e) => { setFilters({ ...filters, specialization: e.target.value }); setPage(1) }} className={inputClass} />
          <input type="text" placeholder="City" value={filters.city} onChange={(e) => { setFilters({ ...filters, city: e.target.value }); setPage(1) }} className={inputClass} />
          <select value={filters.rating} onChange={(e) => { setFilters({ ...filters, rating: e.target.value }); setPage(1) }} className={inputClass}>
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>
      </DashCard>

      {loading ? (
        <LoadingSpinner />
      ) : doctors.length === 0 ? (
        <DashCard className="p-8 text-center text-gray-500 text-sm">No doctors found</DashCard>
      ) : (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
            <button type="button" onClick={() => setPage(page + 1)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">Next</button>
          </div>
        </>
      )}
    </div>
  )
}
