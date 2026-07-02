import { HiOutlineMenuAlt3, HiOutlineSearch } from 'react-icons/hi'
import { useLocation } from 'react-router-dom'
import NotificationPanel from './NotificationPanel'

const pageTitles = {
  '/dashboard': 'Dashboard Overview',
  '/symptom-checker': 'Symptom Checker',
  '/doctors': 'Find Doctors',
  '/appointments': 'My Appointments',
  '/appointments/book': 'Book Appointment',
  '/history': 'Health History',
  '/profile': 'Profile & Settings',
  '/admin/dashboard': 'Admin Dashboard',
}

export default function TopHeader({ onMenuClick, title }) {
  const location = useLocation()
  const pageTitle = title || pageTitles[location.pathname]
    || (location.pathname.startsWith('/appointments/book') ? 'Book Appointment' : null)
    || 'SymptomChecker'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          aria-label="Open menu"
        >
          <HiOutlineMenuAlt3 className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 w-64">
          <HiOutlineSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
          />
        </div>
        <NotificationPanel />
      </div>
    </header>
  )
}
