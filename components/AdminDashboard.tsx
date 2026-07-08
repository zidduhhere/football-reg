'use client'

import { useState } from 'react'
import { updateRegistrationStatus } from '@/app/actions'
import { CheckCircle, XCircle, Clock } from 'lucide-react'

type Player = { name: string; isCaptain: boolean }

type Registration = {
  id: string
  team_name: string
  country: string
  transaction_id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  players: Player[]
  created_at: string
}

export default function AdminDashboard({ initialRegistrations }: { initialRegistrations: Registration[] }) {
  const [registrations, setRegistrations] = useState(initialRegistrations)
  const [processing, setProcessing] = useState<string | null>(null)

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setProcessing(id)
    const result = await updateRegistrationStatus(id, status)
    if (result.success) {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, status } : r))
    } else {
      alert(result.error)
    }
    setProcessing(null)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 text-gray-900">Admin Dashboard</h1>

      <div className="bg-white shadow-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-4">Team</th>
                <th className="px-4 sm:px-6 py-4">Country</th>
                <th className="px-4 sm:px-6 py-4 hidden md:table-cell">Players</th>
                <th className="px-4 sm:px-6 py-4">Transaction ID</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No registrations found.
                  </td>
                </tr>
              ) : registrations.map(reg => (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                    {reg.team_name}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {reg.country}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs text-gray-600 max-w-xs truncate hidden md:table-cell">
                    {reg.players.map(p => p.isCaptain ? `(C) ${p.name}` : p.name).join(', ')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 font-mono text-xs whitespace-nowrap">
                    {reg.transaction_id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {reg.status === 'PENDING' && <span className="flex items-center text-yellow-600 font-medium"><Clock className="w-4 h-4 mr-1"/> Pending</span>}
                    {reg.status === 'APPROVED' && <span className="flex items-center text-green-600 font-medium"><CheckCircle className="w-4 h-4 mr-1"/> Approved</span>}
                    {reg.status === 'REJECTED' && <span className="flex items-center text-red-600 font-medium"><XCircle className="w-4 h-4 mr-1"/> Rejected</span>}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    {reg.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(reg.id, 'APPROVED')}
                          disabled={processing === reg.id}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(reg.id, 'REJECTED')}
                          disabled={processing === reg.id}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
