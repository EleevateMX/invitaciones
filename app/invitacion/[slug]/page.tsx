'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react'
import WhatsAppShareButton from '@/components/WhatsAppShareButton'
import { getInvitation } from '@/lib/invitations'

/* ─── Countdown Timer ─── */

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    function calculate() {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const diff = target - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3 justify-center">
      {units.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 min-w-[64px]"
        >
          <span className="text-2xl sm:text-3xl font-bold text-[#FFB700] tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-white/60 text-xs mt-1">{label}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Wedding Invitation ─── */

function BodaInvitation() {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://teinvitaron.site'

  return (
    <div className="min-h-screen bg-[#1A1A2E] relative overflow-hidden flex flex-col items-center justify-center py-16 px-4">
      {/* Radial golden glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFB700] opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Floating sparkles */}
      <div className="absolute top-16 left-10 text-[#FFB700] text-xl opacity-40 animate-twinkle">✦</div>
      <div className="absolute top-32 right-12 text-[#FFB700] text-sm opacity-30 animate-twinkle" style={{ animationDelay: '0.7s' }}>✧</div>
      <div className="absolute bottom-32 left-16 text-[#FFB700] text-lg opacity-35 animate-twinkle" style={{ animationDelay: '1.4s' }}>✦</div>
      <div className="absolute bottom-20 right-10 text-[#FFB700] text-sm opacity-30 animate-twinkle" style={{ animationDelay: '2.1s' }}>✧</div>
      <div className="absolute top-1/2 right-8 text-[#FFB700] text-xs opacity-25 animate-twinkle" style={{ animationDelay: '0.3s' }}>✦</div>

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center gap-6">
        {/* Top ornament */}
        <div className="text-[#FFB700] text-2xl tracking-widest opacity-70">
          ✦ ✧ ✦
        </div>

        {/* Pre-title */}
        <p className="text-[#FFB700] italic text-lg font-display">
          Con alegría en nuestros corazones
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-[#FFB700] opacity-30" />
          <div className="text-[#FFB700] text-xs opacity-50">✦</div>
          <div className="flex-1 h-px bg-[#FFB700] opacity-30" />
        </div>

        {/* Names */}
        <div className="flex flex-col items-center gap-0">
          <h1 className="font-display text-6xl sm:text-7xl text-white tracking-widest leading-tight">
            Ana
          </h1>
          <span className="text-[#FFB700] text-3xl font-display">&</span>
          <h1 className="font-display text-6xl sm:text-7xl text-white tracking-widest leading-tight">
            Carlos
          </h1>
        </div>

        <p className="text-[#FFB700] text-base font-medium tracking-widest uppercase">
          Se unen en matrimonio
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-[#FFB700] opacity-30" />
          <div className="text-[#FFB700] text-xs opacity-50">✦</div>
          <div className="flex-1 h-px bg-[#FFB700] opacity-30" />
        </div>

        {/* Event details */}
        <div className="flex flex-col gap-3 text-white/80">
          <div className="flex items-center justify-center gap-2">
            <Calendar size={16} className="text-[#FFB700]" />
            <span className="text-sm">Sábado, 15 de Marzo 2025</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-[#FFB700]" />
            <span className="text-sm">7:00 PM</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-[#FFB700]" />
            <span className="text-sm">Salón La Perla, Cancún, México</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="w-full">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Faltan</p>
          <CountdownTimer targetDate="2026-03-15" />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={`https://wa.me/?text=${encodeURIComponent('¡Confirmo mi asistencia a la boda de Ana & Carlos! 🎉')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FFB700] hover:bg-[#e6a500] text-[#1A1A2E] font-bold py-4 rounded-2xl text-center transition-all duration-200 shadow-lg hover:shadow-amber-500/30"
          >
            Confirmar asistencia
          </a>
          <WhatsAppShareButton
            message="¡Estás invitado/a a nuestra boda! 💍 Mira la invitación:"
            url={pageUrl}
            className="w-full justify-center"
          />
        </div>

        {/* Bottom ornament */}
        <div className="text-[#FFB700] text-2xl tracking-widest opacity-70 mt-4">
          ✦ ✧ ✦
        </div>

        {/* Create own invitation */}
        <Link
          href="/crear"
          className="text-white/40 hover:text-white/70 text-sm transition-colors flex items-center gap-1 mt-4"
        >
          Crear tu propia invitación <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

/* ─── XV Años Invitation ─── */

function XvInvitation() {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://teinvitaron.site'

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-violet-900 to-fuchsia-950 relative overflow-hidden flex flex-col items-center justify-center py-16 px-4">
      {/* Sparkle decorations */}
      <div className="absolute top-12 left-8 text-yellow-300 text-2xl opacity-60 animate-twinkle">★</div>
      <div className="absolute top-24 right-12 text-yellow-300 text-lg opacity-50 animate-twinkle" style={{ animationDelay: '0.5s' }}>✦</div>
      <div className="absolute top-48 left-20 text-yellow-300 text-sm opacity-40 animate-twinkle" style={{ animationDelay: '1s' }}>★</div>
      <div className="absolute bottom-48 right-8 text-yellow-300 text-xl opacity-50 animate-twinkle" style={{ animationDelay: '1.5s' }}>✦</div>
      <div className="absolute bottom-32 left-10 text-yellow-300 text-xs opacity-35 animate-twinkle" style={{ animationDelay: '2s' }}>★</div>
      <div className="absolute top-1/3 right-4 text-yellow-300 text-sm opacity-30 animate-twinkle" style={{ animationDelay: '0.3s' }}>✦</div>
      <div className="absolute bottom-1/3 left-4 text-yellow-300 text-lg opacity-40 animate-twinkle" style={{ animationDelay: '2.5s' }}>★</div>

      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-fuchsia-500 opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center gap-6">
        {/* Crown */}
        <div className="text-7xl animate-float">👑</div>

        {/* Title */}
        <p className="text-yellow-300 text-sm font-bold tracking-widest uppercase">
          Mis XV Años
        </p>

        {/* Name */}
        <h1 className="font-display text-6xl sm:text-7xl text-white italic tracking-wide leading-tight">
          Sofía Ramírez
        </h1>

        <p className="text-white/70 text-base italic max-w-sm">
          Te invita a celebrar esta noche mágica
        </p>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-yellow-300 opacity-30" />
          <span className="text-yellow-300 text-sm">★</span>
          <div className="flex-1 h-px bg-yellow-300 opacity-30" />
        </div>

        {/* Event details */}
        <div className="flex flex-col gap-3 text-white/80">
          <div className="flex items-center justify-center gap-2">
            <Calendar size={16} className="text-yellow-300" />
            <span className="text-sm">Sábado, 21 de Junio 2025</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-yellow-300" />
            <span className="text-sm">8:00 PM</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-yellow-300" />
            <span className="text-sm">Gran Salón Real, Guadalajara, México</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="w-full">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Cuenta regresiva</p>
          <CountdownTimer targetDate="2026-06-21" />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={`https://wa.me/?text=${encodeURIComponent('¡Confirmo mi asistencia a los XV de Sofía! 👑🎉')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-[#F72585] to-[#7209B7] hover:from-[#B5179E] hover:to-[#560086] text-white font-bold py-4 rounded-2xl text-center transition-all duration-200 shadow-lg"
          >
            Confirmar Asistencia
          </a>
          <WhatsAppShareButton
            message="¡Estás invitado/a a los XV Años de Sofía! 👑 Mira la invitación:"
            url={pageUrl}
            className="w-full justify-center"
          />
        </div>

        {/* Create own invitation */}
        <Link
          href="/crear"
          className="text-white/40 hover:text-white/70 text-sm transition-colors flex items-center gap-1 mt-4"
        >
          Crear tu propia invitación <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

/* ─── Birthday Invitation ─── */

function CumpleInvitation() {
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://teinvitaron.site'

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 relative overflow-hidden flex flex-col items-center justify-center py-16 px-4">
      {/* Balloon decorations at top */}
      <div className="absolute top-0 left-0 right-0 flex justify-around pointer-events-none">
        <div className="flex flex-col items-center">
          <div className="w-10 h-14 bg-red-400 rounded-full opacity-80 shadow-lg mt-4" />
          <div className="w-px h-12 bg-white/50" />
        </div>
        <div className="flex flex-col items-center" style={{ marginTop: '-8px' }}>
          <div className="w-10 h-14 bg-yellow-300 rounded-full opacity-80 shadow-lg mt-4" />
          <div className="w-px h-16 bg-white/50" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-14 bg-blue-400 rounded-full opacity-80 shadow-lg mt-4" />
          <div className="w-px h-12 bg-white/50" />
        </div>
        <div className="flex flex-col items-center" style={{ marginTop: '-4px' }}>
          <div className="w-10 h-14 bg-green-400 rounded-full opacity-80 shadow-lg mt-4" />
          <div className="w-px h-14 bg-white/50" />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-14 bg-pink-300 rounded-full opacity-80 shadow-lg mt-4" />
          <div className="w-px h-12 bg-white/50" />
        </div>
      </div>

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center gap-6 pt-20">
        {/* Header */}
        <div className="text-5xl">🎉</div>

        <p className="text-white font-bold text-sm uppercase tracking-widest">
          ¡Cumpleaños!
        </p>

        {/* Name */}
        <h1 className="font-display text-7xl sm:text-8xl text-white font-bold leading-tight drop-shadow-lg">
          Mariana
        </h1>

        <p className="text-white/90 text-xl font-semibold">
          ¡Ven a celebrar mis 30 años!
        </p>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-1 h-px bg-white opacity-40" />
          <span className="text-white text-base">🎂</span>
          <div className="flex-1 h-px bg-white opacity-40" />
        </div>

        {/* Event details */}
        <div className="flex flex-col gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2">
            <Calendar size={16} className="text-white" />
            <span className="text-sm font-medium">Domingo, 10 de Agosto 2025</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={16} className="text-white" />
            <span className="text-sm font-medium">6:00 PM</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapPin size={16} className="text-white" />
            <span className="text-sm font-medium">Rooftop Bar Sky, Ciudad de México</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="w-full">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Faltan</p>
          <CountdownTimer targetDate="2026-08-10" />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a
            href={`https://wa.me/?text=${encodeURIComponent('¡Confirmo que voy al cumple de Mariana! 🎉🎂')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white text-[#F72585] hover:bg-pink-50 font-bold py-4 rounded-2xl text-center transition-all duration-200 shadow-lg"
          >
            ¡Confirmar que voy!
          </a>
          <WhatsAppShareButton
            message="¡Estás invitado/a al cumpleaños de Mariana! 🎉 Mira la invitación:"
            url={pageUrl}
            className="w-full justify-center"
          />
        </div>

        {/* Create own invitation */}
        <Link
          href="/crear"
          className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1 mt-4"
        >
          Crear tu propia invitación <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */

export default function InvitacionPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const invitation = getInvitation(slug)

  if (!invitation) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Invitación no encontrada</h1>
        <p className="text-gray-400 mb-8">
          Esta invitación no existe o ya expiró.
        </p>
        <Link
          href="/crear"
          className="bg-[#F72585] hover:bg-[#B5179E] text-white font-bold px-8 py-4 rounded-full transition-all duration-200"
        >
          Crear mi invitación
        </Link>
      </div>
    )
  }

  if (invitation.theme === 'xv') {
    return <XvInvitation />
  }

  if (invitation.theme === 'cumple') {
    return <CumpleInvitation />
  }

  return <BodaInvitation />
}
