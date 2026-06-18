import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Link from 'next/link'

export const metadata = {
  title: 'Planes y Precios — teinvitaron.site',
  description:
    'Elige el plan que mejor se adapte a tu evento. Empieza gratis o accede a funciones premium por un pago único.',
}

export default function PreciosPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Header hero */}
        <section className="bg-gradient-to-br from-[#1A1A2E] via-[#2D1B4E] to-[#1A1A2E] pt-36 pb-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <span className="inline-block border border-[#FFB700] text-[#FFB700] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Sin contratos ni sorpresas
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Planes y Precios
            </h1>
            <p className="text-gray-300 text-xl max-w-xl mx-auto leading-relaxed">
              Comienza gratis y escala cuando lo necesites. Pago único sin suscripciones forzosas.
            </p>
          </div>
        </section>

        <Pricing />
        <FAQ />

        {/* CTA */}
        <section className="py-16 bg-white text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">
              ¿Tienes dudas? Escríbenos
            </h2>
            <p className="text-gray-500 mb-8">
              Nuestro equipo está disponible para ayudarte a elegir el plan correcto para tu evento.
            </p>
            <Link
              href="/crear"
              className="inline-flex items-center gap-2 bg-[#F72585] hover:bg-[#B5179E] text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg"
            >
              ¡Empezar gratis ahora!
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
