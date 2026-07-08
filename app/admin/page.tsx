import { checkAdmin, getRegistrations } from '@/app/actions'
import AdminClient from './AdminClient'

export const revalidate = 0

export default async function AdminPage() {
  const isAdmin = await checkAdmin()
  let registrations: any[] = []

  if (isAdmin) {
    const res = await getRegistrations()
    if (res.registrations) {
      registrations = res.registrations
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <AdminClient initialIsAdmin={isAdmin} initialRegistrations={registrations} />
    </main>
  )
}
