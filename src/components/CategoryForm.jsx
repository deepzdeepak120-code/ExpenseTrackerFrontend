import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FiSave, FiX, FiShoppingBag, FiTruck, FiShoppingCart, FiFileText,
  FiFilm, FiHeart, FiBook, FiPackage, FiSend, FiHome,
  FiDollarSign, FiMonitor, FiActivity, FiCoffee, FiGift,FiCamera,
} from 'react-icons/fi' 

import{CgGym} from'react-icons/cg' 
import { categoryApi } from '../api/api'
import { toast } from 'react-toastify' 

const ICON_OPTIONS = {
  FiShoppingBag: FiShoppingBag,
  FiTruck: FiTruck,
  FiShoppingCart: FiShoppingCart,
  FiFileText: FiFileText,
  FiFilm: FiFilm,
  FiHeart: FiHeart,
  FiBook: FiBook,
  FiPackage: FiPackage,
  FiSend: FiSend,
  FiHome: FiHome,
  FiDollarSign: FiDollarSign,
  FiMonitor: FiMonitor,
  FiActivity: FiActivity,
  FiCoffee: FiCoffee,
  FiGift: FiGift, 
  FiCamera: FiCamera,
  CgGym: CgGym
}
const COLOR_OPTIONS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BDC3C7', '#6366f1', '#ec4899']

function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    icon: 'FiPackage',
    color: '#6366f1'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      fetchCategory()
    }
  }, [id])
  const fetchCategory = async () => {
    try {
      setLoading(true)
      const response = await categoryApi.getById(id)
      const category = response.data
      setFormData({
        name: category.name,
        icon: category.icon || 'FiPackage',
        color: category.color || '#6366f1'
      })
    } catch (error) {
      toast.error('Failed to load category')
      navigate('/categories')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      if (isEdit) {
        await categoryApi.update(id, formData)
        toast.success('Category updated successfully')
      } else {
        await categoryApi.create(formData)
        toast.success('Category created successfully')
      }
      navigate('/categories')
    } catch (error) {
      toast.error(error.message || 'Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h1>{isEdit ? 'Edit Category' : 'Add New Category'}</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Food, Transport"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Icons</label>
            <div className="icon-picker">
              {Object.entries(ICON_OPTIONS).map(([name, IconComponent]) => (
                <button
                  key={name}
                  type="button"
                  className={`icon-option ${formData.icon === name ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, icon: prev.icon === name ? '' : name }))}
                >
                  <IconComponent />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="color-input"
            />
          </div>

          <div className="preview-box">
            <p>Preview:</p>
            <div className="category-preview" style={{ backgroundColor: formData.color + '20' }}>
              <span className="preview-icon">{(() => { const Icon = ICON_OPTIONS[formData.icon]; return Icon ? <Icon /> : null; })()}</span>
              <span className="preview-name">{formData.name || 'Category Name'}</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/categories')}
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

export default CategoryForm
