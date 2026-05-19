import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import CategoryList from './components/CategoryList'
import CategoryForm from './components/CategoryForm'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/new" element={<ExpenseForm />} />
          <Route path="/expenses/edit/:id" element={<ExpenseForm />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default App
