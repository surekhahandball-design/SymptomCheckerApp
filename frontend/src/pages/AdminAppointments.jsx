import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { appointmentService } from '../services/appointmentService'
import { doctorService } from '../services/doctorService'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'
import { formatDoctorName } from '../components/appointments/DoctorCard'

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [doctorFilter, setDoctorFilter] = useState('')

  useEffect(() => {
    loadDoctors()
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [filter, doctorFilter])

  const loadDoctors = async () => {
    try {
      const res = await doctorService.getAllDoctors({ limit: 50 })
      setDoctors(res.data)
    } catch { /* ignore */ }
  }

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      if (doctorFilter) params.doctorId = doctorFilter
      const response = await appointmentService.getAllAppointments(params)
      setAppointments(response.data)
    } catch {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status)
      toast.success(`Appointment ${status}`)
      loadAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <select
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
        >
          <option value="">All Doctors</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>{formatDoctorName(d.name)}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                filter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : appointments.length === 0 ? (
        <DashCard className="p-8 text-center text-gray-500 text-sm">No appointments found</DashCard>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <DashCard key={apt._id} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">
                      {formatDoctorName(apt.doctorId?.name)}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[apt.status]}`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Patient: {apt.patientName} · {apt.patientEmail} · {apt.patientPhone}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                  </p>
                  {apt.symptoms && <p className="text-xs text-gray-400 mt-1">Symptoms: {apt.symptoms}</p>}
                </div>

                {apt.status === 'pending' && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleStatus(apt._id, 'confirmed')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700">Accept</button>
                    <button type="button" onClick={() => handleStatus(apt._id, 'cancelled')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">Reject</button>
                  </div>
                )}
                {apt.status === 'confirmed' && (
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleStatus(apt._id, 'completed')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">Complete</button>
                    <button type="button" onClick={() => handleStatus(apt._id, 'cancelled')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">Cancel</button>
                  </div>
                )}
              </div>
            </DashCard>
          ))}
        </div>
      )}
    </div>
  )
}
