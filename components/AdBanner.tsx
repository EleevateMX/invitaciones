'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink } from 'lucide-react'

interface Ad {
  id: string
  slot: string
  title: string
  description: string | null
  image_url: string | null
  target_url: string
  active: boolean
}

interface AdBannerProps {
  slot: 'banner_top' | 'banner_mid' | 'banner_bottom'
  className?: string
}

export default function AdBanner({ slot, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  const impressionSent = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('inv_ads')
      .select('id, slot, title, description, image_url, target_url, active')
      .eq('slot', slot)
      .eq('active', true)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const random = data[Math.floor(Math.random() * data.length)]
          setAd(random)
        }
        setLoading(false)
      })
  }, [slot])

  // Track impression via IntersectionObserver
  useEffect(() => {
    if (!ad || impressionSent.current) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !impressionSent.current) {
          impressionSent.current = true
          fetch('/api/track-ad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId: ad.id, type: 'impression' }),
          }).catch(() => {})
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ad])

  function handleClick() {
    if (!ad) return
    fetch('/api/track-ad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId: ad.id, type: 'click' }),
    }).catch(() => {})
    window.open(ad.target_url, '_blank', 'noopener,noreferrer')
  }

  if (loading || !ad) return null

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 transition-colors cursor-pointer group">
        {/* Publicidad label */}
        <span className="absolute top-2 right-2 text-[9px] text-white/30 uppercase tracking-widest z-10">
          Publicidad
        </span>

        <button
          onClick={handleClick}
          className="w-full flex items-center gap-3 p-3 text-left"
        >
          {ad.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#FFB700] font-semibold uppercase tracking-wider mb-0.5">
              Anuncio patrocinado
            </p>
            <p className="text-white font-semibold text-sm truncate">{ad.title}</p>
            {ad.description && (
              <p className="text-white/50 text-xs truncate mt-0.5">{ad.description}</p>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 text-[#F72585] text-xs font-semibold group-hover:gap-2 transition-all">
            Ver más
            <ExternalLink size={12} />
          </div>
        </button>
      </div>
    </div>
  )
}
