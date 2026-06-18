'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Users,
  LayoutGrid,
  Bell,
  Eye,
  MousePointer,
  Plus,
  Trash2,
  Loader2,
  X,
  Check,
  Crown,
  Activity,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_PUSH_OP_KEY ?? 'teinvitaron-push-2026'

interface Ad {
  id: string
  slot: 'banner_top' | 'banner_mid' | 'banner_bottom'
  title: string
  description: string | null
  image_url: string | null
  target_url: string
  active: boolean
  clicks: number
  impressions: number
  starts_at: string | null
  ends_at: string | null
}

interface Stats {
  total_users: number
  total_events: number
  total_guests: number
  confirmed: number
}

type Tab = 'overview' | 'ads' | 'users' | 'push'

const slotLabels: Record<string, string> = {
  banner_top: 'Banner Superior',
  banner_mid: 'Banner Medio',
  banner_bottom: 'Banner Inferior',
}

export default function OpsPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_events: 0,
    total_guests: 0,
    confirmed: 0,
  })
  const [ads, setAds] = useState<Ad[]>([])
  const [users, setUsers] = useState<Array<{
    id: string
    display_name: string | null
    plan: string
    created_at: string
  }>>([])
  const [pushCount, setPushCount] = useState(0)

  const [newAd, setNewAd] = useState({
    slot: 'banner_top' as Ad['slot'],
    title: '',
    description: '',
    image_url: '',
    target_url: '',
  })
  const [savingAd, setSavingAd] = useState(false)
  const [showAdForm, setShowAdForm] = useState(false)
  const [pushMessage, setPushMessage] = useState({ title: '', body: '' })
  const [sendingPush, setSendingPush] = useState(false)
  const [pushResult, setPushResult] = useState<string | null>(null)

  const supabase = createClient()

  function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'TI-Admin2026!') {
      setAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Contraseña incorrecta')
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    const [profilesRes, eventsRes, guestsRes, adsRes, pushRes] = await Promise.all([
      supabase.from('profiles').select('id, display_name, plan, created_at').order('created_at', { ascending: false }),
      supabase.from('inv_events').select('id', { count: 'exact', head: true }),
      supabase.from('inv_guests').select('id, rsvp_status', { count: 'exact' }),
      supabase.from('inv_ads').select('*').order('created_at', { ascending: false }),
      supabase.from('inv_push_subs').select('endpoint', { count: 'exact', head: true }),
    ])

    const totalUsers = profilesRes.data?.length ?? 0
    const totalEvents = eventsRes.count ?? 0
    const totalGuests = guestsRes.data?.length ?? 0
    const confirmed = guestsRes.data?.filter((g) => g.rsvp_status === 'confirmado').length ?? 0

    setStats({ total_users: totalUsers, total_events: totalEvents, total_guests: totalGuests, confirmed })
    setAds(adsRes.data ?? [])
    setUsers(profilesRes.data ?? [])
    setPushCount(pushRes.count ?? 0)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    if (authed) loadData()
  }, [authed, loadData])

  async function handleCreateAd(e: React.FormEvent) {
    e.preventDefault()
    if (!newAd.title || !newAd.target_url) return
    setSavingAd(true)
    const { data, error } = await supabase
      .from('inv_ads')
      .insert({
        slot: newAd.slot,
        title: newAd.title,
        description: newAd.description || null,
        image_url: newAd.image_url || null,
        target_url: newAd.target_url,
        active: true,
        clicks: 0,
        impressions: 0,
      })
      .select()
      .single()
    setSavingAd(false)
    if (!error && data) {
      setAds((prev) => [data, ...prev])
      setNewAd({ slot: 'banner_top', title: '', description: '', image_url: '', target_url: '' })
      setShowAdForm(false)
    }
  }

  async function toggleAd(id: string, active: boolean) {
    await supabase.from('inv_ads').update({ active: !active }).eq('id', id)
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, active: !active } : a))
  }

  async function deleteAd(id: string) {
    if (!window.confirm('¿Eliminar este anuncio?')) return
    await supabase.from('inv_ads').delete().eq('id', id)
    setAds((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleChangePlan(userId: string, plan: string) {
    await supabase.from('profiles').update({ plan }).eq('id', userId)
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, plan } : u))
  }

  async function handleSendPush(e: React.FormEvent) {
    e.preventDefault()
    if (!pushMessage.title) return
    setSendingPush(true)
    setPushResult(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-push-inv`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-op-key': ADMIN_SECRET,
          },
          body: JSON.stringify({
            title: pushMessage.title,
            body: pushMessage.body,
          }),
        }
      )
      const json = await res.json()
      setPushResult(res.ok ? `Enviado a ${json.sent ?? '?'} dispositivos` : `Error: ${json.error ?? 'desconocido'}`)
    } catch {
      setPushResult('Error de conexión')
    } finally {
      setSendingPush(false)
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#0F0F1A] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">Panel Ops</span>
          </div>

          <form onSubmit={handleAuth} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-white font-bold text-xl mb-6 text-center">Acceso restringido</h2>

            {authError && (
              <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {authError}
              </div>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de administrador"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-500 mb-4"
              autoFocus
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Resumen', icon: <Activity size={16} /> },
    { id: 'ads', label: 'Anuncios', icon: <LayoutGrid size={16} /> },
    { id: 'users', label: 'Usuarios', icon: <Users size={16} /> },
    { id: 'push', label: 'Push', icon: <Bell size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white">
      {/* Header */}
      <header className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-purple-400" />
          <span className="font-bold text-white">Panel Ops — teinvitaron.site</span>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="text-white/40 hover:text-white/70 transition-colors text-xs flex items-center gap-1"
        >
          <X size={14} />
          Salir
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-4">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && tab === 'overview' ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-purple-400" size={32} />
          </div>
        ) : null}

        {/* Overview */}
        {tab === 'overview' && !loading && (
          <div>
            <h2 className="text-lg font-bold mb-6">Resumen general</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Usuarios', value: stats.total_users, icon: <Users size={20} />, color: 'text-blue-400' },
                { label: 'Invitaciones', value: stats.total_events, icon: <LayoutGrid size={20} />, color: 'text-purple-400' },
                { label: 'Invitados', value: stats.total_guests, icon: <Users size={20} />, color: 'text-pink-400' },
                { label: 'Confirmados', value: stats.confirmed, icon: <Check size={20} />, color: 'text-emerald-400' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className={`${color} mb-3`}>{icon}</div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-sm mb-2">Suscriptores push</p>
                <p className="text-2xl font-bold text-blue-400">{pushCount}</p>
                <p className="text-white/30 text-xs mt-1">dispositivos con notificaciones activas</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-sm mb-2">Anuncios activos</p>
                <p className="text-2xl font-bold text-amber-400">{ads.filter((a) => a.active).length}</p>
                <p className="text-white/30 text-xs mt-1">de {ads.length} anuncios totales</p>
              </div>
            </div>
          </div>
        )}

        {/* Ads */}
        {tab === 'ads' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Gestión de anuncios</h2>
              <button
                onClick={() => setShowAdForm(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <Plus size={14} />
                Nuevo anuncio
              </button>
            </div>

            {showAdForm && (
              <form
                onSubmit={handleCreateAd}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
              >
                <h3 className="font-bold mb-4">Crear anuncio</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Posición</label>
                    <select
                      value={newAd.slot}
                      onChange={(e) => setNewAd({ ...newAd, slot: e.target.value as Ad['slot'] })}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="banner_top">Banner Superior</option>
                      <option value="banner_mid">Banner Medio</option>
                      <option value="banner_bottom">Banner Inferior</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Título *</label>
                    <input
                      type="text"
                      value={newAd.title}
                      onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                      placeholder="Título del anuncio"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">Descripción</label>
                    <input
                      type="text"
                      value={newAd.description}
                      onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                      placeholder="Descripción breve"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">URL de imagen</label>
                    <input
                      type="url"
                      value={newAd.image_url}
                      onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/40 mb-1 block">URL destino *</label>
                    <input
                      type="url"
                      value={newAd.target_url}
                      onChange={(e) => setNewAd({ ...newAd, target_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAdForm(false)}
                    className="flex-1 border border-white/20 text-white/60 font-semibold py-2.5 rounded-xl text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingAd}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {savingAd && <Loader2 size={14} className="animate-spin" />}
                    Crear anuncio
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {ads.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                  <p className="text-white/30">No hay anuncios creados</p>
                </div>
              ) : (
                ads.map((ad) => (
                  <div
                    key={ad.id}
                    className={`bg-white/5 border rounded-2xl p-5 flex items-center gap-4 transition-all ${
                      ad.active ? 'border-white/10' : 'border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">
                          {slotLabels[ad.slot]}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            ad.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/40'
                          }`}
                        >
                          {ad.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="font-semibold text-white text-sm truncate">{ad.title}</p>
                      {ad.description && (
                        <p className="text-white/40 text-xs truncate">{ad.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-center hidden sm:block">
                        <div className="flex items-center gap-1 text-blue-300 text-xs">
                          <Eye size={11} />
                          <span className="font-semibold">{ad.impressions}</span>
                        </div>
                        <p className="text-white/30 text-[10px]">views</p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <div className="flex items-center gap-1 text-amber-300 text-xs">
                          <MousePointer size={11} />
                          <span className="font-semibold">{ad.clicks}</span>
                        </div>
                        <p className="text-white/30 text-[10px]">clicks</p>
                      </div>
                      <button
                        onClick={() => toggleAd(ad.id, ad.active)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          ad.active
                            ? 'bg-white/10 hover:bg-white/20 text-white/60'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                        }`}
                      >
                        {ad.active ? 'Pausar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => deleteAd(ad.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <h2 className="text-lg font-bold mb-6">Usuarios ({users.length})</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs text-white/40 px-4 py-3 font-semibold">Usuario</th>
                      <th className="text-center text-xs text-white/40 px-4 py-3 font-semibold">Plan</th>
                      <th className="text-right text-xs text-white/40 px-4 py-3 font-semibold">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-white text-sm">
                            {u.display_name ?? 'Sin nombre'}
                          </p>
                          <p className="text-white/30 text-xs font-mono">{u.id.slice(0, 8)}…</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={u.plan ?? 'basic'}
                            onChange={(e) => handleChangePlan(u.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${
                              u.plan === 'premium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : u.plan === 'planner'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-white/10 text-white/50'
                            }`}
                          >
                            <option value="basic">Básico</option>
                            <option value="premium">Premium</option>
                            <option value="planner">Planner</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="text-white/40 text-xs">
                            {new Date(u.created_at).toLocaleDateString('es-MX')}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Push */}
        {tab === 'push' && (
          <div className="max-w-lg">
            <h2 className="text-lg font-bold mb-6">Notificaciones push</h2>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-blue-400" />
                <div>
                  <p className="text-white/40 text-xs">Suscriptores activos</p>
                  <p className="text-3xl font-bold text-blue-400">{pushCount}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendPush} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Enviar notificación a todos</h3>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Título *</label>
                  <input
                    type="text"
                    value={pushMessage.title}
                    onChange={(e) => setPushMessage({ ...pushMessage, title: e.target.value })}
                    placeholder="Ej: ¡Nueva plantilla disponible!"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Mensaje</label>
                  <textarea
                    value={pushMessage.body}
                    onChange={(e) => setPushMessage({ ...pushMessage, body: e.target.value })}
                    placeholder="Mensaje opcional..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>

              {pushResult && (
                <div className="mb-4 text-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/70">
                  {pushResult}
                </div>
              )}

              <button
                type="submit"
                disabled={sendingPush || !pushMessage.title}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
              >
                {sendingPush ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Bell size={14} />
                )}
                {sendingPush ? 'Enviando...' : `Enviar a ${pushCount} dispositivos`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
