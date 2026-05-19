import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor to extract data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

// ==================== EXPENSE API ====================

export const expenseApi = {
  // Get all expenses
  getAll: () => api.get('/expenses'),

  // Get expense by ID
  getById: (id) => api.get(`/expenses/${id}`),

  // Create new expense
  create: (data) => api.post('/expenses', data),

  // Update expense
  update: (id, data) => api.put(`/expenses/${id}`, data),

  // Delete expense
  delete: (id) => api.delete(`/expenses/${id}`),

  // Get expenses by date range
  getByDateRange: (startDate, endDate) =>
    api.get('/expenses/filter', { params: { startDate, endDate } }),

  // Get expenses by category
  getByCategory: (categoryId) => api.get(`/expenses/category/${categoryId}`),

  // Get expense summary
  getSummary: (startDate, endDate) =>
    api.get('/expenses/summary', { params: { startDate, endDate } }),

  // Get current month summary
  getCurrentMonthSummary: () => api.get('/expenses/summary/current-month')
}

// ==================== CATEGORY API ====================

export const categoryApi = {
  // Get all categories
  getAll: () => api.get('/categories'),

  // Get category by ID
  getById: (id) => api.get(`/categories/${id}`),

  // Create new category
  create: (data) => api.post('/categories', data),

  // Update category
  update: (id, data) => api.put(`/categories/${id}`, data),

  // Delete category
  delete: (id) => api.delete(`/categories/${id}`)
}

export default api
