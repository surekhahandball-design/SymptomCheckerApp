import { Link } from 'react-router-dom'
import { FaStethoscope, FaUserMd, FaHistory, FaBookMedical } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'

const quickLinks = [
  { to: '/symptom-checker', label: 'Check Symptoms', icon: FaStethoscope, color: 'bg-indigo-500' },
  { to: '/doctors', label: 'Find Doctors', icon: FaUserMd, color: 'bg-emerald-500' },
  { to: '/history', label: 'View History', icon: FaHistory, color: 'bg-amber-500' },
  { to: '/appointments', label: 'Appointments', icon: FaBookMedical, color: 'bg-violet-500' },
]

const promotions = [
  {
    title: 'Free Health Check',
    desc: 'Complete your first symptom analysis today.',
    color: 'from-indigo-500 to-indigo-600',
    to: '/symptom-checker',
    cta: 'Start Now',
  },
  {
    title: 'Book a Doctor',
    desc: 'Connect with verified specialists near you.',
    color: 'from-emerald-500 to-emerald-600',
    to: '/doctors',
    cta: 'Browse',
  },
  {
    title: 'Health Tips',
    desc: 'Personalized wellness recommendations.',
    color: 'from-violet-500 to-violet-600',
    to: '/dashboard',
    cta: 'View Tips',
  },
]

export default function RightPanel() {
  return (
    <aside className="hidden xl:block w-72 flex-shrink-0 border-l border-gray-200 bg-white p-5 space-y-6 overflow-y-auto">
      {/* Quick Links */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
          <HiLightningBolt className="text-amber-500" />
          Quick Links
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition bg-gray-50 hover:bg-white text-center"
            >
              <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="text-white text-sm" />
              </div>
              <span className="text-[11px] font-medium text-gray-600 leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Health Promotions</h3>
        <div className="space-y-3">
          {promotions.map((promo) => (
            <div
              key={promo.title}
              className={`bg-gradient-to-r ${promo.color} rounded-xl p-4 text-white`}
            >
              <h4 className="font-semibold text-sm mb-1">{promo.title}</h4>
              <p className="text-xs text-white/80 mb-3">{promo.desc}</p>
              <Link
                to={promo.to}
                className="inline-block text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition"
              >
                {promo.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
