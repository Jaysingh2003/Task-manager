import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import toast from 'react-hot-toast'
import { Plus, X } from 'lucide-react'

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'DONE']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

const statusColor = {
  TODO: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}
const priorityColor = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-yellow-500',
  HIGH: 'text-red-500',
}

export default function Tasks() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [form, setForm] = useState({ title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', dueDate: '' })
  const [loading, setLoading] = useState(false)

  const fetchTasks = () => api.get('/tasks').then(({ data }) => setTasks(data)).catch(() => {})

  useEffect(() => {
    fetchTasks()
    api.get('/projects').then(({ data }) => setProjects(data)).catch(() => {})
    if (isAdmin) api.get('/users').then(({ data }) => setUsers(data)).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/tasks', form)
      toast.success('Task created')
      setForm({ title: '', description: '', projectId: '', assigneeId: '', priority: 'MEDIUM', dueDate: '' })
      setShowForm(false)
      fetchTasks()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status })
      fetchTasks()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success('Deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        {isAdmin && (
          <Button onClick={() => setShowForm(!showForm)}>
            <span className="flex items-center gap-1"><Plus size={16} /> New Task</span>
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-6 grid grid-cols-2 gap-4">
          <h2 className="col-span-2 font-semibold text-gray-800">Create Task</h2>
          <div className="col-span-2">
            <Input label="Title" placeholder="Task title" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="col-span-2">
            <Input label="Description" placeholder="Details..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Project</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} required>
              <option value="">Select project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {isAdmin && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Assignee</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.assigneeId} onChange={e => setForm({ ...form, assigneeId: e.target.value })}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Due Date</label>
            <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div className="col-span-2 flex gap-2">
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="flex gap-2">
        {['ALL', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No tasks found</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.map(task => (
            <div key={task.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {task.projectName} · {task.assigneeName || 'Unassigned'}
                  {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-semibold ${priorityColor[task.priority]}`}>{task.priority}</span>
                <select
                  className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer ${statusColor[task.status]}`}
                  value={task.status}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                  disabled={!isAdmin && task.assigneeId !== user?.id}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                {isAdmin && (
                  <button onClick={() => handleDelete(task.id)} className="text-gray-300 hover:text-red-500 cursor-pointer">
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
