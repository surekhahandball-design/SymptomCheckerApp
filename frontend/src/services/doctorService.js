import api from './api'

export const doctorService = {
  getAllDoctors: async (params) => {
    const response = await api.get('/doctors', { params })
    return response.data
  },

  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`)
    return response.data.data
  },

  searchDoctors: async (query) => {
    const response = await api.get('/doctors/search', { params: { query } })
    return response.data.data
  },

  // Admin routes
  createDoctor: async (data) => {
    const response = await api.post('/doctors', data)
    return response.data.data
  },

  updateDoctor: async (id, data) => {
    const response = await api.put(`/doctors/${id}`, data)
    return response.data.data
  },

  deleteDoctor: async (id) => {
    const response = await api.delete(`/doctors/${id}`)
    return response.data
  },
}
