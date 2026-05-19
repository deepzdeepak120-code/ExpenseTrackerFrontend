import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiSearch } from 'react-icons/fi'
import { expenseApi, categoryApi } from '../api/api'
import { toast } from 'react-toastify'

function ExpenseList() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [expensesRes, categoriesRes] = await Promise.all([
        expenseApi.getAll(),
        categoryApi.getAll()
      ])
      setExpenses(expensesRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return

    try {
      await expenseApi.delete(id)
      toast.success('Expense deleted successfully')
      setExpenses(expenses.filter(exp => exp.id !== id))
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !filterCategory || expense.categoryId === parseInt(filterCategory)
    const matchesSearch = !searchTerm ||
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return <div className="loading">Loading expenses...</div>
  }

  return (
    <div className="expense-list-page">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p className="subtitle">{expenses.length} total expenses</p>
        </div>
        <Link to="/expenses/new" className="btn btn-primary">
          <FiPlus /> Add Expense
        </Link>
      </div>

      <div className="filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select">
          <FiFilter className="filter-icon" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found</p>
          <Link to="/expenses/new" className="btn btn-primary">
            <FiPlus /> Add Your First Expense
          </Link>
        </div>
      ) : (
        <div className="expense-list">
          {filteredExpenses.map(expense => (
            <div key={expense.id} className="expense-card">
              <div className="expense-icon" style={{ backgroundColor: expense.categoryColor + '20' }}>
                <span>{expense.categoryIcon}</span>
              </div>
              <div className="expense-details">
                <h3 className="expense-title">{expense.title}</h3>
                <p className="expense-category">{expense.categoryName}</p>
                {expense.description && (
                  <p className="expense-description">{expense.description}</p>
                )}
              </div>
              <div className="expense-meta">
                <p className="expense-amount">₹{parseFloat(expense.amount).toLocaleString()}</p>
                <p className="expense-date">{formatDate(expense.expenseDate)}</p>
              </div>
              <div className="expense-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => navigate(`/expenses/edit/${expense.id}`)}
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => handleDelete(expense.id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export default ExpenseList
