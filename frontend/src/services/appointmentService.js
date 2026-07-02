import api from './api'

export const appointmentService = {
  bookAppointment: async (data) => {
    const response = await api.post('/appointments', data)
    return response.data
  },

  getUserAppointments: async (params) => {
    const response = await api.get('/appointments/user/appointments', { params })
    return response.data
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`)
    return response.data.data
  },

  updateAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data)
    return response.data
  },

  cancelAppointment: async (id, cancelReason) => {
    const response = await api.delete(`/appointments/${id}`, {
      data: { cancelReason },
    })
    return response.data
  },

  rescheduleAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}`, data)
    return response.data
  },

  getAllAppointments: async (params) => {
    const response = await api.get('/appointments', { params })
    return response.data
  },

  updateStatus: async (id, status, cancelReason) => {
    const response = await api.patch(`/appointments/${id}/status`, { status, cancelReason })
    return response.data
  },

  getDoctorAppointments: async (doctorId, params) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`, { params })
    return response.data
  },
}
