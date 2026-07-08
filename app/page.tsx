import { getAvailableCountries } from './actions'
import RegistrationForm from '@/components/RegistrationForm'

export const revalidate = 0 // Opt out of caching for this page so countries are always fresh

export default async function Home() {
  const availableCountries = await getAvailableCountries()

  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <RegistrationForm availableCountries={availableCountries} />
    </main>
  )
}
