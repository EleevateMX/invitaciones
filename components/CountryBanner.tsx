'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const TIMEZONE_MAP: Record<string, string> = {
  'Mexico/General': 'México',
  'America/Mexico_City': 'México',
  'America/Cancun': 'México',
  'America/Monterrey': 'México',
  'America/Merida': 'México',
  'America/Chihuahua': 'México',
  'America/Hermosillo': 'México',
  'America/Mazatlan': 'México',
  'America/Tijuana': 'México',
  'America/Chicago': 'Estados Unidos',
  'America/New_York': 'Estados Unidos',
  'America/Los_Angeles': 'Estados Unidos',
  'America/Denver': 'Estados Unidos',
  'America/Phoenix': 'Estados Unidos',
  'America/Anchorage': 'Estados Unidos',
  'Pacific/Honolulu': 'Estados Unidos',
  'America/Bogota': 'Colombia',
  'America/Argentina/Buenos_Aires': 'Argentina',
  'America/Argentina/Cordoba': 'Argentina',
  'America/Lima': 'Perú',
  'America/Santiago': 'Chile',
  'Europe/Madrid': 'España',
  'Europe/Barcelona': 'España',
  'America/Guatemala': 'Guatemala',
  'America/El_Salvador': 'El Salvador',
  'America/Tegucigalda': 'Honduras',
  'America/Tegucigalpa': 'Honduras',
  'America/Managua': 'Nicaragua',
  'America/Costa_Rica': 'Costa Rica',
  'America/Panama': 'Panamá',
  'America/Caracas': 'Venezuela',
  'America/Guayaquil': 'Ecuador',
  'America/La_Paz': 'Bolivia',
  'America/Asuncion': 'Paraguay',
  'America/Montevideo': 'Uruguay',
  'America/Santo_Domingo': 'República Dominicana',
  'America/Havana': 'Cuba',
  'America/Puerto_Rico': 'Puerto Rico',
}

export default function CountryBanner() {
  const [visible, setVisible] = useState(false)
  const [country, setCountry] = useState('tu país')

  useEffect(() => {
    const dismissed = localStorage.getItem('banner-dismissed')
    if (dismissed === 'true') return

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const detectedCountry = TIMEZONE_MAP[timezone] ?? 'tu país'
    setCountry(detectedCountry)
    setVisible(true)
  }, [])

  function handleDismiss() {
    localStorage.setItem('banner-dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed top-0 w-full z-[100] bg-[#F72585] text-white py-2 px-4 flex items-center justify-center">
      <p className="text-sm font-medium text-center">
        📍 Estás visitando desde <strong>{country}</strong> — ¡Bienvenido/a a teinvitaron.site!
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-pink-200 transition-colors"
        aria-label="Cerrar banner"
      >
        <X size={16} />
      </button>
    </div>
  )
}
