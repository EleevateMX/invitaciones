'use client'

import { useState, useEffect } from 'react'
import { Heart, Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Ejemplos', href: '/#ejemplos' },
    { label: 'Precios', href: '/precios' },
    { label: 'FAQ', href: '/#faq' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
      style={{ marginTop: '36px' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Heart
              className="text-[#F72585] fill-[#F72585]"
              size={22}
            />
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                scrolled ? 'text-[#1A1A2E]' : 'text-white'
              }`}
            >
              teinvitaron
            </span>
            <span className="text-xl font-bold text-[#F72585]">.site</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 hover:text-[#F72585] ${
                  scrolled ? 'text-[#1A1A2E]' : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              href="/crear"
              className="bg-[#F72585] hover:bg-[#B5179E] text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ¡Crear gratis!
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-[#1A1A2E]' : 'text-white'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[#1A1A2E] font-medium hover:text-[#F72585] transition-colors py-1"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/crear"
              className="bg-[#F72585] hover:bg-[#B5179E] text-white font-semibold px-5 py-3 rounded-full text-sm text-center transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              ¡Crear gratis!
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
