import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.errors?.[0]?.msg) return error.response.data.errors[0].msg
  if (error.message === 'Network Error') return 'Cannot reach server. Make sure the backend is running on port 5000.'
  return error.message || 'Registration failed'
}

function validateForm(formData) {
  if (!formData.fullName.trim()) return 'Full name is required'
  if (formData.fullName.trim().length < 2) return 'Name must be at least 2 characters'
  if (!formData.mobileNumber.match(/^[0-9]{10}$/)) return 'Mobile number must be exactly 10 digits'
  if (!PASSWORD_REGEX.test(formData.password)) return 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
  if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
  return null
}

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', mobileNumber: '', password: '', confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validateForm(formData)
    if (validationError) { toast.error(validationError); return }

    setLoading(true)
    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobileNumber: formData.mobileNumber.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    }

    try {
      const response = await authService.register(payload)
      login(response.user, response.accessToken, response.refreshToken)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm'

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
      <p className="text-gray-500 text-sm mb-6">Join us to get started</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number (10 digits)</label>
          <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required pattern="\d{10}" maxLength={10} className={inputClass} placeholder="9876543210" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className={inputClass} placeholder="••••••••" />
          <p className="text-[10px] text-gray-400 mt-1">Min 8 chars, uppercase, lowercase, numbers</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className={inputClass} placeholder="••••••••" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-200">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-500 text-xs">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}
