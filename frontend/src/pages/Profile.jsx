import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { userService } from '../services/userService'
import { useAuthStore } from '../store/authStore'
import DashCard, { LoadingSpinner } from '../components/dashboard/DashCard'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [formData, setFormData] = useState({})
  const { setUser } = useAuthStore()

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile()
      setProfile(data)
      setFormData(data)
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const updated = await userService.updateProfile(formData)
      setProfile(updated)
      setUser(updated)
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await userService.changePassword(passwordForm)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password changed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  }

  if (loading) return <LoadingSpinner />

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm'

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <DashCard className="p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold text-gray-800">Profile Information</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!editing ? (
          <div className="space-y-4">
            {[
              ['Full Name', profile?.fullName],
              ['Email', profile?.email],
              ['Mobile Number', profile?.mobileNumber],
              ...(profile?.dateOfBirth ? [['Date of Birth', new Date(profile.dateOfBirth).toLocaleDateString()]] : []),
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-gray-400 text-xs">{label}</p>
                <p className="font-semibold text-gray-800 text-sm">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input type="text" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth</label>
              <input type="date" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select value={formData.gender || ''} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className={inputClass}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition">
              Save Changes
            </button>
          </form>
        )}
      </DashCard>

      <DashCard className="p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                {field === 'oldPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
              </label>
              <input
                type="password"
                value={passwordForm[field]}
                onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          ))}
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition">
            Change Password
          </button>
        </form>
      </DashCard>
    </div>
  )
}
