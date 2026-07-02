import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUserMd, FaStar, FaHospital, FaBriefcase, FaRupeeSign } from 'react-icons/fa'
import { doctorService } from '../services/doctorService'
import { appointmentService } from '../services/appointmentService'
import { userService } from '../services/userService'
import { useAuthStore } from '../store/authStore'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'
import { formatDoctorName } from '../components/appointments/DoctorCard'

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
]

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const rescheduleId = location.state?.rescheduleId
  const { user } = useAuthStore()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    appointmentDate: '',
    timeSlot: '',
    symptoms: '',
    notes: '',
    consultationType: 'in-person',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [doctorData, profile] = await Promise.all([
          doctorService.getDoctorById(doctorId),
          userService.getProfile().catch(() => null),
        ])
        setDoctor(doctorData)
        setForm((prev) => ({
          ...prev,
          patientName: profile?.fullName || user?.fullName || '',
          patientEmail: profile?.email || user?.email || '',
          patientPhone: profile?.mobileNumber || user?.mobileNumber || '',
        }))

        if (rescheduleId) {
          const apt = await appointmentService.getAppointmentById(rescheduleId)
          setForm((prev) => ({
            ...prev,
            appointmentDate: new Date(apt.appointmentDate).toISOString().split('T')[0],
            timeSlot: apt.appointmentTime,
            symptoms: apt.symptoms || '',
            notes: apt.notes || '',
            consultationType: apt.consultationType || 'in-person',
          }))
        }
      } catch {
        toast.error('Failed to load doctor details')
        navigate('/doctors')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [doctorId, rescheduleId, navigate, user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (!form.patientName.trim()) return 'Patient name is required'
    if (!form.patientEmail.trim()) return 'Email is required'
    if (!form.patientPhone.trim()) return 'Phone is required'
    if (!form.appointmentDate) return 'Appointment date is required'
    if (!form.timeSlot) return 'Please select a time slot'
    if (!form.symptoms.trim()) return 'Please describe your symptoms'

    const selected = new Date(form.appointmentDate)
    selected.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selected < today) return 'Cannot book appointments in the past'

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        doctorId,
        patientName: form.patientName.trim(),
        patientEmail: form.patientEmail.trim(),
        patientPhone: form.patientPhone.trim(),
        appointmentDate: form.appointmentDate,
        timeSlot: form.timeSlot,
        appointmentTime: form.timeSlot,
        symptoms: form.symptoms.trim(),
        notes: form.notes.trim(),
        consultationType: form.consultationType,
      }

      if (rescheduleId) {
        await appointmentService.rescheduleAppointment(rescheduleId, payload)
        toast.success('Appointment rescheduled successfully!')
      } else {
        await appointmentService.bookAppointment(payload)
        toast.success('Appointment booked successfully!')
      }
      navigate('/appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!doctor) return null

  const displayName = formatDoctorName(doctor.name)
  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm'
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/doctors" className="text-sm text-indigo-600 hover:underline">← Back to Doctors</Link>

      {/* Doctor Info */}
      <DashCard className="p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {doctor.profilePicture ? (
              <img src={doctor.profilePicture} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <FaUserMd className="text-indigo-600 text-4xl" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{displayName}</h2>
            <p className="text-indigo-600 font-medium">{doctor.specialization}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <FaBriefcase className="text-gray-400" /> {doctor.experience} years
              </span>
              <span className="flex items-center gap-1.5">
                <FaRupeeSign className="text-gray-400" /> ₹{doctor.consultationFee}
              </span>
              <span className="flex items-center gap-1.5">
                <FaStar className="text-amber-500" /> {doctor.rating?.toFixed(1)} ({doctor.totalReviews})
              </span>
            </div>
            {doctor.clinicAddress && (
              <p className="flex items-start gap-1.5 mt-2 text-sm text-gray-500">
                <FaHospital className="text-gray-400 mt-0.5 flex-shrink-0" />
                {doctor.clinicAddress}, {doctor.city}
              </p>
            )}
          </div>
        </div>
      </DashCard>

      {/* Booking Form */}
      <DashCard className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {rescheduleId ? 'Reschedule Appointment' : 'Book Appointment'}
        </h3>
        <p className="text-gray-500 text-sm mb-6">Fill in your details to confirm the appointment</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Patient Name *</label>
              <input type="text" name="patientName" value={form.patientName} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
              <input type="email" name="patientEmail" value={form.patientEmail} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
              <input type="tel" name="patientPhone" value={form.patientPhone} onChange={handleChange} required pattern="\d{10}" maxLength={10} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Consultation Type</label>
              <select name="consultationType" value={form.consultationType} onChange={handleChange} className={inputClass}>
                <option value="in-person">In-Person</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Appointment Date *</label>
              <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} min={todayStr} required className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Available Time Slot *</label>
              <select name="timeSlot" value={form.timeSlot} onChange={handleChange} required className={inputClass}>
                <option value="">Select a time slot</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Symptoms *</label>
            <textarea name="symptoms" value={form.symptoms} onChange={handleChange} required rows={3} placeholder="Describe your symptoms..." className={inputClass} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Additional Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Any additional information for the doctor..." className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-200"
          >
            {submitting ? 'Processing...' : rescheduleId ? 'Confirm Reschedule' : 'Confirm Appointment'}
          </button>
        </form>
      </DashCard>
    </div>
  )
}
