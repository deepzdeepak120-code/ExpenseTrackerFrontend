import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { FiDollarSign, FiTrendingUp, FiPieChart, FiPlus } from 'react-icons/fi'
import { expenseApi } from '../api/api'
import { toast } from 'react-toastify'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  })
  const [endDate, setEndDate] = useState(() => {
    const now = new Date()
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  })

  useEffect(() => {
    fetchSummary()
  }, [startDate, endDate])

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const response = await expenseApi.getSummary(startDate, endDate)
      setSummary(response.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  const chartData = summary?.byCategory?.map(cat => ({
    name: cat.categoryName,
    value: parseFloat(cat.amount),
    color: getColorForCategory(cat.categoryName)
  })) || []

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="month-filter">
          <label htmlFor="startDate">From:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate">To:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
            <FiDollarSign style={{ color: '#dc2626' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value">₹{summary?.totalAmount?.toLocaleString() || '0'}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <FiTrendingUp style={{ color: '#2563eb' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Transactions</p>
            <h2 className="stat-value">{summary?.totalCount || 0}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
            <FiPieChart style={{ color: '#16a34a' }} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Categories Used</p>
            <h2 className="stat-value">{summary?.byCategory?.length || 0}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h3>Expenses by Category</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <p>No expenses this month</p>
              <Link to="/expenses/new" className="btn btn-primary">
                <FiPlus /> Add Expense
              </Link>
            </div>
          )}
        </div>

        <div className="card category-breakdown">
          <h3>Category Breakdown</h3>
          <div className="category-list">
            {summary?.byCategory?.map((cat) => (
              <div key={cat.categoryId} className="category-item">
                <div className="category-info">
                  <span className="category-name">{cat.categoryName}</span>
                  <span className="category-count">{cat.count} transactions</span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">₹{parseFloat(cat.amount).toLocaleString()}</span>
                  <span className="category-percentage">{cat.percentage.toFixed(1)}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: getColorForCategory(cat.categoryName)
                    }}
                  />
                </div>
              </div>
            ))}
            {(!summary?.byCategory || summary.byCategory.length === 0) && (
              <p className="empty-text">No category data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getColorForCategory(name) {
  const colors = {
    'Food': '#FF6B6B',
    'Transport': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Bills': '#96CEB4',
    'Entertainment': '#DDA0DD',
    'Health': '#98D8C8',
    'Education': '#F7DC6F',
    'Other': '#BDC3C7'
  }
  return colors[name] || '#6366f1'
}

export default Dashboard
