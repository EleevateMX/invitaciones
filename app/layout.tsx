import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CountryBanner from '@/components/CountryBanner'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'

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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F72585" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="teinvitaron" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={inter.className}>
        <CountryBanner />
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
