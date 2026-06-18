import Link from 'next/link'
import { Check, X } from 'lucide-react'

function CheckItem({ text, included }: { text: string; included: boolean }) {
  return (
    <li className="flex items-start gap-3">
      {included ? (
        <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <X size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
      )}
      <span className={included ? 'text-sm' : 'text-sm line-through text-gray-400'}>
        {text}
      </span>
    </li>
  )
}

function WhiteCheckItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Check size={16} className="text-white flex-shrink-0 mt-0.5" />
      <span className="text-sm text-white/90">{text}</span>
    </li>
  )
}

export default function Pricing() {
  return (
    <section id="precios" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-3">
            Empieza gratis cuando quieras.
          </h2>
          <p className="text-xl text-gray-500">Sin contratos, sin sorpresas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Card 1 — Básico */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 flex flex-col gap-6">
            <div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Básico
              </span>
              <div className="mt-3">
                <span className="text-5xl font-bold text-[#1A1A2E]">$0</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">Para siempre gratis</p>
            </div>

            <ul className="flex flex-col gap-3">
              <CheckItem text="Manejo de invitados básico" included={true} />
              <CheckItem text="Máximo 5 invitados" included={true} />
              <CheckItem text="Vistas limitadas en la invitación" included={true} />
              <CheckItem text="Canción de Spotify o Apple Music" included={true} />
              <CheckItem text="Personaliza todos los bloques" included={true} />
              <CheckItem text="Invitados ilimitados" included={false} />
              <CheckItem text="Conservar invitación después de evento" included={false} />
              <CheckItem text="Ubicación del evento" included={true} />
              <CheckItem text="Marca de agua de teinvitaron" included={true} />
            </ul>

            <Link
              href="/crear"
              className="w-full bg-[#F72585] hover:bg-[#B5179E] text-white font-bold py-3 rounded-2xl text-center transition-all duration-200 text-sm"
            >
              ¡Crear invitación gratis!
            </Link>
          </div>

          {/* Card 2 — Premium (highlighted) */}
          <div className="relative bg-gradient-to-b from-amber-500 to-amber-600 rounded-3xl p-8 flex flex-col gap-6 scale-105 shadow-2xl shadow-amber-500/30">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-white text-amber-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                ⭐ MÁS POPULAR
              </span>
            </div>

            <div>
              <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                Premium
              </span>
              <div className="mt-3">
                <span className="text-5xl font-bold text-white">$599</span>
                <span className="text-white/80 ml-1">MXN</span>
              </div>
              <p className="text-white/70 text-sm mt-1">pago único por invitación</p>
            </div>

            <ul className="flex flex-col gap-3">
              <WhiteCheckItem text="Manejo de invitados avanzado" />
              <WhiteCheckItem text="Invitados ilimitados" />
              <WhiteCheckItem text="Visualizaciones ilimitadas" />
              <WhiteCheckItem text="Bloques premium ilimitados" />
              <WhiteCheckItem text="Mesa de regalos" />
              <WhiteCheckItem text="Ubicación con mapa" />
              <WhiteCheckItem text="Canción de Spotify / Apple Music" />
              <WhiteCheckItem text="Hospedaje sugerido" />
              <WhiteCheckItem text="Itinerario y Menciones Especiales" />
              <WhiteCheckItem text="Conservar invitación después de evento" />
              <WhiteCheckItem text="Sin marca de agua" />
            </ul>

            <Link
              href="/crear"
              className="w-full bg-white text-amber-600 hover:bg-amber-50 font-bold py-3 rounded-2xl text-center transition-all duration-200 text-sm"
            >
              ✨ Crear cuenta
            </Link>
          </div>

          {/* Card 3 — Planner */}
          <div className="bg-gradient-to-b from-violet-600 to-purple-700 rounded-3xl p-8 flex flex-col gap-6">
            <div>
              <span className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                Planner
              </span>
              <div className="mt-3">
                <span className="text-5xl font-bold text-white">$799</span>
                <span className="text-white/80 ml-1">MXN</span>
              </div>
              <p className="text-white/60 text-sm mt-1">Suscripción mensual</p>
            </div>

            <ul className="flex flex-col gap-3">
              <WhiteCheckItem text="Creación ilimitada de invitaciones" />
              <WhiteCheckItem text="Hasta 15 eventos concurrentes" />
              <WhiteCheckItem text="Invitados y vistas ilimitados" />
              <WhiteCheckItem text="Publicar perfil en web" />
              <WhiteCheckItem text="Todos los beneficios Premium" />
              <WhiteCheckItem text="Panel de control Planner" />
              <WhiteCheckItem text="Estadísticas avanzadas" />
              <WhiteCheckItem text="Soporte prioritario" />
              <WhiteCheckItem text="Badge de Planner certificado" />
            </ul>

            <Link
              href="/crear"
              className="w-full border-2 border-white text-white hover:bg-white hover:text-violet-700 font-bold py-3 rounded-2xl text-center transition-all duration-200 text-sm"
            >
              Conviértete en Planner
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
