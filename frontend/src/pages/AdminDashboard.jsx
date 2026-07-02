import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaUsers, FaUserMd, FaNotesMedical, FaCalendarAlt } from 'react-icons/fa'
import { adminService } from '../services/adminService'
import DashCard, { StatCard, PageSection, LoadingSpinner } from '../components/dashboard/DashCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch {
        toast.error('Failed to load admin statistics')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FaUsers} label="Total Users" value={stats?.totalUsers || 0} />
        <StatCard icon={FaUserMd} label="Total Doctors" value={stats?.totalDoctors || 0} trendColor="text-emerald-500" />
        <StatCard icon={FaNotesMedical} label="Total Diseases" value={stats?.totalDiseases || 0} trendColor="text-cyan-500" />
        <StatCard icon={FaCalendarAlt} label="Appointments" value={stats?.totalAppointments || 0} trendColor="text-amber-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <PageSection title="Most Searched Symptoms">
          <DashCard className="p-5">
            {stats?.mostSearchedSymptoms?.length > 0 ? (
              <ul className="space-y-2">
                {stats.mostSearchedSymptoms.slice(0, 10).map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-700">{item._id}</span>
                    <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{item.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </DashCard>
        </PageSection>

        <PageSection title="Most Common Diseases">
          <DashCard className="p-5">
            {stats?.mostCommonDiseases?.length > 0 ? (
              <ul className="space-y-2">
                {stats.mostCommonDiseases.slice(0, 10).map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-700">{item._id}</span>
                    <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">{item.count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No data available</p>
            )}
          </DashCard>
        </PageSection>
      </div>

      <PageSection title="Recent Appointments">
        <DashCard className="p-5 overflow-x-auto">
          {stats?.recentAppointments?.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">User</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Doctor</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map((apt) => (
                  <tr key={apt._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 px-3 text-gray-700">{apt.userId?.fullName}</td>
                    <td className="py-2.5 px-3 text-gray-700">Dr. {apt.doctorId?.name}</td>
                    <td className="py-2.5 px-3 text-gray-500">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${
                        apt.status === 'confirmed' ? 'bg-emerald-500' :
                        apt.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No appointments</p>
          )}
        </DashCard>
      </PageSection>
    </div>
  )
}
