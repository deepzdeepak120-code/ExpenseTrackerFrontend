import { NavLink } from 'react-router-dom'
import { FiHome, FiDollarSign, FiTag, FiPlus } from 'react-icons/fi'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FiDollarSign className="brand-icon" />
        <span>Expense Tracker</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FiHome /> Dashboard
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FiDollarSign /> Expenses
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FiTag /> Categories
        </NavLink>
      </div>
      <NavLink to="/expenses/new" className="btn btn-primary">
        <FiPlus /> Add Expense
      </NavLink>
    </nav>
  )
}

export default Navbar
