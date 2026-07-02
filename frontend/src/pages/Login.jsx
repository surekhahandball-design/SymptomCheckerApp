import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authService.login({ email, password, rememberMe })
      login(response.user, response.accessToken, response.refreshToken)
      toast.success('Login successful!')
      navigate(response.user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Login failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm'

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
      <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} placeholder="••••••••" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
          <label htmlFor="rememberMe" className="ml-2 text-xs text-gray-500">Remember me</label>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-200">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-5 text-center">
        <Link to="/forgot-password" className="text-indigo-600 text-xs hover:underline">Forgot password?</Link>
      </div>
      <div className="mt-3 text-center">
        <p className="text-gray-500 text-xs">
          Don&apos;t have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
