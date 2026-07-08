'use client'

import { useState } from 'react'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'
import { useRouter } from 'next/navigation'

export default function AdminClient({ initialIsAdmin, initialRegistrations }: { initialIsAdmin: boolean, initialRegistrations: any[] }) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
  const router = useRouter()

  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={() => {
      setIsAdmin(true)
      router.refresh()
    }} />
  }

  return <AdminDashboard initialRegistrations={initialRegistrations} />
}
