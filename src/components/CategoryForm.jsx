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

export const ICON_OPTIONS = {
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
const MAX_DIM = 200
const WARN_BYTES = 500 * 1024   // ~500 KB

function resizeImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // scale down keeping aspect ratio
        let { width, height } = img
        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width)
          width = MAX_DIM
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height)
          height = MAX_DIM
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        // PNG keeps transparency; use 'image/jpeg', 0.8 for smaller files
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.onerror = reject
      img.src = e.target.result           // the data URI from readAsDataURL
    }
    reader.onerror = reject
    reader.readAsDataURL(file)             // requirement #1
  })
}
function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    name: '',
    icon: 'FiPackage',
    color: '#6366f1',
    image :null
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
        color: category.color || '#6366f1',
        image : category.image|| null
      })
    } catch (error) {
      toast.error('Failed to load category')
      navigate('/categories')
    } finally {
      setLoading(false)
    }
  }
const handleImageChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  try {
    const dataUrl = await resizeImageToDataUrl(file)
    // base64 payload size ≈ length of the string in bytes
    if (dataUrl.length > WARN_BYTES) {
      toast.warn('Image is over ~500 KB even after resizing — consider a smaller one')
    }
    setFormData(prev => ({ ...prev, image: dataUrl }))
  } catch {
    toast.error('Could not process that image')
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

          <div className="form-group">
  <label htmlFor="image">Image (optional)</label>
  <input
    type="file"
    id="image"
    accept="image/*"
    onChange={handleImageChange}
  />
  {formData.image && (
    <div className="image-preview">
      <img
        src={formData.image}
        alt="Preview"
        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
      />
      <button
        type="button"
        className="btn btn-icon btn-danger"
        onClick={() => setFormData(prev => ({ ...prev, image: null }))}
      >
        Remove
      </button>
    </div>
  )}
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
