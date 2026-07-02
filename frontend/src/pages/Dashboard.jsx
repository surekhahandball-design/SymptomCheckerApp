import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaClipboardList, FaCalendarCheck, FaLightbulb, FaStethoscope, FaUserMd, FaHistory } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
import { userService } from '../services/userService'
import { useAuthStore } from '../store/authStore'
import DashCard, { StatCard, QuickAction, PageSection, LoadingSpinner } from '../components/dashboard/DashCard'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await userService.getDashboard()
        setData(result)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-indigo-100 mb-5 max-w-lg">
            Analyze your symptoms instantly and get possible health insights with our intelligent symptom checker.
          </p>
          <Link
            to="/symptom-checker"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-50 transition shadow-lg"
          >
            <FaStethoscope />
            Start Symptom Check
            <HiArrowRight />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={FaClipboardList}
          label="Recent Checks"
          value={data?.recentSymptomChecks?.length || 0}
          trend="Symptom analyses"
        />
        <StatCard
          icon={FaCalendarCheck}
          label="Appointments"
          value={data?.upcomingAppointments?.length || 0}
          trend="Upcoming visits"
        />
        <StatCard
          icon={FaLightbulb}
          label="Health Tips"
          value={data?.healthTips?.length || 0}
          trend="Personalized tips"
        />
      </div>

      {/* Quick Actions */}
      <PageSection title="Quick Actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickAction icon={FaStethoscope} title="Check Symptoms" description="Analyze your symptoms now" to="/symptom-checker" />
          <QuickAction icon={FaUserMd} title="Find Doctors" description="Browse verified specialists" to="/doctors" color="bg-emerald-500" />
          <QuickAction icon={FaHistory} title="Health History" description="View past symptom checks" to="/history" color="bg-amber-500" />
          <QuickAction icon={FaCalendarCheck} title="Appointments" description="Manage your bookings" to="/appointments" color="bg-violet-500" />
        </div>
      </PageSection>

      {/* Recent Checks */}
      <PageSection title="Recent Symptom Checks">
        {data?.recentSymptomChecks?.length > 0 ? (
          <div className="space-y-3">
            {data.recentSymptomChecks.map((check) => (
              <DashCard key={check._id} className="p-4 hover:shadow-card-hover transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{check.selectedSymptoms.join(', ')}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(check.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {check.totalResults} results
                  </span>
                </div>
              </DashCard>
            ))}
          </div>
        ) : (
          <DashCard className="p-8 text-center">
            <p className="text-gray-500 text-sm">No checks yet. Start your first symptom check!</p>
            <Link to="/symptom-checker" className="inline-block mt-3 text-indigo-600 text-sm font-semibold hover:underline">
              Check Symptoms →
            </Link>
          </DashCard>
        )}
      </PageSection>

      {/* Health Tips */}
      <PageSection title="Health Tips">
        <div className="grid md:grid-cols-2 gap-4">
          {data?.healthTips?.map((tip) => (
            <DashCard key={tip._id} className="p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{tip.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{tip.description}</p>
              <span className="inline-block text-xs text-indigo-600 font-medium mt-2 bg-indigo-50 px-2 py-0.5 rounded-full">
                {tip.category}
              </span>
            </DashCard>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
