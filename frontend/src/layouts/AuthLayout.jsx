import { Outlet, Link } from 'react-router-dom'
import { FaHeartbeat } from 'react-icons/fa'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-violet-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
            <FaHeartbeat className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">SymptomChecker</h1>
          <p className="text-indigo-200 leading-relaxed">
            Your intelligent health companion. Analyze symptoms, get disease insights, and connect with verified doctors — all in one secure platform.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { value: '10K+', label: 'Checks' },
              { value: '500+', label: 'Doctors' },
              { value: '99%', label: 'Secure' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-indigo-300 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth form panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-100 p-6 relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FaHeartbeat className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-800">SymptomChecker</span>
          </Link>
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
