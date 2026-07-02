import { Link } from 'react-router-dom'

export default function DashCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-card ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, trend, trendColor = 'text-emerald-500' }) {
  return (
    <DashCard className="p-5 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {trend && <p className={`text-xs mt-1 font-medium ${trendColor}`}>{trend}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Icon className="text-lg" />
          </div>
        )}
      </div>
    </DashCard>
  )
}

export function QuickAction({ icon: Icon, title, description, to, color = 'bg-indigo-500' }) {
  return (
    <Link
      to={to}
      className="block bg-white rounded-xl border border-gray-100 shadow-card p-5 hover:shadow-card-hover transition-all hover:-translate-y-0.5 group"
    >
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
        <Icon className="text-white text-lg" />
      </div>
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{description}</p>
    </Link>
  )
}

export function PageSection({ title, children, action }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  )
}
