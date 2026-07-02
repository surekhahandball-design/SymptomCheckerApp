import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineBell, HiOutlineCheck } from 'react-icons/hi'
import { FaStethoscope, FaCalendarCheck, FaHeartbeat, FaInfoCircle } from 'react-icons/fa'
import { notificationService } from '../../services/notificationService'

const typeIcons = {
  success: FaHeartbeat,
  health: FaStethoscope,
  appointment: FaCalendarCheck,
  warning: FaInfoCircle,
  info: FaInfoCircle,
}

const typeColors = {
  success: 'bg-emerald-100 text-emerald-600',
  health: 'bg-indigo-100 text-indigo-600',
  appointment: 'bg-violet-100 text-violet-600',
  warning: 'bg-amber-100 text-amber-600',
  info: 'bg-blue-100 text-blue-600',
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef(null)
  const navigate = useNavigate()

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await notificationService.getNotifications()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch {
      // silently fail — user may not be logged in
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleToggle = () => {
    setOpen((prev) => !prev)
    if (!open) fetchNotifications()
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const data = await notificationService.markAsRead(notification._id)
        setUnreadCount(data.unreadCount)
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        )
      } catch { /* ignore */ }
    }
    setOpen(false)
    if (notification.link) navigate(notification.link)
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch { /* ignore */ }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={`relative p-2 rounded-lg transition ${
          open ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
        }`}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <HiOutlineBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
              >
                <HiOutlineCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">No notifications yet</div>
            ) : (
              notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || FaInfoCircle
                const colorClass = typeColors[notification.type] || typeColors.info

                return (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left flex gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 ${
                      !notification.isRead ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-gray-800' : 'font-medium text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
