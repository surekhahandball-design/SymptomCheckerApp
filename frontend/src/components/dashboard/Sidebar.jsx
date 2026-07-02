import { NavLink, Link } from 'react-router-dom'
import {
  FaHeartbeat,
  FaTachometerAlt,
  FaStethoscope,
  FaUserMd,
  FaCalendarCheck,
  FaHistory,
  FaUserCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/symptom-checker', label: 'Check Symptoms', icon: FaStethoscope },
  { to: '/doctors', label: 'Find Doctors', icon: FaUserMd },
  { to: '/appointments', label: 'Appointments', icon: FaCalendarCheck },
  { to: '/history', label: 'Health History', icon: FaHistory },
  { to: '/profile', label: 'Profile & Settings', icon: FaUserCog },
]

const adminLinks = [
  { to: '/admin/dashboard', label: 'Admin Panel', icon: FaShieldAlt },
  { to: '/admin/appointments', label: 'Manage Appointments', icon: FaCalendarCheck },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const links = user?.role === 'admin' ? [...userLinks, ...adminLinks] : userLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/15 text-white shadow-sm'
        : 'text-indigo-200 hover:bg-white/10 hover:text-white'
    }`

  return (
    <aside
      className={`${
        collapsed ? 'w-[72px]' : 'w-64'
      } bg-sidebar flex flex-col flex-shrink-0 transition-all duration-300 min-h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaHeartbeat className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight truncate">SymptomChecker</p>
              <p className="text-indigo-300 text-[10px] uppercase tracking-wider">Health Portal</p>
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="text-indigo-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition hidden lg:block"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaChevronRight className="text-xs" /> : <FaChevronLeft className="text-xs" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navClass} title={collapsed ? label : undefined}>
            <Icon className="text-base flex-shrink-0 w-5 text-center" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
            <p className="text-indigo-300 text-xs truncate">{user.email}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-200 hover:bg-red-500/20 hover:text-red-300 transition"
          title="Logout"
        >
          <FaSignOutAlt className="flex-shrink-0 w-5 text-center" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
