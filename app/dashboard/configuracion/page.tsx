import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Crown, Shield, Trash2 } from 'lucide-react'
import PushSubscribeButton from '@/components/PushSubscribeButton'

const planDetails: Record<string, { label: string; color: string; features: string[] }> = {
  basic: {
    label: 'Básico',
    color: 'bg-gray-100 text-gray-700',
    features: ['1 invitación activa', 'Diseños básicos', 'Anuncios visibles'],
  },
  premium: {
    label: 'Premium',
    color: 'bg-amber-100 text-amber-700',
    features: ['5 invitaciones activas', 'Todos los diseños', 'Sin anuncios', 'Dominio personalizado'],
  },
  planner: {
    label: 'Planner',
    color: 'bg-purple-100 text-purple-700',
    features: ['Invitaciones ilimitadas', 'Todos los diseños', 'Sin anuncios', 'Soporte prioritario', 'Lista de invitados ilimitada'],
  },
}

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar, plan, role')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'basic'
  const planInfo = planDetails[plan] ?? planDetails.basic

  return (
    <div className="min-h-screen bg-[#FFF5F9] pb-24 lg:pb-10">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#1A1A2E] mb-8">Configuración</h1>

        {/* Profile section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5">
          <h2 className="font-bold text-[#1A1A2E] text-sm mb-5">Perfil</h2>
          <div className="flex items-center gap-4">
            {profile?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt={profile.display_name ?? 'Avatar'}
                className="w-16 h-16 rounded-full border-2 border-gray-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#F72585]/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#F72585]">
                  {(profile?.display_name ?? user.email ?? 'U')[0].toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-[#1A1A2E] text-lg">
                {profile?.display_name ?? 'Sin nombre'}
              </p>
              <p className="text-[#1A1A2E]/50 text-sm">{user.email}</p>
              <p className="text-[#1A1A2E]/30 text-xs mt-1">
                Avatar sincronizado con Google · No editable
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs text-[#1A1A2E]/40">
              Tu nombre se muestra como aparece en tu cuenta de Google.
              Para cambiarlo, actualiza tu perfil en Google y vuelve a iniciar sesión.
            </p>
          </div>
        </div>

        {/* Plan section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#1A1A2E] text-sm">Plan actual</h2>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${planInfo.color}`}>
              {planInfo.label}
            </span>
          </div>

          <ul className="space-y-2 mb-5">
            {planInfo.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[#1A1A2E]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F72585] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {plan === 'basic' && (
            <Link
              href="/precios"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#F72585] to-[#B5179E] text-white font-bold py-3 px-6 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-md shadow-[#F72585]/20"
            >
              <Crown size={16} />
              Mejorar a Premium
            </Link>
          )}

          {plan !== 'basic' && (
            <p className="text-center text-xs text-[#1A1A2E]/40">
              Gracias por ser parte de teinvitaron.site
            </p>
          )}
        </div>

        {/* Push notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5">
          <h2 className="font-bold text-[#1A1A2E] text-sm mb-2">Notificaciones push</h2>
          <p className="text-[#1A1A2E]/50 text-xs mb-5">
            Recibe una notificación cuando alguien confirme asistencia a tus invitaciones,
            incluso cuando no tengas la app abierta.
          </p>
          <PushSubscribeButton />
        </div>

        {/* Admin link */}
        {profile?.role === 'admin' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-5">
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-purple-500" />
              <div>
                <p className="font-bold text-[#1A1A2E] text-sm">Panel de administración</p>
                <p className="text-[#1A1A2E]/40 text-xs">Tienes acceso de administrador</p>
              </div>
            </div>
            <Link
              href="/ops"
              className="mt-4 flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2.5 px-5 rounded-xl text-sm transition-colors"
            >
              <Shield size={14} />
              Ir al panel admin
            </Link>
          </div>
        )}

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={16} className="text-red-400" />
            <h2 className="font-bold text-red-500 text-sm">Zona de peligro</h2>
          </div>
          <p className="text-[#1A1A2E]/50 text-xs mb-4">
            Eliminar tu cuenta borrará permanentemente todos tus datos, invitaciones y lista de invitados.
            Esta acción no se puede deshacer.
          </p>
          <button
            disabled
            className="flex items-center gap-2 bg-red-50 text-red-400 font-semibold py-2.5 px-5 rounded-xl text-sm border border-red-100 cursor-not-allowed opacity-60"
          >
            <Trash2 size={14} />
            Eliminar cuenta (próximamente)
          </button>
        </div>
      </div>
    </div>
  )
}
