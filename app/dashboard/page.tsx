import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Edit2,
  CheckCircle,
  Clock,
  XCircle,
  Crown,
} from 'lucide-react'
import PushSubscribeButton from '@/components/PushSubscribeButton'

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

const planLabel: Record<string, string> = {
  basic: 'Básico',
  premium: 'Premium',
  planner: 'Planner',
}

const planColor: Record<string, string> = {
  basic: 'bg-gray-100 text-gray-600',
  premium: 'bg-amber-100 text-amber-700',
  planner: 'bg-purple-100 text-purple-700',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar, plan')
    .eq('id', user.id)
    .single()

  const { data: events } = await supabase
    .from('inv_events')
    .select('id, slug, tipo, titulo, subtitulo, fecha, lugar, activo, created_at, theme, owner_id')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Get guest stats for each event
  const eventIds = events?.map((e) => e.id) ?? []

  const { data: guestStats } = await supabase
    .from('inv_guests')
    .select('event_id, rsvp_status, pases')
    .in('event_id', eventIds.length > 0 ? eventIds : ['00000000-0000-0000-0000-000000000000'])

  // Build stats map per event
  const statsMap = new Map<string, { total: number; confirmed: number; declined: number; pending: number; pases: number }>()
  for (const g of guestStats ?? []) {
    const s = statsMap.get(g.event_id) ?? { total: 0, confirmed: 0, declined: 0, pending: 0, pases: 0 }
    s.total++
    s.pases += g.pases ?? 1
    if (g.rsvp_status === 'confirmado') s.confirmed++
    else if (g.rsvp_status === 'declinado') s.declined++
    else s.pending++
    statsMap.set(g.event_id, s)
  }

  // Totals
  const totalEvents = events?.length ?? 0
  const statValues = Array.from(statsMap.values())
  const totalConfirmed = statValues.reduce((acc, s) => acc + s.confirmed, 0)
  const totalGuests = statValues.reduce((acc, s) => acc + s.total, 0)
  const plan = profile?.plan ?? 'basic'

  const firstName = profile?.display_name?.split(' ')[0] ?? 'amigo/a'

  return (
    <div className="min-h-screen bg-[#FFF5F9] pb-24 lg:pb-10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">
              Hola, {firstName} 👋
            </h1>
            <p className="text-[#1A1A2E]/50 text-sm mt-1">
              Aquí están todas tus invitaciones digitales
            </p>
          </div>
          <Link
            href="/crear"
            className="flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold py-2.5 px-5 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-[#F72585]/30 flex-shrink-0"
          >
            <Plus size={16} />
            Nueva
          </Link>
        </div>

        {/* Push notification prompt */}
        <div className="mb-6 bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="font-semibold text-[#1A1A2E] text-sm">
              Recibe alertas cuando alguien confirme asistencia
            </p>
            <p className="text-[#1A1A2E]/50 text-xs mt-0.5">
              Activa las notificaciones push para estar al tanto
            </p>
          </div>
          <PushSubscribeButton variant="compact" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-[#1A1A2E]/40 text-xs uppercase tracking-wider mb-2">Invitaciones</p>
            <p className="text-3xl font-bold text-[#1A1A2E]">{totalEvents}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-[#1A1A2E]/40 text-xs uppercase tracking-wider mb-2">Confirmados</p>
            <p className="text-3xl font-bold text-emerald-500">{totalConfirmed}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-[#1A1A2E]/40 text-xs uppercase tracking-wider mb-2">Invitados</p>
            <p className="text-3xl font-bold text-[#1A1A2E]">{totalGuests}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-3">
            <Crown size={24} className={plan === 'basic' ? 'text-gray-400' : plan === 'premium' ? 'text-amber-500' : 'text-purple-500'} />
            <div>
              <p className="text-[#1A1A2E]/40 text-xs uppercase tracking-wider">Plan</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${planColor[plan]}`}>
                {planLabel[plan]}
              </span>
            </div>
          </div>
        </div>

        {/* Invitations grid */}
        {!events?.length ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="text-5xl mb-4">💌</div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">
              Aún no tienes invitaciones
            </h2>
            <p className="text-[#1A1A2E]/50 text-sm mb-6">
              Crea tu primera invitación digital en menos de 5 minutos
            </p>
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold py-3 px-8 rounded-full transition-all hover:shadow-lg"
            >
              <Plus size={16} />
              Crear mi primera invitación
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {events.map((inv) => {
              const gradient = themeGradient[inv.theme] ?? 'from-stone-800 to-stone-900'
              const stats = statsMap.get(inv.id) ?? {
                total: 0, confirmed: 0, declined: 0, pending: 0, pases: 0,
              }
              const waText = encodeURIComponent(
                `¡Estás invitado/a a ${inv.titulo}! Mira la invitación: https://teinvitaron.site/invitacion/${inv.slug}`
              )

              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Mini preview */}
                  <div
                    className={`bg-gradient-to-b ${gradient} h-28 flex items-center justify-center relative`}
                  >
                    <div className="text-center px-4">
                      <p className="text-white/50 text-[10px] uppercase tracking-widest mb-1">
                        {inv.tipo}
                      </p>
                      <p className="text-white font-bold text-sm truncate max-w-[200px]">
                        {inv.titulo}
                      </p>
                    </div>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        inv.activo
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {inv.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-[#1A1A2E] text-sm truncate">{inv.titulo}</h3>
                      <p className="text-[#1A1A2E]/40 text-xs">{inv.tipo}</p>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {inv.fecha && (
                        <div className="flex items-center gap-1.5 text-[#1A1A2E]/50 text-xs">
                          <Calendar size={11} />
                          {inv.fecha}
                        </div>
                      )}
                      {inv.lugar && (
                        <div className="flex items-center gap-1.5 text-[#1A1A2E]/50 text-xs">
                          <MapPin size={11} />
                          <span className="truncate">{inv.lugar}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats pills */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                        <CheckCircle size={9} />
                        {stats.confirmed} confirm.
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-600 px-2 py-1 rounded-full">
                        <Clock size={9} />
                        {stats.pending} pend.
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold bg-gray-50 text-gray-500 px-2 py-1 rounded-full">
                        <Users size={9} />
                        {stats.total} total
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/invitacion/${inv.slug}`}
                        target="_blank"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#FFF5F9] hover:bg-[#F72585]/10 text-[#F72585] font-semibold py-2 rounded-xl text-xs transition-colors"
                      >
                        <ExternalLink size={12} />
                        Ver
                      </Link>
                      <a
                        href={`https://wa.me/?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold py-2 rounded-xl text-xs transition-colors"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Compartir
                      </a>
                      <Link
                        href={`/dashboard/evento/${inv.id}`}
                        className="flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-[#1A1A2E]/60 py-2 px-3 rounded-xl text-xs transition-colors"
                      >
                        <Edit2 size={12} />
                      </Link>
                    </div>

                    {/* Invitados link */}
                    <Link
                      href={`/dashboard/evento/${inv.id}/invitados`}
                      className="mt-2 flex items-center justify-center gap-1 text-[#1A1A2E]/40 hover:text-[#F72585] text-xs transition-colors py-1.5"
                    >
                      <Users size={11} />
                      Gestionar invitados
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
