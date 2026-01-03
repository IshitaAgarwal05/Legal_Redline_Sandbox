import { Link, useNavigate } from "react-router-dom"
import React from 'react'
import { useAppState } from '../state/StateContext'

function Header({ handleLeaveSession }) {
  const navigate = useNavigate();
  const { state, dispatch } = useAppState();
  const { user } = state;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    dispatch({ type: 'SET_USER', payload: null });
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">⚖️</span>
            <h1 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
              Legal AI
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all duration-200"
              >
                <span>🏠</span>
                Home
              </Link>
              <Link
                to="/upload"
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-blue-400 transition-all duration-200"
              >
                <span>📄</span>
                Upload
              </Link>
              <Link
                to="/chatbot"
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-indigo-400 transition-all duration-200"
              >
                <span>🤖</span>
                Chat
              </Link>
              <Link
                to="/pricing"
                className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-pink-400 transition-all duration-200"
              >
                <span>💎</span>
                Pricing
              </Link>
            </nav>

            <div className="h-8 w-[1px] bg-gray-700 mx-2 hidden md:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-white text-sm font-bold">{user.username}</span>
                  <span className="text-[10px] text-pink-400 font-bold uppercase">
                    {user.role === 'admin' ? 'ADMIN' : user.subscription_plan}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Logout"
                >
                  <span className="text-xl">📤</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all">Sign Up</Link>
              </div>
            )}

            <button
              onClick={handleLeaveSession}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
              title="Reset Workspace"
            >
              <span className="text-sm">🚪</span>
              <span className="text-sm font-medium hidden lg:inline">Leave Session</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header