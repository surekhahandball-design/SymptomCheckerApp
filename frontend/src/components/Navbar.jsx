import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiOutlineMenuAlt3, HiX } from 'react-icons/hi'
import { FaHeartbeat } from 'react-icons/fa'
import { useAuthStore } from '../store/authStore'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Services', to: '/#services' },
  { label: 'Contact', to: '/#contact' },
]

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'text-primary border-b-2 border-primary pb-0.5'
      : 'text-gray-600 hover:text-primary'
  }`

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/login')
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-[4.5rem]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMenu}>
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl text-gray-800">
              Symptom<span className="text-primary">Checker</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={link.to === '/' ? linkClass : 'text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200'}
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/symptom-checker"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition"
                >
                  Check Symptoms
                </Link>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-primary transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-white bg-error px-5 py-2.5 rounded-full hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-primary border-2 border-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-primary px-5 py-2.5 rounded-full hover:bg-blue-700 shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600 hover:text-primary transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden pb-5 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={closeMenu}
                  className="text-gray-700 hover:text-primary hover:bg-blue-50 px-3 py-2.5 rounded-lg transition text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/symptom-checker" onClick={closeMenu} className="text-gray-700 hover:text-primary px-3 py-2.5 rounded-lg text-sm font-medium">
                      Check Symptoms
                    </Link>
                    <Link to="/dashboard" onClick={closeMenu} className="text-gray-700 hover:text-primary px-3 py-2.5 rounded-lg text-sm font-medium">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="text-left text-white bg-error px-4 py-2.5 rounded-full text-sm font-semibold">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="text-center text-primary border-2 border-primary px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMenu}
                      className="text-center text-white bg-primary px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
