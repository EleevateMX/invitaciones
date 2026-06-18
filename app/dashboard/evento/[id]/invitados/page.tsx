'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Loader2,
  Search,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Guest {
  id: string
  event_id: string
  nombre: string
  telefono: string | null
  email: string | null
  pases: number
  rsvp_status: 'pendiente' | 'confirmado' | 'declinado'
  mensaje: string | null
  respondio_at: string | null
  created_at: string
}

interface EventInfo {
  titulo: string
  slug: string
}

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  declinado: 'Declinado',
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-amber-50 text-amber-600 border-amber-200',
  confirmado: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  declinado: 'bg-red-50 text-red-500 border-red-200',
}

type TabFilter = 'todos' | 'confirmado' | 'pendiente' | 'declinado'

export default function InvitadosPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<TabFilter>('todos')
  const [search, setSearch] = useState('')

  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    pases: 1,
  })

  const fetchData = useCallback(async () => {
    const [eventRes, guestRes] = await Promise.all([
      supabase.from('inv_events').select('titulo, slug').eq('id', id).single(),
      supabase
        .from('inv_guests')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false }),
    ])

    if (eventRes.data) setEventInfo(eventRes.data)
    if (guestRes.data) setGuests(guestRes.data)
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function addGuest() {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    setSaving(true)
    setError(null)

    const { data, error: insertErr } = await supabase
      .from('inv_guests')
      .insert({
        event_id: id,
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim() || null,
        email: form.email.trim() || null,
        pases: form.pases,
        rsvp_status: 'pendiente',
      })
      .select()
      .single()

    if (insertErr || !data) {
      setError('Error al agregar el invitado: ' + insertErr?.message)
    } else {
      setGuests((prev) => [data, ...prev])
      setForm({ nombre: '', telefono: '', email: '', pases: 1 })
    }
    setSaving(false)
  }

  async function deleteGuest(guestId: string) {
    if (!window.confirm('¿Eliminar este invitado?')) return
    const { error: delErr } = await supabase
      .from('inv_guests')
      .delete()
      .eq('id', guestId)

    if (!delErr) {
      setGuests((prev) => prev.filter((g) => g.id !== guestId))
    }
  }

  async function updateStatus(guestId: string, status: Guest['rsvp_status']) {
    const { error: upErr } = await supabase
      .from('inv_guests')
      .update({ rsvp_status: status, respondio_at: new Date().toISOString() })
      .eq('id', guestId)

    if (!upErr) {
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guestId
            ? { ...g, rsvp_status: status, respondio_at: new Date().toISOString() }
            : g
        )
      )
    }
  }

  function exportCSV() {
    const header = 'Nombre,Teléfono,Email,Pases,Estado,Mensaje,Respondió\n'
    const rows = guests
      .map((g) =>
        [
          `"${g.nombre}"`,
          g.telefono ?? '',
          g.email ?? '',
          g.pases,
          STATUS_LABELS[g.rsvp_status],
          `"${g.mensaje ?? ''}"`,
          g.respondio_at ? new Date(g.respondio_at).toLocaleDateString('es-MX') : '',
        ].join(',')
      )
      .join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invitados-${eventInfo?.slug ?? id}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Stats
  const total = guests.length
  const confirmed = guests.filter((g) => g.rsvp_status === 'confirmado').length
  const declined = guests.filter((g) => g.rsvp_status === 'declinado').length
  const pending = guests.filter((g) => g.rsvp_status === 'pendiente').length
  const totalPases = guests.reduce((acc, g) => acc + (g.pases ?? 1), 0)

  // Filtered
  const filtered = guests
    .filter((g) => tab === 'todos' || g.rsvp_status === tab)
    .filter(
      (g) =>
        !search ||
        g.nombre.toLowerCase().includes(search.toLowerCase()) ||
        g.email?.toLowerCase().includes(search.toLowerCase()) ||
        g.telefono?.includes(search)
    )

  const inputClass =
    'border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#F72585] bg-white transition-colors'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F9] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#F72585]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F9] pb-24 lg:pb-10">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push(`/dashboard/evento/${id}`)}
            className="text-[#1A1A2E]/40 hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-[#1A1A2E] text-xl">
              Invitados — {eventInfo?.titulo ?? '...'}
            </h1>
            <p className="text-[#1A1A2E]/40 text-xs mt-0.5">
              Gestiona la lista y el RSVP de tus invitados
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total', value: total, color: 'text-[#1A1A2E]', icon: <Users size={14} /> },
            { label: 'Confirmados', value: confirmed, color: 'text-emerald-500', icon: <CheckCircle size={14} /> },
            { label: 'Declinados', value: declined, color: 'text-red-500', icon: <XCircle size={14} /> },
            { label: 'Pendientes', value: pending, color: 'text-amber-500', icon: <Clock size={14} /> },
            { label: 'Pases totales', value: totalPases, color: 'text-[#F72585]', icon: <Users size={14} /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
              <span className={color}>{icon}</span>
              <div>
                <p className="text-xs text-[#1A1A2E]/40">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add guest form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6">
          <h2 className="font-bold text-[#1A1A2E] text-sm mb-4">Agregar invitado</h2>
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Nombre *"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className={`${inputClass} flex-1 min-w-[140px]`}
              onKeyDown={(e) => e.key === 'Enter' && addGuest()}
            />
            <input
              type="tel"
              placeholder="Teléfono (sin +52)"
              value={form.telefono}
              onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
              className={`${inputClass} w-40`}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={`${inputClass} w-44`}
            />
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#1A1A2E]/50 font-medium">Pases:</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.pases}
                onChange={(e) => setForm((f) => ({ ...f, pases: parseInt(e.target.value) || 1 }))}
                className={`${inputClass} w-16 text-center`}
              />
            </div>
            <button
              onClick={addGuest}
              disabled={saving}
              className="flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Agregar
            </button>
          </div>
        </div>

        {/* Tab filter + search + export */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1">
            {(['todos', 'confirmado', 'pendiente', 'declinado'] as TabFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  tab === t
                    ? 'bg-[#F72585] text-white shadow-sm'
                    : 'text-[#1A1A2E]/50 hover:text-[#1A1A2E]'
                }`}
              >
                {t === 'todos' ? 'Todos' : STATUS_LABELS[t]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[180px]">
            <Search size={14} className="text-[#1A1A2E]/30 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar invitado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm border-0 outline-none text-[#1A1A2E] placeholder-[#1A1A2E]/30 bg-transparent"
            />
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-[#1A1A2E]/60 hover:text-[#1A1A2E] font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
          >
            <Download size={14} />
            Exportar CSV
          </button>
        </div>

        {/* Guests table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-3xl mb-3">👥</p>
            <p className="font-bold text-[#1A1A2E]">
              {search || tab !== 'todos'
                ? 'No se encontraron invitados con ese filtro'
                : 'Aún no hay invitados'}
            </p>
            <p className="text-[#1A1A2E]/40 text-sm mt-1">
              Usa el formulario de arriba para agregar invitados
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-[#1A1A2E]/40 px-4 py-3">
                      Invitado
                    </th>
                    <th className="text-left text-xs font-semibold text-[#1A1A2E]/40 px-4 py-3 hidden sm:table-cell">
                      Contacto
                    </th>
                    <th className="text-center text-xs font-semibold text-[#1A1A2E]/40 px-4 py-3">
                      Pases
                    </th>
                    <th className="text-center text-xs font-semibold text-[#1A1A2E]/40 px-4 py-3">
                      Estado
                    </th>
                    <th className="text-right text-xs font-semibold text-[#1A1A2E]/40 px-4 py-3">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((guest) => {
                    const phone = guest.telefono?.replace(/\D/g, '')
                    const waMsg = encodeURIComponent(
                      `¡Hola ${guest.nombre}! Te invito a ${eventInfo?.titulo ?? ''}. Confirma tu asistencia aquí: https://teinvitaron.site/invitacion/${eventInfo?.slug ?? ''}`
                    )
                    const waLink = phone
                      ? `https://wa.me/52${phone}?text=${waMsg}`
                      : null

                    return (
                      <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#1A1A2E] text-sm">{guest.nombre}</p>
                          {guest.mensaje && (
                            <p className="text-[#1A1A2E]/40 text-xs mt-0.5 max-w-[180px] truncate">
                              &ldquo;{guest.mensaje}&rdquo;
                            </p>
                          )}
                          {guest.respondio_at && (
                            <p className="text-[#1A1A2E]/30 text-[10px] mt-0.5">
                              Respondió: {new Date(guest.respondio_at).toLocaleDateString('es-MX')}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {guest.telefono && (
                            <p className="text-xs text-[#1A1A2E]/60">{guest.telefono}</p>
                          )}
                          {guest.email && (
                            <p className="text-xs text-[#1A1A2E]/40">{guest.email}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-sm font-bold text-[#1A1A2E]">{guest.pases}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={guest.rsvp_status}
                            onChange={(e) =>
                              updateStatus(guest.id, e.target.value as Guest['rsvp_status'])
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer focus:outline-none ${
                              STATUS_COLORS[guest.rsvp_status]
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="declinado">Declinado</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#25D366] hover:text-[#1da851] transition-colors"
                                title="Enviar WhatsApp"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                              </a>
                            )}
                            <button
                              onClick={() => deleteGuest(guest.id)}
                              className="text-[#1A1A2E]/20 hover:text-red-400 transition-colors"
                              title="Eliminar invitado"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
