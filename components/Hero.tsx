'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#1A1A2E] via-[#2D1B4E] to-[#1A1A2E] flex items-center overflow-hidden pt-28 pb-16">
      {/* Golden particles */}
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#F72585] opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7209B7] opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex items-center self-start">
              <span className="border border-[#FFB700] text-[#FFB700] text-sm font-medium px-4 py-1.5 rounded-full">
                ✨ La invitación que todos querrán recibir
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Crea tu invitación{' '}
              <span className="bg-gradient-to-r from-[#F72585] to-[#FFB700] bg-clip-text text-transparent">
                digital
              </span>{' '}
              en minutos
            </h1>

            {/* Subheadline */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
              Comparte por WhatsApp y sorprende a todos tus invitados con una experiencia única
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/crear"
                className="bg-[#F72585] hover:bg-[#B5179E] text-white font-bold px-8 py-4 rounded-full text-lg text-center transition-all duration-200 shadow-lg hover:shadow-pink-500/30 hover:shadow-2xl"
              >
                ¡Crear invitación gratis!
              </Link>
              <Link
                href="/#ejemplos"
                className="border-2 border-white text-white hover:bg-white hover:text-[#1A1A2E] font-semibold px-8 py-4 rounded-full text-lg text-center transition-all duration-200"
              >
                Ver ejemplos
              </Link>
            </div>

            {/* Trust text */}
            <p className="text-gray-400 text-sm">
              Sin tarjeta de crédito • Plan gratuito disponible
            </p>
          </div>

          {/* Right side — Phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative animate-float">
              {/* Phone outer frame */}
              <div className="relative w-64 h-[32rem] bg-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden">
                {/* Top notch */}
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-900 flex items-center justify-center z-10">
                  <div className="w-20 h-4 bg-gray-800 rounded-full" />
                </div>

                {/* Invitation preview */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] via-[#2D1B4E] to-[#1A0A1E] flex flex-col items-center justify-center px-6 text-center pt-10">
                  {/* Decorative top */}
                  <div className="text-[#FFB700] text-xs tracking-widest mb-2 opacity-80">
                    ✦ ✧ ✦
                  </div>

                  <p className="text-[#FFB700] text-xs italic mb-3 opacity-90">
                    Con alegría en nuestros corazones
                  </p>

                  <h2 className="font-display text-3xl text-white tracking-widest leading-tight mb-2">
                    Ana
                  </h2>
                  <p className="text-[#FFB700] text-lg mb-1">&</p>
                  <h2 className="font-display text-3xl text-white tracking-widest leading-tight mb-4">
                    Carlos
                  </h2>

                  <p className="text-white/70 text-xs mb-4 italic">
                    Se unen en matrimonio
                  </p>

                  <div className="w-16 h-px bg-[#FFB700] opacity-50 mb-4" />

                  <p className="text-white/80 text-xs mb-1">Sábado, 15 de Marzo</p>
                  <p className="text-white/80 text-xs mb-1">7:00 PM</p>
                  <p className="text-white/60 text-xs mb-4">Cancún, México</p>

                  {/* Countdown mini boxes */}
                  <div className="flex gap-2 mb-4">
                    {['12', '08', '45', '30'].map((val, i) => (
                      <div key={i} className="bg-white/10 rounded-lg px-2 py-1 text-center">
                        <div className="text-[#FFB700] text-sm font-bold">{val}</div>
                        <div className="text-white/50 text-[8px]">
                          {['días', 'hrs', 'min', 'seg'][i]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA button in phone */}
                  <div className="bg-[#F72585] text-white text-xs font-semibold px-4 py-2 rounded-full">
                    Confirmar asistencia
                  </div>
                </div>

                {/* Bottom home indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                  <div className="w-24 h-1 bg-gray-600 rounded-full" />
                </div>
              </div>

              {/* Floating badges around phone */}
              <div className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl px-3 py-2 text-xs font-semibold text-gray-700">
                📱 WhatsApp listo
              </div>
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-3 py-2 text-xs font-semibold text-gray-700">
                ✅ 98% satisfechos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
