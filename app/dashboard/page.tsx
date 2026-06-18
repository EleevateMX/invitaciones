import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Heart, Plus, Calendar, MapPin, Users, LogOut, ExternalLink } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar, plan')
    .eq('id', user.id)
    .single()

  const { data: invitations } = await supabase
    .from('inv_events')
    .select('id, slug, tipo, titulo, subtitulo, fecha, lugar, activo, created_at, theme')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  const planLabel: Record<string, string> = {
    basic: 'Plan Básico',
    premium: 'Premium',
    planner: 'Planner',
  }

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

  return (
    <div className="min-h-screen bg-[#FFF5F9]">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-1.5">
          <Heart size={20} className="text-primary fill-primary" />
          <span className="font-bold text-dark">teinvitaron<span className="text-primary">.site</span></span>
        </Link>

        <div className="flex items-center gap-3">
          {profile?.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar} alt="" className="w-8 h-8 rounded-full" />
          )}
          <span className="text-sm text-dark/70 hidden sm:block">
            {profile?.display_name ?? user.email}
          </span>
          <form action="/auth/signout" method="post">
            <Link
              href="/auth/signout"
              className="text-dark/40 hover:text-dark transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
            </Link>
          </form>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">
              Hola, {profile?.display_name?.split(' ')[0] ?? 'amigo/a'} 👋
            </h1>
            <p className="text-dark/50 text-sm mt-1">
              {planLabel[profile?.plan ?? 'basic']} &nbsp;·&nbsp;
              {invitations?.length ?? 0} invitación{(invitations?.length ?? 0) !== 1 ? 'es' : ''}
            </p>
          </div>
          <Link
            href="/crear"
            className="flex items-center gap-2 bg-primary hover:bg-secondary text-white font-bold py-2.5 px-5 rounded-full text-sm transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <Plus size={16} />
            Nueva invitación
          </Link>
        </div>

        {/* Invitations grid */}
        {!invitations?.length ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
            <div className="text-5xl mb-4">💌</div>
            <h2 className="text-xl font-bold text-dark mb-2">Aún no tienes invitaciones</h2>
            <p className="text-dark/50 text-sm mb-6">
              Crea tu primera invitación digital en menos de 5 minutos
            </p>
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-all"
            >
              <Plus size={16} />
              Crear mi primera invitación
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {invitations.map((inv) => {
              const gradient = themeGradient[inv.theme] ?? 'from-stone-800 to-stone-900'
              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Mini preview */}
                  <div className={`bg-gradient-to-b ${gradient} h-32 flex items-center justify-center`}>
                    <div className="text-center px-4">
                      <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">{inv.tipo}</p>
                      <p className="text-white font-bold text-sm truncate max-w-[180px]">{inv.titulo}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-dark text-sm truncate">{inv.titulo}</h3>
                        <p className="text-dark/50 text-xs">{inv.tipo}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${inv.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {inv.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {inv.fecha && (
                        <div className="flex items-center gap-1.5 text-dark/50 text-xs">
                          <Calendar size={11} />
                          {inv.fecha}
                        </div>
                      )}
                      {inv.lugar && (
                        <div className="flex items-center gap-1.5 text-dark/50 text-xs">
                          <MapPin size={11} />
                          <span className="truncate">{inv.lugar}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/invitacion/${inv.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#FFF5F9] hover:bg-primary/10 text-primary font-semibold py-2 rounded-xl text-xs transition-colors"
                        target="_blank"
                      >
                        <ExternalLink size={12} />
                        Ver
                      </Link>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`¡Estás invitado/a! Mira mi invitación: ${process.env.NEXT_PUBLIC_SITE_URL}/invitacion/${inv.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] font-semibold py-2 rounded-xl text-xs transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Compartir
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
