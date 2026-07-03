import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { categoryApi } from '../api/api'
import { toast } from 'react-toastify'  
import { ICON_OPTIONS } from './CategoryForm'

// Sreenath is Teaching me 

function CategoryList() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryApi.getAll()
      setCategories(response.data || [])
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will affect all expenses in this category.')) return

    try {
      await categoryApi.delete(id)
      toast.success('Category deleted successfully')
      setCategories(categories.filter(cat => cat.id !== id))
    } catch (error) {
      toast.error(error.message || 'Failed to delete category')
    }
  }

  if (loading) {
    return <div className="loading">Loading categories...</div>
  }

  return (
    <div className="category-list-page">
      <div className="page-header">
        <div>
          <h1>Categories
          </h1>
          <p className="subtitle">{categories.length} categories</p>
        </div>
        <Link to="/categories/new" className="btn btn-primary">
          <FiPlus /> Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found</p>
          <Link to="/categories/new" className="btn btn-primary">
            <FiPlus /> Add Your First Category
          </Link>
        </div>
      ) : (
        <div className="category-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card"> 


             <div
  className="category-icon-large"
  style={{ backgroundColor: category.color + '20' }}
  >
  {category.image ? (
    <img
      src={category.image}
      alt={category.name}
      style={{ width: '3rem', height: '3rem', objectFit: 'cover', borderRadius: 8 }}
    />
  ) : (
    (() => {
      const Icon = ICON_OPTIONS[category.icon]
      return Icon
        ? <Icon size={32} />
        : <span style={{ fontSize: '2rem' }}>{category.icon}</span>
    })()
  )}
   </div> 


              <h3>{category.name}</h3>
              <div
                className="color-preview"
                style={{ backgroundColor: category.color }}
              />
              <div className="category-actions">
                <button
                  className="btn btn-icon"
                  onClick={() => navigate(`/categories/edit/${category.id}`)}
                  title="Edit"
                >
                  <FiEdit2 />
                </button>
                <button
                  className="btn btn-icon btn-danger"
                  onClick={() => handleDelete(category.id)}
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





export default CategoryList
