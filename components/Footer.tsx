import Link from 'next/link'
import { Heart, Instagram, Facebook } from 'lucide-react'

const FOOTER_LINKS = {
  producto: [
    { label: 'Crear invitación', href: '/crear' },
    { label: 'Ejemplos', href: '/#ejemplos' },
    { label: 'Precios', href: '/precios' },
    { label: 'FAQ', href: '/#faq' },
  ],
  eventos: [
    { label: 'Boda', href: '/crear?tipo=boda' },
    { label: 'XV Años', href: '/crear?tipo=xv-anos' },
    { label: 'Cumpleaños', href: '/crear?tipo=cumpleanos' },
    { label: 'Bautizo', href: '/crear?tipo=bautizo' },
    { label: 'Baby Shower', href: '/crear?tipo=baby-shower' },
  ],
  empresa: [
    { label: 'Acerca de', href: '#' },
    { label: 'Contacto', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Trabaja con nosotros', href: '#' },
  ],
  legal: [
    { label: 'Política de privacidad', href: '#' },
    { label: 'Términos de uso', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="text-[#F72585] fill-[#F72585]" size={20} />
              <span className="text-lg font-bold">
                teinvitaron
                <span className="text-[#F72585]">.site</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              La invitación digital que enamora
            </p>

            {/* Social icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-gray-400 hover:text-[#F72585] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-[#F72585] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Producto
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.producto.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tipos de evento */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Tipos de evento
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.eventos.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Empresa
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 teinvitaron.site — Todos los derechos reservados
          </p>
          <p className="text-gray-500 text-sm">
            Hecho con ❤️ en México
          </p>
        </div>
      </div>
    </footer>
  )
}
