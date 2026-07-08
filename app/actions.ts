'use server'

import { supabase } from '@/lib/supabase'
import { WORLD_CUP_TEAMS } from '@/lib/countries'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'
import { cookies } from 'next/headers'

export async function getAvailableCountries() {
  const { data, error } = await supabase
    .from('registrations')
    .select('country')
    .in('status', ['PENDING', 'APPROVED'])

  if (error) {
    console.error('Error fetching registered countries:', error)
    return WORLD_CUP_TEAMS
  }

  const registeredCountries = data.map(r => r.country)
  return WORLD_CUP_TEAMS.filter(c => !registeredCountries.includes(c))
}

export async function submitRegistration(formData: FormData) {
  const teamName = formData.get('teamName') as string
  const country = formData.get('country') as string
  const transactionId = formData.get('transactionId') as string
  
  // Extract 10 players
  const players = []
  for (let i = 1; i <= 10; i++) {
    const playerName = formData.get(`player_${i}`) as string
    if (playerName) {
      players.push({ name: playerName, isCaptain: i === 1 })
    }
  }

  if (players.length !== 10) {
    return { error: 'Please provide exactly 10 players.' }
  }

  const { error } = await supabase
    .from('registrations')
    .insert([{ team_name: teamName, country, transaction_id: transactionId, players, status: 'PENDING' }])

  if (error) {
    console.error('Error inserting registration:', error)
    if (error.code === '23505') {
      return { error: 'This country is already registered.' }
    }
    return { error: 'Failed to submit registration.' }
  }

  revalidatePath('/')
  return { success: true }
}

export async function adminLogin(password: string) {
  const secret = process.env.ADMIN_PASSPHRASE || 'fallback_secret'
  const hash = crypto.createHmac('sha256', secret).update(password).digest('hex')
  const expectedHash = crypto.createHmac('sha256', secret).update('Admin123!').digest('hex')

  if (hash === expectedHash) {
    (await cookies()).set('admin_auth', 'true', { httpOnly: true, path: '/' })
    return { success: true }
  }
  return { error: 'Invalid password' }
}

export async function checkAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_auth')?.value === 'true'
}

export async function getRegistrations() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching registrations:', error)
    return { error: 'Failed to fetch' }
  }

  return { registrations: data }
}

export async function updateRegistrationStatus(id: string, status: 'APPROVED' | 'REJECTED') {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('registrations')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating status:', error)
    return { error: 'Failed to update' }
  }

  revalidatePath('/admin')
  return { success: true }
}
