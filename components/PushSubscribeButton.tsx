'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'

const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BJeFpvQa1Ju3AhqddNUlOnANntOOg0_jjDzq3dOio8D27mgwdXdyHu3b_6Ogkg8VvMe5fznyrZnFv42zbCENZQ8'

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

interface PushSubscribeButtonProps {
  className?: string
  variant?: 'default' | 'compact'
}

export default function PushSubscribeButton({
  className = '',
  variant = 'default',
}: PushSubscribeButtonProps) {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    setSupported(true)
    setPermission(Notification.permission)

    // Check if already subscribed
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setSubscribed(true)
      })
    })
  }, [])

  async function handleSubscribe() {
    setLoading(true)
    setError(null)
    try {
      const reg = await navigator.serviceWorker.ready
      const perm = await Notification.requestPermission()
      setPermission(perm)

      if (perm !== 'granted') {
        setError('Permiso denegado. Activa las notificaciones en la configuración de tu navegador.')
        setLoading(false)
        return
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const key = sub.getKey('p256dh')
      const auth = sub.getKey('auth')

      const res = await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: key ? btoa(Array.from(new Uint8Array(key)).map((b) => String.fromCharCode(b)).join('')) : '',
          auth: auth ? btoa(Array.from(new Uint8Array(auth)).map((b) => String.fromCharCode(b)).join('')) : '',
        }),
      })

      if (!res.ok) throw new Error('Error al guardar la suscripción')
      setSubscribed(true)
    } catch (err) {
      console.error(err)
      setError('No pudimos activar las notificaciones. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUnsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push-unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setSubscribed(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!supported) return null

  if (permission === 'denied') {
    return (
      <div className={`flex items-center gap-2 text-xs text-white/30 ${className}`}>
        <BellOff size={14} />
        <span>Notificaciones bloqueadas en el navegador</span>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={className}>
        {error && <p className="text-xs text-red-400 mb-1">{error}</p>}
        <button
          onClick={subscribed ? handleUnsubscribe : handleSubscribe}
          disabled={loading}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
            subscribed
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {loading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : subscribed ? (
            <Bell size={12} />
          ) : (
            <Bell size={12} />
          )}
          {subscribed ? 'Notificaciones activas' : 'Activar notificaciones'}
        </button>
      </div>
    )
  }

  return (
    <div className={className}>
      {error && (
        <p className="text-xs text-red-400 mb-2 bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">
          {error}
        </p>
      )}
      <button
        onClick={subscribed ? handleUnsubscribe : handleSubscribe}
        disabled={loading}
        className={`flex items-center gap-2.5 font-semibold px-5 py-3 rounded-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
          subscribed
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
            : 'bg-[#F72585] text-white hover:bg-[#B5179E] shadow-lg hover:shadow-[#F72585]/30'
        }`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Bell size={16} />
        )}
        <span>
          {loading
            ? 'Procesando...'
            : subscribed
            ? 'Notificaciones activas'
            : 'Activar notificaciones'}
        </span>
      </button>
    </div>
  )
}
