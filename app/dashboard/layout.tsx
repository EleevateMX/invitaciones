'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Heart,
  Home,
  Plus,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Mis invitaciones' },
  { href: '/crear', icon: Plus, label: 'Nueva invitación' },
  { href: '/dashboard/configuracion', icon: Settings, label: 'Configuración' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FFF5F9] flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed top-0 left-0 h-full z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-[#F72585] rounded-xl flex items-center justify-center shadow-md shadow-[#F72585]/20">
            <Heart size={16} className="text-white fill-white" />
          </div>
          <span className="font-bold text-[#1A1A2E] text-lg">
            teinvitaron<span className="text-[#F72585]">.site</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? 'bg-[#F72585] text-white shadow-md shadow-[#F72585]/25'
                    : 'text-[#1A1A2E]/60 hover:bg-[#F72585]/8 hover:text-[#F72585]'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div className="px-4 pb-6 border-t border-gray-100 pt-4">
          <Link
            href="/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#1A1A2E]/40 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
          >
            <LogOut size={18} />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white z-40 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#F72585] rounded-xl flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-bold text-[#1A1A2E]">
              teinvitaron<span className="text-[#F72585]">.site</span>
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#F72585] text-white'
                    : 'text-[#1A1A2E]/60 hover:bg-pink-50 hover:text-[#F72585]'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 border-t border-gray-100 pt-4">
          <Link
            href="/auth/signout"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-[#1A1A2E]/40 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={18} />
            Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[#1A1A2E]/60 hover:text-[#1A1A2E]"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-[#F72585] fill-[#F72585]" />
            <span className="font-bold text-[#1A1A2E] text-base">
              teinvitaron<span className="text-[#F72585]">.site</span>
            </span>
          </div>
          <Link href="/dashboard/configuracion" className="text-[#1A1A2E]/40">
            <Bell size={20} />
          </Link>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20 px-2 py-2 flex justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                active ? 'text-[#F72585]' : 'text-[#1A1A2E]/40'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label.split(' ')[0]}</span>
            </Link>
          )
        })}
        <Link
          href="/auth/signout"
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[#1A1A2E]/40 transition-all"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium">Salir</span>
        </Link>
      </nav>
    </div>
  )
}
