import { useEffect, useState } from 'react'
import api from '../api/axios'
import { CheckCircle, Clock, AlertTriangle, FolderKanban } from 'lucide-react'

const statusColor = {
  TODO: 'bg-gray-100 text-gray-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, done: 0, inProgress: 0, overdue: 0 })
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    api.get('/tasks').then(({ data }) => {
      const now = new Date()
      const total = data.length
      const done = data.filter(t => t.status === 'DONE').length
      const inProgress = data.filter(t => t.status === 'IN_PROGRESS').length
      const overdue = data.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE').length
      setStats({ total, done, inProgress, overdue })
      setTasks(data.slice(0, 5))
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: FolderKanban, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Completed', value: stats.done, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}><Icon size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Recent Tasks</h2>
        </div>
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No tasks yet</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {tasks.map(task => (
              <li key={task.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.projectName} · Assigned to {task.assigneeName || 'Unassigned'}</p>
                </div>
                <div className="flex items-center gap-3">
                  {task.dueDate && (
                    <span className="text-xs text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
