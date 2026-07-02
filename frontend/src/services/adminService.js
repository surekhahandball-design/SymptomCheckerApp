import api from './api'

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard')
    return response.data.data
  },

  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params })
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  // Health tips
  getAllHealthTips: async () => {
    const response = await api.get('/admin/health-tips')
    return response.data.data
  },

  createHealthTip: async (data) => {
    const response = await api.post('/admin/health-tips', data)
    return response.data.data
  },

  updateHealthTip: async (id, data) => {
    const response = await api.put(`/admin/health-tips/${id}`, data)
    return response.data.data
  },

  deleteHealthTip: async (id) => {
    const response = await api.delete(`/admin/health-tips/${id}`)
    return response.data
  },
}
