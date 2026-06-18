import Link from 'next/link'
import {
  Heart,
  Crown,
  Cake,
  Droplets,
  GraduationCap,
  Star,
  Briefcase,
  Baby,
  Gift,
  HelpCircle,
} from 'lucide-react'

const EVENT_TYPES = [
  { name: 'Boda', icon: Heart, slug: 'boda' },
  { name: 'XV Años', icon: Crown, slug: 'xv-anos' },
  { name: 'Cumpleaños', icon: Cake, slug: 'cumpleanos' },
  { name: 'Bautizo', icon: Droplets, slug: 'bautizo' },
  { name: 'Graduación', icon: GraduationCap, slug: 'graduacion' },
  { name: 'Primera Comunión', icon: Star, slug: 'primera-comunion' },
  { name: 'Corporativo', icon: Briefcase, slug: 'corporativo' },
  { name: 'Revelación de Género', icon: Baby, slug: 'revelacion-genero' },
  { name: 'Baby Shower', icon: Gift, slug: 'baby-shower' },
  { name: 'Otro', icon: HelpCircle, slug: 'otro' },
]

export default function EventTypesGrid() {
  return (
    <section id="tipos" className="py-20 bg-[#FFF5F9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Elige tu tipo de evento
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tenemos plantillas diseñadas especialmente para cada ocasión
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {EVENT_TYPES.map((event) => {
            const Icon = event.icon
            return (
              <Link
                key={event.slug}
                href={`/crear?tipo=${event.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-3 text-center hover:border-[#F72585] hover:border-2 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                  <Icon className="text-[#F72585]" size={22} />
                </div>
                <span className="text-sm font-semibold text-[#1A1A2E] group-hover:text-[#F72585] transition-colors leading-tight">
                  {event.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
