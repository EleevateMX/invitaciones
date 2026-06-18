import Link from 'next/link'

const EXAMPLES = [
  {
    id: 1,
    type: 'Boda',
    slug: 'demo-boda',
    gradient: 'bg-gradient-to-b from-stone-800 to-stone-900',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-amber-400 text-xs tracking-widest mb-3">✦ ✧ ✦</div>
        <p className="text-amber-300 text-xs italic mb-2">Con alegría en nuestros corazones</p>
        <div className="w-12 h-px bg-amber-400 opacity-50 mb-4" />
        <h3 className="font-display text-3xl text-white tracking-widest leading-tight mb-1">Ana</h3>
        <p className="text-amber-400 text-lg">&</p>
        <h3 className="font-display text-3xl text-white tracking-widest leading-tight mb-4">Carlos</h3>
        <p className="text-white/60 text-xs mb-3 italic">Se unen en matrimonio</p>
        <div className="w-12 h-px bg-amber-400 opacity-50 mb-3" />
        <p className="text-white/70 text-xs">15 de Marzo • 7:00 PM</p>
        <p className="text-white/50 text-xs mt-1">Cancún, México</p>
      </div>
    ),
  },
  {
    id: 2,
    type: 'XV Años',
    slug: 'demo-xv',
    gradient: 'bg-gradient-to-b from-purple-900 to-pink-900',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6 relative">
        <div className="absolute top-4 left-4 text-yellow-300 text-lg animate-twinkle">★</div>
        <div className="absolute top-8 right-6 text-yellow-300 text-sm animate-twinkle" style={{ animationDelay: '0.5s' }}>✦</div>
        <div className="absolute bottom-16 left-6 text-yellow-300 text-sm animate-twinkle" style={{ animationDelay: '1s' }}>★</div>
        <div className="text-4xl mb-3">👑</div>
        <p className="text-yellow-300 text-xs font-semibold tracking-widest uppercase mb-2">Mis XV Años</p>
        <h3 className="font-display text-3xl text-white italic tracking-wide mb-3">Sofía</h3>
        <p className="text-white/60 text-xs mb-4">Te invita a celebrar esta noche mágica</p>
        <div className="w-12 h-px bg-yellow-300 opacity-50 mb-3" />
        <p className="text-white/70 text-xs">21 de Junio • 8:00 PM</p>
        <p className="text-white/50 text-xs mt-1">Guadalajara, México</p>
      </div>
    ),
  },
  {
    id: 3,
    type: 'Cumpleaños',
    slug: 'demo-cumple',
    gradient: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-5xl mb-3">🎉</div>
        <p className="text-white font-bold text-sm uppercase tracking-widest mb-2">¡Cumpleaños!</p>
        <h3 className="font-display text-4xl text-white font-bold mb-3">Mariana</h3>
        <p className="text-white/90 text-sm font-medium mb-4">¡Ven a celebrar mis 30 años!</p>
        <div className="w-12 h-px bg-white opacity-50 mb-3" />
        <p className="text-white/80 text-xs">10 de Agosto • 6:00 PM</p>
        <p className="text-white/60 text-xs mt-1">CDMX, México</p>
      </div>
    ),
  },
  {
    id: 4,
    type: 'Bautizo',
    slug: 'demo-boda',
    gradient: 'bg-gradient-to-b from-sky-100 to-blue-200',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-4xl mb-3">🕊️</div>
        <p className="text-blue-700 text-xs font-semibold tracking-widest uppercase mb-2">Bautizo</p>
        <h3 className="font-display text-3xl text-blue-900 mb-3">Sebastián</h3>
        <p className="text-blue-700/70 text-sm mb-4 italic">Te invitamos a compartir esta bendición</p>
        <div className="w-12 h-px bg-blue-400 opacity-50 mb-3" />
        <p className="text-blue-800/70 text-xs">5 de Mayo • 11:00 AM</p>
        <p className="text-blue-700/50 text-xs mt-1">Parroquia San Miguel, CDMX</p>
      </div>
    ),
  },
  {
    id: 5,
    type: 'Baby Shower',
    slug: 'demo-boda',
    gradient: 'bg-gradient-to-b from-emerald-100 to-teal-200',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-4xl mb-3">🍼</div>
        <p className="text-teal-700 text-xs font-semibold tracking-widest uppercase mb-2">Baby Shower</p>
        <h3 className="font-display text-3xl text-teal-900 mb-1">Para</h3>
        <h3 className="font-display text-3xl text-teal-900 mb-3">Valentina</h3>
        <p className="text-teal-700/70 text-sm mb-4 italic">¡Un bebé en camino!</p>
        <div className="w-12 h-px bg-teal-400 opacity-50 mb-3" />
        <p className="text-teal-800/70 text-xs">20 de Julio • 4:00 PM</p>
        <p className="text-teal-700/50 text-xs mt-1">Monterrey, México</p>
      </div>
    ),
  },
  {
    id: 6,
    type: 'Graduación',
    slug: 'demo-boda',
    gradient: 'bg-gradient-to-b from-indigo-900 to-blue-900',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-4xl mb-3">🎓</div>
        <p className="text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-2">Graduación</p>
        <h3 className="font-display text-3xl text-white mb-1">Luis</h3>
        <h3 className="font-display text-xl text-white/70 mb-3">Fernández</h3>
        <p className="text-white/60 text-sm mb-4 italic">¡Lo logramos!</p>
        <div className="w-12 h-px bg-yellow-400 opacity-50 mb-3" />
        <p className="text-white/70 text-xs">12 de Diciembre • 7:00 PM</p>
        <p className="text-white/50 text-xs mt-1">Club de Golf, Guadalajara</p>
      </div>
    ),
  },
  {
    id: 7,
    type: 'Revelación',
    slug: 'demo-boda',
    gradient: 'bg-gradient-to-r from-pink-300 via-purple-200 to-blue-300',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-5xl mb-3">🎀</div>
        <p className="text-purple-800 text-xs font-semibold tracking-widest uppercase mb-2">Revelación de Género</p>
        <h3 className="font-display text-2xl text-gray-800 mb-2">¿Niño o Niña?</h3>
        <p className="text-gray-700/70 text-sm mb-4 italic">Ven a descubrirlo con nosotros</p>
        <div className="flex gap-2 justify-center mb-3">
          <span className="bg-blue-400/30 text-blue-800 text-xs px-2 py-1 rounded-full">👦 Niño</span>
          <span className="bg-pink-400/30 text-pink-800 text-xs px-2 py-1 rounded-full">👧 Niña</span>
        </div>
        <p className="text-gray-700/70 text-xs">14 de Septiembre • 5:00 PM</p>
      </div>
    ),
  },
  {
    id: 8,
    type: 'Corporativo',
    slug: 'demo-boda',
    gradient: 'bg-gradient-to-b from-slate-800 to-slate-900',
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-4xl mb-3">💼</div>
        <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">Corporativo</p>
        <h3 className="font-display text-2xl text-white mb-1">Gala Anual</h3>
        <h3 className="font-display text-2xl text-white mb-3">Innovatech 2025</h3>
        <p className="text-gray-400 text-sm mb-4">Celebrando 10 años de excelencia</p>
        <div className="w-12 h-px bg-gray-500 mb-3" />
        <p className="text-gray-400 text-xs">30 de Noviembre • 8:00 PM</p>
        <p className="text-gray-500 text-xs mt-1">Hotel Presidente, CDMX</p>
      </div>
    ),
  },
]

export default function InvitationExamples() {
  return (
    <section id="ejemplos" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Algunas de nuestras invitaciones
          </h2>
          <p className="text-gray-500 text-lg">
            Miles de diseños para tu evento especial
          </p>
        </div>

        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4">
          {EXAMPLES.map((example) => (
            <Link
              key={example.id}
              href={`/invitacion/${example.slug}`}
              className={`group relative w-64 h-96 rounded-2xl flex-shrink-0 snap-start overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer ${example.gradient}`}
            >
              {/* Invitation content */}
              <div className="absolute inset-0">
                {example.content}
              </div>

              {/* Bottom overlay with type label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-12 pb-4 px-4 flex flex-col items-center gap-2">
                <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  {example.type}
                </span>
                {/* Hover CTA */}
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Ver demo →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/crear"
            className="inline-flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-semibold px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-pink-500/30 hover:shadow-xl"
          >
            Ver todos los diseños
          </Link>
        </div>
      </div>
    </section>
  )
}
