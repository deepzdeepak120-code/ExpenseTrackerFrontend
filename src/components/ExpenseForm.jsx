import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiSave, FiX } from 'react-icons/fi'
import { expenseApi, categoryApi } from '../api/api'
import { toast } from 'react-toastify'

function ExpenseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    categoryId: '',
    expenseDate: new Date().toISOString().split('T')[0]
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchCategories()
    if (isEdit) {
      fetchExpense()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      setCategories(response.data || [])
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const fetchExpense = async () => {
    try {
      setLoading(true)
      const response = await expenseApi.getById(id)
      const expense = response.data
      setFormData({
        title: expense.title,
        amount: expense.amount,
        description: expense.description || '',
        categoryId: expense.categoryId,
        expenseDate: expense.expenseDate
      })
    } catch (error) {
      toast.error('Failed to load expense')
      navigate('/expenses')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be positive'
    }
    if (!formData.categoryId) newErrors.categoryId = 'Category is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        categoryId: parseInt(formData.categoryId)
      }

      if (isEdit) {
        await expenseApi.update(id, payload)
        toast.success('Expense updated successfully')
      } else {
        await expenseApi.create(payload)
        toast.success('Expense created successfully')
      }
      navigate('/expenses')
    } catch (error) {
      toast.error(error.message || 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>{isEdit ? 'Edit Expense' : 'Add New Expense'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lunch at restaurant"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹) *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.amount ? 'error' : ''}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="expenseDate">Date</label>
              <input
                type="date"
                id="expenseDate"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional notes..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/expenses')}
            >
              <FiX /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FiSave /> {loading ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm
