import api from './api'

export const historyService = {
  getSymptomHistory: async (params) => {
    const response = await api.get('/history', { params })
    return response.data
  },

  getHistoryById: async (id) => {
    const response = await api.get(`/history/${id}`)
    return response.data.data
  },

  deleteHistoryRecord: async (id) => {
    const response = await api.delete(`/history/${id}`)
    return response.data
  },

  deleteAllHistory: async () => {
    const response = await api.delete('/history')
    return response.data
  },

  exportHistoryAsPDF: async () => {
    const response = await api.get('/history/export/pdf')
    return response.data
  },
}
