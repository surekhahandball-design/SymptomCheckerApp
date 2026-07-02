import api from './api'

export const diseaseService = {
  getAllDiseases: async (params) => {
    const response = await api.get('/diseases', { params })
    return response.data
  },

  getDiseaseById: async (id) => {
    const response = await api.get(`/diseases/${id}`)
    return response.data.data
  },

  searchDiseases: async (query) => {
    const response = await api.get('/diseases/search', { params: { query } })
    return response.data.data
  },

  // Admin routes
  createDisease: async (data) => {
    const response = await api.post('/diseases', data)
    return response.data.data
  },

  updateDisease: async (id, data) => {
    const response = await api.put(`/diseases/${id}`, data)
    return response.data.data
  },

  deleteDisease: async (id) => {
    const response = await api.delete(`/diseases/${id}`)
    return response.data
  },
}
