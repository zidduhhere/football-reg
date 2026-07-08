'use client'

import { useState } from 'react'
import { adminLogin } from '@/app/actions'
import { Lock } from 'lucide-react'

export default function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    
    const result = await adminLogin(password)
    
    if (result.error) {
      setError(result.error)
    } else {
      onLoginSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md w-full mx-auto mt-12 sm:mt-20 p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-200 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gray-50 rounded-full border border-gray-100">
          <Lock className="w-8 h-8 text-gray-700" />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Admin Access</h2>
      
      {error && (
        <div className="p-3 mb-6 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input 
            type="password" 
            name="password" 
            required 
            placeholder="Enter admin password"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none text-center text-gray-900 placeholder-gray-500"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 px-6 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {loading ? 'Verifying...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
