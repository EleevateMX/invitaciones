'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Save,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Users,
  Calendar,
  Clock,
  MapPin,
  Music,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const EVENT_TYPES = [
  'Boda', 'XV Años', 'Cumpleaños', 'Bautizo', 'Baby Shower',
  'Graduación', 'Corporativo', 'Revelación de Género', 'Primera Comunión', 'Otro',
]

const THEMES = [
  { value: 'boda', label: 'Boda' },
  { value: 'xv', label: 'XV Años' },
  { value: 'cumple', label: 'Cumpleaños' },
  { value: 'bautizo', label: 'Bautizo' },
  { value: 'baby-shower', label: 'Baby Shower' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'graduacion', label: 'Graduación' },
  { value: 'revelacion', label: 'Revelación de Género' },
]

const themeGradient: Record<string, string> = {
  boda: 'from-stone-800 to-stone-900',
  xv: 'from-purple-900 to-fuchsia-950',
  cumple: 'from-orange-400 to-pink-500',
  bautizo: 'from-sky-200 to-blue-300',
  'baby-shower': 'from-emerald-200 to-teal-300',
  corporativo: 'from-slate-700 to-slate-900',
  graduacion: 'from-indigo-800 to-blue-900',
  revelacion: 'from-pink-300 to-blue-300',
}

interface EventData {
  id: string
  slug: string
  tipo: string
  titulo: string
  subtitulo: string
  organizacion: string
  intro: string
  fecha: string
  hora: string
  lugar: string
  ubicacion: string
  color: string
  theme: string
  activo: boolean
  show_ads: boolean
  dress_code: string
  gift_registry_url: string
  hotel_url: string
  music_url: string
  notes: string
  target_date: string
  owner_id: string
}

const EMPTY: EventData = {
  id: '', slug: '', tipo: 'Boda', titulo: '', subtitulo: '', organizacion: '',
  intro: '', fecha: '', hora: '', lugar: '', ubicacion: '', color: '#d8a24a',
  theme: 'boda', activo: true, show_ads: true, dress_code: '', gift_registry_url: '',
  hotel_url: '', music_url: '', notes: '', target_date: '', owner_id: '',
}

export default function EventEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<EventData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const supabase = createClient()

  const fetchEvent = useCallback(async () => {
    const { data, error } = await supabase
      .from('inv_events')
      .select('*')
      .eq('id', id)
      .single()
    if (error || !data) {
      setError('No se encontró la invitación')
    } else {
      setForm({
        ...EMPTY,
        ...data,
        titulo: data.titulo ?? '',
        subtitulo: data.subtitulo ?? '',
        organizacion: data.organizacion ?? '',
        intro: data.intro ?? '',
        fecha: data.fecha ?? '',
        hora: data.hora ?? '',
        lugar: data.lugar ?? '',
        ubicacion: data.ubicacion ?? '',
        color: data.color ?? '#d8a24a',
        dress_code: data.dress_code ?? '',
        gift_registry_url: data.gift_registry_url ?? '',
        hotel_url: data.hotel_url ?? '',
        music_url: data.music_url ?? '',
        notes: data.notes ?? '',
        target_date: data.target_date ?? '',
      })
    }
    setLoading(false)
  }, [id, supabase])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  function set(field: keyof EventData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const { error } = await supabase
      .from('inv_events')
      .update({
        tipo: form.tipo,
        titulo: form.titulo,
        subtitulo: form.subtitulo,
        organizacion: form.organizacion,
        intro: form.intro,
        fecha: form.fecha,
        hora: form.hora,
        lugar: form.lugar,
        ubicacion: form.ubicacion,
        color: form.color,
        theme: form.theme,
        activo: form.activo,
        show_ads: form.show_ads,
        dress_code: form.dress_code,
        gift_registry_url: form.gift_registry_url,
        hotel_url: form.hotel_url,
        music_url: form.music_url,
        notes: form.notes,
        target_date: form.target_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      setError('Error al guardar: ' + error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  function copySlug() {
    navigator.clipboard.writeText(`https://teinvitaron.site/invitacion/${form.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const previewBg = themeGradient[form.theme] ?? 'from-stone-800 to-stone-900'
  const isLightTheme = ['bautizo', 'baby-shower', 'revelacion'].includes(form.theme)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F9] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#F72585]" />
      </div>
    )
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#F72585] bg-white transition-colors'
  const labelClass = 'block text-xs font-semibold text-[#1A1A2E]/60 uppercase tracking-wider mb-1.5'

  return (
    <div className="min-h-screen bg-[#FFF5F9] pb-24 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-[#1A1A2E]/40 hover:text-[#1A1A2E] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-[#1A1A2E] text-xl">
                {form.titulo || 'Editar invitación'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[#1A1A2E]/40 text-xs font-mono truncate max-w-[200px]">
                  /invitacion/{form.slug}
                </span>
                <button onClick={copySlug} className="text-[#1A1A2E]/30 hover:text-[#F72585] transition-colors">
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/evento/${id}/invitados`}
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-[#1A1A2E]/60 font-semibold py-2 px-4 rounded-xl text-sm hover:border-[#F72585] hover:text-[#F72585] transition-colors"
            >
              <Users size={14} />
              Invitados
            </Link>
            <Link
              href={`/invitacion/${form.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-[#1A1A2E]/60 font-semibold py-2 px-4 rounded-xl text-sm hover:border-[#F72585] hover:text-[#F72585] transition-colors"
            >
              <ExternalLink size={14} />
              Ver
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold py-2 px-5 rounded-xl text-sm transition-all hover:shadow-lg disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} />
              ) : (
                <Save size={14} />
              )}
              {saved ? '¡Guardado!' : 'Guardar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Form — left */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-[#1A1A2E] text-sm mb-5">Información general</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Tipo de evento</label>
                    <select
                      value={form.tipo}
                      onChange={(e) => set('tipo', e.target.value)}
                      className={inputClass}
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Tema visual</label>
                    <select
                      value={form.theme}
                      onChange={(e) => set('theme', e.target.value)}
                      className={inputClass}
                    >
                      {THEMES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Título / Nombres</label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => set('titulo', e.target.value)}
                    placeholder="Ej: Ana & Carlos, Sofía Ramírez..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Subtítulo</label>
                  <input
                    type="text"
                    value={form.subtitulo}
                    onChange={(e) => set('subtitulo', e.target.value)}
                    placeholder="Ej: Se unen en matrimonio, XV Años..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Organización / Familia</label>
                  <input
                    type="text"
                    value={form.organizacion}
                    onChange={(e) => set('organizacion', e.target.value)}
                    placeholder="Ej: Familia García"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Mensaje de bienvenida / Intro</label>
                  <textarea
                    value={form.intro}
                    onChange={(e) => set('intro', e.target.value)}
                    placeholder="Ej: Con alegría en nuestros corazones..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-[#1A1A2E] text-sm mb-5">Fecha, hora y lugar</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1"><Calendar size={11} /> Fecha</span>
                    </label>
                    <input
                      type="text"
                      value={form.fecha}
                      onChange={(e) => set('fecha', e.target.value)}
                      placeholder="Ej: Sábado, 15 de Marzo 2026"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-1"><Clock size={11} /> Hora</span>
                    </label>
                    <input
                      type="text"
                      value={form.hora}
                      onChange={(e) => set('hora', e.target.value)}
                      placeholder="Ej: 7:00 PM"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1"><MapPin size={11} /> Lugar / Salón</span>
                  </label>
                  <input
                    type="text"
                    value={form.lugar}
                    onChange={(e) => set('lugar', e.target.value)}
                    placeholder="Ej: Salón La Perla"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Dirección / Ubicación</label>
                  <input
                    type="text"
                    value={form.ubicacion}
                    onChange={(e) => set('ubicacion', e.target.value)}
                    placeholder="Ej: Av. Reforma 123, Cancún, Q.R."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Fecha destino (cuenta regresiva)</label>
                  <input
                    type="date"
                    value={form.target_date}
                    onChange={(e) => set('target_date', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-[#1A1A2E] text-sm mb-5">Personalización</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div>
                    <label className={labelClass}>Color temático</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => set('color', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.color}
                        onChange={(e) => set('color', e.target.value)}
                        placeholder="#d8a24a"
                        className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1A1A2E] font-mono focus:outline-none focus:border-[#F72585]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Código de vestimenta</label>
                  <input
                    type="text"
                    value={form.dress_code}
                    onChange={(e) => set('dress_code', e.target.value)}
                    placeholder="Ej: Formal negro o blanco"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1"><Music size={11} /> Música (Spotify / Apple Music URL)</span>
                  </label>
                  <input
                    type="url"
                    value={form.music_url}
                    onChange={(e) => set('music_url', e.target.value)}
                    placeholder="https://open.spotify.com/..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1"><LinkIcon size={11} /> Mesa de regalos URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.gift_registry_url}
                    onChange={(e) => set('gift_registry_url', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-1"><LinkIcon size={11} /> Hospedaje URL</span>
                  </label>
                  <input
                    type="url"
                    value={form.hotel_url}
                    onChange={(e) => set('hotel_url', e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="font-bold text-[#1A1A2E] text-sm mb-5">Configuración</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">Invitación activa</p>
                    <p className="text-xs text-[#1A1A2E]/40">Los visitantes pueden verla</p>
                  </div>
                  <button
                    onClick={() => set('activo', !form.activo)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.activo ? 'bg-[#F72585]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        form.activo ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">Mostrar anuncios</p>
                    <p className="text-xs text-[#1A1A2E]/40">Plan básico — desactiva en plan Premium</p>
                  </div>
                  <button
                    onClick={() => set('show_ads', !form.show_ads)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.show_ads ? 'bg-amber-400' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        form.show_ads ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <label className={labelClass}>Notas internas (solo para ti)</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    placeholder="Notas privadas sobre este evento..."
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp share */}
            <div className="bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20 p-4">
              <p className="text-sm font-semibold text-[#1A1A2E] mb-2">Compartir por WhatsApp</p>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`¡Estás invitado/a a ${form.titulo}! Mira la invitación aquí: https://teinvitaron.site/invitacion/${form.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-6 rounded-xl text-sm hover:bg-[#1da851] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Compartir invitación
              </a>
            </div>
          </div>

          {/* Live preview — right */}
          <div className="lg:col-span-2">
            <div className="sticky top-6">
              <p className="text-xs font-semibold text-[#1A1A2E]/40 uppercase tracking-wider mb-3">
                Vista previa
              </p>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Phone frame */}
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div className="flex-1 bg-white rounded-lg h-5 mx-2 flex items-center px-2">
                    <span className="text-[9px] text-gray-400 truncate">
                      teinvitaron.site/invitacion/{form.slug}
                    </span>
                  </div>
                </div>

                <div
                  className={`bg-gradient-to-b ${previewBg} min-h-[360px] flex flex-col items-center justify-center px-6 py-8 text-center`}
                >
                  {/* Accent line */}
                  <div
                    className="w-12 h-0.5 mb-4 rounded-full"
                    style={{ background: form.color }}
                  />

                  {form.intro && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: form.color }}>
                      {form.intro}
                    </p>
                  )}

                  <h2
                    className={`font-serif text-2xl italic font-bold leading-tight mb-2 ${
                      isLightTheme ? 'text-[#1A1A2E]' : 'text-white'
                    }`}
                  >
                    {form.titulo || 'Título del evento'}
                  </h2>

                  {form.subtitulo && (
                    <p
                      className={`text-[10px] uppercase tracking-widest mb-4 ${
                        isLightTheme ? 'text-[#1A1A2E]/60' : 'text-white/60'
                      }`}
                    >
                      {form.subtitulo}
                    </p>
                  )}

                  <div
                    className="w-12 h-0.5 mb-4 rounded-full"
                    style={{ background: form.color }}
                  />

                  <div className="space-y-1.5">
                    {form.fecha && (
                      <p className={`text-xs ${isLightTheme ? 'text-[#1A1A2E]/70' : 'text-white/70'}`}>
                        📅 {form.fecha}
                      </p>
                    )}
                    {form.hora && (
                      <p className={`text-xs ${isLightTheme ? 'text-[#1A1A2E]/70' : 'text-white/70'}`}>
                        🕐 {form.hora}
                      </p>
                    )}
                    {form.lugar && (
                      <p className={`text-xs ${isLightTheme ? 'text-[#1A1A2E]/70' : 'text-white/70'}`}>
                        📍 {form.lugar}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 w-full">
                    <div
                      className="w-full py-2.5 rounded-xl text-[11px] font-bold"
                      style={{
                        background: form.color,
                        color: isLightTheme ? '#fff' : '#1A1A2E',
                      }}
                    >
                      Confirmar asistencia
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-[#1A1A2E]/30 mt-3">
                Vista previa simplificada · La invitación real puede verse distinta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
