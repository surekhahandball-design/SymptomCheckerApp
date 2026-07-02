import { useNavigate } from 'react-router-dom'
import { FaUserMd, FaCalendarAlt, FaClock, FaHospital } from 'react-icons/fa'
import DashCard from '../dashboard/DashCard'
import { formatDoctorName } from './DoctorCard'

const statusColors = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-indigo-100 text-indigo-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AppointmentCard({ appointment, onCancel, onReschedule }) {
  const navigate = useNavigate()
  const doctor = appointment.doctorId
  const displayName = doctor ? formatDoctorName(doctor.name) : 'Unknown Doctor'
  const canModify = ['pending', 'confirmed'].includes(appointment.status)

  return (
    <DashCard className="p-5">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {doctor?.profilePicture ? (
            <img src={doctor.profilePicture} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <FaUserMd className="text-indigo-600 text-2xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{displayName}</h3>
              <p className="text-indigo-600 text-sm">{doctor?.specialization}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusColors[appointment.status]}`}>
              {appointment.status.toUpperCase()}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FaCalendarAlt className="text-gray-400 text-xs" />
              <span>{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="text-gray-400 text-xs" />
              <span>{appointment.appointmentTime}</span>
            </div>
            {doctor?.clinicAddress && (
              <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                <FaHospital className="text-gray-400 text-xs flex-shrink-0" />
                <span className="truncate text-xs">{doctor.clinicAddress}</span>
              </div>
            )}
          </div>

          {appointment.symptoms && (
            <div className="mb-3">
              <p className="text-xs text-gray-400">Symptoms</p>
              <p className="text-sm text-gray-700">{appointment.symptoms}</p>
            </div>
          )}

          {appointment.notes && (
            <div className="mb-3">
              <p className="text-xs text-gray-400">Notes</p>
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}

          {canModify && (
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                type="button"
                onClick={() => onReschedule(appointment)}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
              >
                Reschedule
              </button>
              <button
                type="button"
                onClick={() => onCancel(appointment._id)}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => navigate(`/appointments/book/${doctor?._id}`)}
                className="text-gray-500 text-sm hover:text-indigo-600 transition"
              >
                Book Again
              </button>
            </div>
          )}
        </div>
      </div>
    </DashCard>
  )
}
