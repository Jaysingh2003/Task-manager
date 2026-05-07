import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import toast from 'react-hot-toast'
import { Plus, X, Users } from 'lucide-react'

export default function Projects() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const fetchProjects = () => api.get('/projects').then(({ data }) => setProjects(data)).catch(() => {})

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/projects', form)
      toast.success('Project created')
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      toast.success('Deleted')
      fetchProjects()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)}>
            <span className="flex items-center gap-1"><Plus size={16} /> New Project</span>
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">Create Project</h2>
          <Input label="Project Name" placeholder="e.g. Website Redesign" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" placeholder="Brief description..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No projects yet</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{p.description || 'No description'}</p>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(p.id)} className="text-gray-300 hover:text-red-500 cursor-pointer">
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users size={13} /> {p.memberCount ?? 0} members · {p.taskCount ?? 0} tasks
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
