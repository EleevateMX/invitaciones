import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import EventTypesGrid from '@/components/EventTypesGrid'
import InvitationExamples from '@/components/InvitationExamples'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Stats bar */}
        <section className="bg-white py-10 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[#F72585]">50,000+</p>
                <p className="text-gray-500 text-sm mt-1">invitaciones creadas</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[#F72585]">35 países</p>
                <p className="text-gray-500 text-sm mt-1">alcance mundial</p>
              </div>
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-[#F72585]">98%</p>
                <p className="text-gray-500 text-sm mt-1">satisfechos</p>
              </div>
            </div>
          </div>
        </section>

        <EventTypesGrid />
        <InvitationExamples />
        <HowItWorks />
        <Pricing />
        <FAQ />

        {/* CTA Banner */}
        <section className="py-24 bg-gradient-to-r from-[#F72585] to-[#7209B7] text-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              ¿Lista para crear tu invitación?
            </h2>
            <p className="text-white/80 text-xl mb-10 leading-relaxed">
              Únete a miles de personas que ya confían en teinvitaron.site para sus eventos especiales
            </p>
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 bg-white text-[#F72585] hover:bg-pink-50 font-bold px-10 py-4 rounded-full text-lg transition-all duration-200 shadow-2xl hover:shadow-white/20 hover:scale-105"
            >
              ¡Crear mi invitación gratis!
            </Link>
            <p className="text-white/60 text-sm mt-4">Sin tarjeta de crédito requerida</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
