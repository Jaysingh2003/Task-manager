import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Input from '../components/Input'
import Button from '../components/Button'
import toast from 'react-hot-toast'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Start managing your projects</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="Jay Singh" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
