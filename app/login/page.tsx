'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Heart, Check } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleLogin() {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) {
      setError('No pudimos conectar con Google. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F1A] via-[#1A1A2E] to-[#0F0F1A] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#F72585' : i % 3 === 1 ? '#FFB700' : '#B5179E',
              opacity: Math.random() * 0.4 + 0.1,
              animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Pink glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F72585]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FFB700]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-2.5 mb-8 group">
            <div className="w-10 h-10 bg-[#F72585] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F72585]/30 group-hover:scale-105 transition-transform">
              <Heart size={20} className="text-white fill-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">
              teinvitaron<span className="text-[#F72585]">.site</span>
            </span>
          </Link>

          <h1 className="text-white text-3xl font-bold text-center mb-3 leading-tight">
            La invitación que enamora
          </h1>
          <p className="text-white/50 text-center text-sm leading-relaxed max-w-xs">
            Inicia sesión para crear y compartir invitaciones digitales únicas
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          {error && (
            <div className="mb-5 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-black/20 disabled:opacity-60 disabled:cursor-not-allowed text-[15px]"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin text-gray-400" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          {/* Trust badges */}
          <div className="mt-5 flex items-center justify-center gap-4 flex-wrap">
            {['Gratis para empezar', 'Sin tarjeta', 'Cientos de diseños'].map((item) => (
              <span key={item} className="flex items-center gap-1 text-white/40 text-xs">
                <Check size={10} className="text-emerald-400" />
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-white/30 text-xs leading-relaxed">
              Al continuar, aceptas nuestros{' '}
              <Link href="#" className="text-white/50 hover:text-white underline underline-offset-2 transition-colors">
                Términos de uso
              </Link>{' '}
              y{' '}
              <Link href="#" className="text-white/50 hover:text-white underline underline-offset-2 transition-colors">
                Privacidad
              </Link>
            </p>
          </div>
        </div>

        {/* Features row */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '✨', label: 'Diseños únicos', sub: 'Cientos de plantillas' },
            { icon: '📱', label: 'Comparte fácil', sub: 'Directo a WhatsApp' },
            { icon: '🎉', label: 'Lista en 5 min', sub: 'Sin complicaciones' },
          ].map(({ icon, label, sub }) => (
            <div
              key={label}
              className="bg-white/3 border border-white/8 rounded-2xl p-3 flex flex-col items-center gap-1"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-white/70 text-xs font-semibold leading-tight">{label}</span>
              <span className="text-white/30 text-[10px] leading-tight">{sub}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-white/30 hover:text-white/60 text-sm transition-colors inline-flex items-center gap-1.5"
          >
            <span>←</span> Volver al inicio
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}
