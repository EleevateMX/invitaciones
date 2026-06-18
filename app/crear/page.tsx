'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Crown,
  Cake,
  Droplets,
  GraduationCap,
  Star,
  Briefcase,
  Baby,
  Gift,
  HelpCircle,
  X,
  Loader2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

const EVENT_TYPES = [
  { name: 'Boda', icon: Heart, slug: 'boda', theme: 'boda' },
  { name: 'XV Años', icon: Crown, slug: 'xv-anos', theme: 'xv' },
  { name: 'Cumpleaños', icon: Cake, slug: 'cumpleanos', theme: 'cumple' },
  { name: 'Bautizo', icon: Droplets, slug: 'bautizo', theme: 'bautizo' },
  { name: 'Graduación', icon: GraduationCap, slug: 'graduacion', theme: 'graduacion' },
  { name: 'Primera Comunión', icon: Star, slug: 'primera-comunion', theme: 'boda' },
  { name: 'Corporativo', icon: Briefcase, slug: 'corporativo', theme: 'corporativo' },
  { name: 'Revelación de Género', icon: Baby, slug: 'revelacion-genero', theme: 'revelacion' },
  { name: 'Baby Shower', icon: Gift, slug: 'baby-shower', theme: 'baby-shower' },
  { name: 'Otro', icon: HelpCircle, slug: 'otro', theme: 'boda' },
]

interface SelectedEvent {
  name: string
  theme: string
}

export default function CrearPage() {
  const router = useRouter()
  const supabase = createClient()
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null)
  const [eventName, setEventName] = useState('')
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [supabase])

  function openModal(event: typeof EVENT_TYPES[0]) {
    setSelectedEvent({ name: event.name, theme: event.theme })
    setEventName('')
  }

  function closeModal() {
    setSelectedEvent(null)
  }

  async function handleVerPlantillas() {
    if (!selectedEvent) return

    // Not logged in → go to demo
    if (!user) {
      const demoMap: Record<string, string> = {
        boda: 'demo-boda', xv: 'demo-xv', cumple: 'demo-cumple',
      }
      router.push(`/invitacion/${demoMap[selectedEvent.theme] ?? 'demo-boda'}`)
      return
    }

    setSaving(true)
    const { data, error } = await supabase
      .from('inv_events')
      .insert({
        owner_id: user.id,
        tipo: selectedEvent.name,
        theme: selectedEvent.theme,
        titulo: eventName || selectedEvent.name,
        subtitulo: '',
        activo: true,
      })
      .select('slug')
      .single()

    setSaving(false)
    if (error || !data) {
      alert('Ocurrió un error. Intenta de nuevo.')
      return
    }
    router.push(`/invitacion/${data.slug}`)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FFF5F9] pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A2E] mb-4">
              Selecciona el tipo de evento
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Elige el tipo de evento para ver las plantillas disponibles
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {EVENT_TYPES.map((event) => {
              const Icon = event.icon
              return (
                <button
                  key={event.slug}
                  onClick={() => openModal(event)}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 text-center hover:border-[#F72585] hover:border-2 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                    <Icon className="text-[#F72585]" size={26} />
                  </div>
                  <span className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#F72585] transition-colors leading-tight">
                    {event.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </main>

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
              ¡Mira tu invitación con tu nombre puesto!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Escribe el nombre del evento o festejado(a) para personalizar la vista previa
            </p>

            <div className="mb-6">
              <label
                htmlFor="event-name"
                className="block text-sm font-semibold text-[#1A1A2E] mb-2"
              >
                Nombre del evento o festejado(a)
              </label>
              <input
                id="event-name"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder={`Ej: Mi ${selectedEvent.name} soñada`}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F72585] transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 border-2 border-gray-200 text-gray-500 hover:border-gray-300 font-semibold px-4 py-3 rounded-xl text-sm transition-all duration-200"
              >
                Ahora no
              </button>
              <button
                onClick={handleVerPlantillas}
                disabled={saving}
                className="flex-1 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {user ? 'Crear invitación' : 'Ver vista previa'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
