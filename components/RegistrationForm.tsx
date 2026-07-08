'use client'

import { useState, useEffect } from 'react'
import { submitRegistration } from '@/app/actions'
import { Trophy, Users, MapPin, CalendarDays, Wallet, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function RegistrationForm({ availableCountries }: { availableCountries: string[] }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem('footballRegForm')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        const formElement = document.getElementById('registrationForm') as HTMLFormElement
        if (formElement) {
          Object.keys(parsed).forEach(key => {
            const input = formElement.elements.namedItem(key) as HTMLInputElement | HTMLSelectElement
            if (input) {
              input.value = parsed[key]
            }
          })
        }
      } catch (e) {
        console.error("Failed to parse local storage form data")
      }
    }
  }, [])

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget)
    const dataObj: Record<string, string> = {}
    formData.forEach((value, key) => {
      dataObj[key] = value.toString()
    })
    localStorage.setItem('footballRegForm', JSON.stringify(dataObj))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(form)
    const result = await submitRegistration(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setShowSuccess(true)
      setMessage(null)
      form.reset()
      localStorage.removeItem('footballRegForm')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      
      {/* 
        Aesthetic Direction: Editorial Sports
        Anchor: Stark, high-contrast minimal components avoiding generic soft shadows. 
        Instead of generic UI, we use aggressive tracking, uppercase displays, and rigid layout structure.
      */}

      {/* Header Banner - 4:3 Ratio as requested with rounded corners */}
      <div className="w-full relative aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden mb-12 shadow-sm border border-gray-200/60">
        <Image 
          src="/poster.png" 
          alt="FIFA World Cup 2026 Tournament Poster"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="px-4 sm:px-8 mb-16 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter flex items-center justify-center gap-2 sm:gap-4">
          <Trophy className="text-gray-900 w-8 h-8 sm:w-12 sm:h-12" />
          FIFA '26
        </h2>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs sm:text-sm">Official College Tournament Registration</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-2 sm:px-0">
        <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
          <CalendarDays className="text-gray-900 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm font-black uppercase tracking-wider text-gray-900">11 SAT</span>
        </div>
        <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
          <MapPin className="text-gray-900 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm font-black uppercase tracking-wider text-gray-900">Turf on Top</span>
        </div>
        <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
          <Users className="text-gray-900 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm font-black uppercase tracking-wider text-gray-900">7v7 Format</span>
        </div>
        <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center text-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
          <Wallet className="text-gray-900 mb-3 w-6 h-6 sm:w-8 sm:h-8" />
          <span className="text-sm font-black uppercase tracking-wider text-gray-900">600 INR</span>
        </div>
      </div>

      <div className="bg-[#EFFF04] p-6 sm:p-8 rounded-2xl border-2 border-gray-900 shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] mb-6 mx-2 sm:mx-0 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle background noise texture or diagonal lines effect (using CSS) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2 relative z-10">Cash Prize Pool</h3>
        <p className="text-gray-900 font-bold uppercase tracking-wider text-xs sm:text-sm max-w-lg relative z-10">
          The ultimate reward scales with the competition. The total cash prize pool is dynamically calculated based on the total number of participating squads.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] mb-16 mx-2 sm:mx-0 text-center">
        <p className="text-gray-900 font-bold uppercase tracking-widest text-xs sm:text-sm">
          <span className="bg-gray-900 text-white px-2 py-0.5 rounded mr-2">NOTICE</span>
          One-time re-entry is permitted
        </p>
      </div>

      <div className="bg-white p-6 sm:p-12 rounded-3xl border border-gray-200 shadow-sm">
        {message && message.type === 'error' && (
          <div className="p-5 mb-10 rounded-xl font-bold text-center text-sm sm:text-base border-2 bg-red-50 text-red-900 border-red-900">
            {message.text}
          </div>
        )}

        <form id="registrationForm" onChange={handleFormChange} onSubmit={handleSubmit} className="space-y-12">
          
          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-6">1. Squad Identity</h3>
            
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" htmlFor="teamName">Team Name</label>
                <input 
                  type="text" 
                  id="teamName" 
                  name="teamName" 
                  required 
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="e.g. THE INVINCIBLES"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" htmlFor="country">Representing Nation</label>
                <select 
                  id="country" 
                  name="country" 
                  required
                  className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:bg-white transition-all outline-none appearance-none text-gray-900 font-medium"
                >
                  <option value="" className="text-gray-400">Select a nation...</option>
                  {availableCountries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-6 mt-12">2. Roster (10 Players)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2" htmlFor={`player_${i+1}`}>
                    Player {i + 1} 
                    {i === 0 && <span className="text-gray-900 bg-gray-200 px-2 py-0.5 rounded ml-2">CAPTAIN</span>}
                    {i >= 7 && <span className="text-gray-400 font-normal normal-case tracking-normal ml-2">(Optional)</span>}
                  </label>
                  <input 
                    type="text" 
                    id={`player_${i+1}`} 
                    name={`player_${i+1}`} 
                    required={i < 7} 
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400 font-medium"
                    placeholder={i < 7 ? `Full Name` : `Full Name (Optional)`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 mb-6 mt-12">3. Registration Fee</h3>
            
            <div className="bg-gray-900 p-6 sm:p-8 rounded-2xl">
              <p className="text-sm font-medium text-gray-300 mb-6 leading-relaxed">
                Secure your spot by transferring the registration fee of <strong className="text-white">600 INR</strong>.
                Scan the QR code below to make your payment, then enter your transaction reference number for verification.
              </p>

              <div className="flex justify-center mb-8">
                <div className="bg-white p-4 rounded-3xl border-4 border-gray-700 max-w-[320px] w-full aspect-square relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <Image 
                    src="/qr.jpeg" 
                    alt="Payment QR Code" 
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
              
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2" htmlFor="transactionId">Transaction Reference</label>
              <input 
                type="text" 
                id="transactionId" 
                name="transactionId" 
                required 
                className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:border-white focus:bg-gray-800 transition-all outline-none text-white placeholder-gray-500 font-mono"
                placeholder="TXN-123456789"
              />
            </div>
          </div>

          <div className="pt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="group w-full py-5 px-6 bg-gray-900 hover:bg-black text-white text-lg font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3 shadow-[0px_8px_0px_0px_rgba(209,213,219,1)] hover:shadow-[0px_4px_0px_0px_rgba(209,213,219,1)] hover:translate-y-1 active:shadow-none active:translate-y-2 border-2 border-transparent"
            >
              {loading ? 'Processing...' : 'Submit Roster'}
              {!loading && <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-8 sm:p-12 rounded-3xl border-4 border-gray-900 shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] text-center relative">
            <div className="w-20 h-20 bg-[#EFFF04] border-4 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
              <Trophy className="w-10 h-10 text-gray-900" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-4">Secured!</h2>
            <p className="text-gray-600 font-bold uppercase tracking-wider text-sm mb-8">
              Your squad's registration has been submitted and is awaiting admin approval.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white text-lg font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.98] border-2 border-transparent shadow-[0px_6px_0px_0px_rgba(209,213,219,1)] hover:shadow-[0px_3px_0px_0px_rgba(209,213,219,1)] hover:translate-y-1 active:shadow-none active:translate-y-2"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
