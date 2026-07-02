import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { appointmentService } from '../services/appointmentService'
import AppointmentCard from '../components/appointments/AppointmentCard'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => { loadAppointments() }, [filter])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const status = filter === 'all' ? undefined : filter
      const response = await appointmentService.getUserAppointments({ status })
      setAppointments(response.data)
    } catch {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      await appointmentService.cancelAppointment(id, 'User cancelled')
      toast.success('Appointment cancelled')
      loadAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment')
    }
  }

  const handleReschedule = (appointment) => {
    navigate(`/appointments/book/${appointment.doctorId?._id || appointment.doctorId}`, {
      state: { rescheduleId: appointment._id },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : appointments.length === 0 ? (
        <DashCard className="p-10 text-center">
          <p className="text-gray-500 text-sm mb-3">No appointments found</p>
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="text-indigo-600 text-sm font-semibold hover:underline"
          >
            Find a doctor and book an appointment →
          </button>
        </DashCard>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt._id}
              appointment={apt}
              onCancel={handleCancel}
              onReschedule={handleReschedule}
            />
          ))}
        </div>
      )}
    </div>
  )
}
