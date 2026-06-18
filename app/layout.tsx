import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CountryBanner from '@/components/CountryBanner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'teinvitaron.site — Invitaciones Digitales',
  description:
    'Crea invitaciones digitales hermosas en minutos y compártelas por WhatsApp. Bodas, XV Años, Cumpleaños, Bautizos y más.',
  keywords:
    'invitaciones digitales, invitacion digital, boda, xv años, cumpleaños, whatsapp, mexico',
  metadataBase: new URL('https://teinvitaron.site'),
  openGraph: {
    title: 'teinvitaron.site — Invitaciones Digitales',
    description:
      'Crea invitaciones digitales hermosas y compártelas por WhatsApp al instante.',
    type: 'website',
    locale: 'es_MX',
    siteName: 'teinvitaron.site',
    url: 'https://teinvitaron.site',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'teinvitaron.site — Invitaciones Digitales',
    description:
      'Crea invitaciones digitales hermosas y compártelas por WhatsApp al instante.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={inter.className}>
        <CountryBanner />
        {children}
      </body>
    </html>
  )
}
