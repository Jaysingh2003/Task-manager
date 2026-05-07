import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="font-bold text-indigo-600 text-lg">TaskFlow</span>
        <Link to="/dashboard" className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600">
          <LayoutDashboard size={16} /> Dashboard
        </Link>
        <Link to="/projects" className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600">
          <FolderKanban size={16} /> Projects
        </Link>
        <Link to="/tasks" className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600">
          <CheckSquare size={16} /> Tasks
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {user?.name}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${user?.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
            {user?.role}
          </span>
        </span>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 cursor-pointer">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}
