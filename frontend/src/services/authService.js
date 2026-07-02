import api from './api'

export const authService = {
  register: async (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }

    console.log('[AUTH SERVICE] Register payload:', { ...payload, password: '***', confirmPassword: '***' })
    const response = await api.post('/auth/register', payload)
    return response.data.data
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data.data
  },

  logout: async (refreshToken) => {
    await api.post('/auth/logout', { refreshToken })
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (data) => {
    const response = await api.post('/auth/reset-password', data)
    return response.data
  },

  adminLogin: async (credentials) => {
    const response = await api.post('/auth/admin/login', credentials)
    return response.data.data
  },
}
