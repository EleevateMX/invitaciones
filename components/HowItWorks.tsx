import Link from 'next/link'
import { Palette, Settings2, MessageCircle } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    title: 'Elige tu diseño',
    description: 'Selecciona entre cientos de plantillas para tu tipo de evento',
    icon: Palette,
  },
  {
    number: '02',
    title: 'Personaliza',
    description: 'Agrega tus datos, fotos, música de Spotify y más detalles',
    icon: Settings2,
  },
  {
    number: '03',
    title: 'Comparte por WhatsApp',
    description: 'Envía el link a todos tus invitados con un toque',
    icon: MessageCircle,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#FFF5F9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Así de fácil es crear tu invitación
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            En tres pasos sencillos tendrás tu invitación lista para compartir
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative flex-1 flex flex-col items-center text-center px-4">
                {/* Connector line between steps (desktop only) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-14 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#F72585] to-transparent z-0" />
                )}

                {/* Step number circle */}
                <div className="relative z-10 w-12 h-12 rounded-full bg-[#F72585] flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg shadow-pink-500/30">
                  {step.number}
                </div>

                {/* Icon circle */}
                <div className="w-16 h-16 rounded-full bg-[#1A1A2E] flex items-center justify-center mb-6 shadow-xl">
                  <Icon className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/crear"
            className="inline-flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-pink-500/30 hover:shadow-2xl"
          >
            ¡Crear mi invitación ahora!
          </Link>
        </div>
      </div>
    </section>
  )
}
