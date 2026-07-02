import { Link } from 'react-router-dom'
import { FaUserMd, FaStar } from 'react-icons/fa'
import DashCard from '../dashboard/DashCard'

export function formatDoctorName(name = '') {
  return name.trim().toLowerCase().startsWith('dr.') ? name : `Dr. ${name}`
}

export default function DoctorCard({ doctor }) {
  const displayName = formatDoctorName(doctor.name)

  return (
    <DashCard className="p-5 hover:shadow-card-hover transition flex flex-col h-full">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {doctor.profilePicture ? (
            <img src={doctor.profilePicture} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <FaUserMd className="text-indigo-600 text-xl" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{displayName}</h3>
          <p className="text-indigo-600 text-sm font-medium">{doctor.specialization}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">{doctor.experience} years experience · {doctor.city}</p>

      <div className="flex items-center gap-1 mt-2">
        <FaStar className="text-amber-500 text-xs" />
        <span className="font-semibold text-sm">{doctor.rating?.toFixed(1)}</span>
        <span className="text-gray-400 text-xs">({doctor.totalReviews} reviews)</span>
      </div>

      <p className="text-sm font-semibold text-gray-700 mt-3">₹{doctor.consultationFee} consultation</p>

      {doctor.clinicAddress && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{doctor.clinicAddress}</p>
      )}

      <Link
        to={`/appointments/book/${doctor._id}`}
        className="block w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition text-center mt-auto pt-4"
      >
        Book Appointment
      </Link>
    </DashCard>
  )
}
