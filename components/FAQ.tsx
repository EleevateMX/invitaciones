'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: '¿Qué es una invitación digital?',
    answer:
      'Una invitación digital es un enlace web que puedes compartir por WhatsApp, Instagram o cualquier red social. Tus invitados la abren en su celular o computadora y ven todos los detalles de tu evento de forma elegante e interactiva.',
  },
  {
    question: '¿Cómo comparto mi invitación por WhatsApp?',
    answer:
      'Una vez creada tu invitación, recibirás un link único. Puedes copiarlo y pegarlo en WhatsApp, o usar el botón de compartir directo que genera un mensaje prediseñado para enviar a todos tus contactos con un solo clic.',
  },
  {
    question: '¿Puedo usar música en mi invitación?',
    answer:
      '¡Sí! Puedes agregar una canción de Spotify o Apple Music que sonará cuando tus invitados abran la invitación. Esto está disponible desde el plan gratuito.',
  },
  {
    question: '¿Qué pasa con mi invitación después del evento?',
    answer:
      'Con el plan gratuito, la invitación se desactiva 7 días después del evento. Con los planes Premium y Planner, tu invitación se conserva permanentemente como recuerdo digital.',
  },
  {
    question: '¿Puedo personalizar el diseño completamente?',
    answer:
      'Sí. Puedes cambiar colores, tipografía, agregar fotos, videos, itinerario, mesa de regalos, hospedaje sugerido y mucho más. Todos los bloques son editables.',
  },
  {
    question: '¿Desde qué países pueden ver la invitación?',
    answer:
      'Desde cualquier parte del mundo. Teinvitaron.site funciona en todos los países y la invitación se adapta a cualquier dispositivo: celular, tablet o computadora.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-[#FFF5F9]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-gray-500 text-lg">
            Todo lo que necesitas saber antes de crear tu invitación
          </p>
        </div>

        <div className="flex flex-col divide-y divide-gray-200 bg-white rounded-3xl shadow-sm overflow-hidden">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index}>
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[#1A1A2E] font-semibold text-base pr-4">
                    {item.question}
                  </span>
                  <span className="text-[#F72585] flex-shrink-0">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>

                {/* Animated answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
