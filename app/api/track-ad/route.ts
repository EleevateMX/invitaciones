import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adId, type } = body as { adId: string; type: 'click' | 'impression' }

    if (!adId || !type) {
      return NextResponse.json({ error: 'adId y type son requeridos' }, { status: 400 })
    }

    if (type !== 'click' && type !== 'impression') {
      return NextResponse.json({ error: 'type debe ser click o impression' }, { status: 400 })
    }

    const supabase = await createClient()

    const column = type === 'click' ? 'clicks' : 'impressions'

    // Fetch current value then increment
    const { data: current, error: fetchErr } = await supabase
      .from('inv_ads')
      .select(column)
      .eq('id', adId)
      .single()

    if (fetchErr || !current) {
      return NextResponse.json({ error: 'Anuncio no encontrado' }, { status: 404 })
    }

    const newValue = ((current as Record<string, number>)[column] ?? 0) + 1

    const { error } = await supabase
      .from('inv_ads')
      .update({ [column]: newValue })
      .eq('id', adId)

    if (error) {
      console.error('Error actualizando ad:', error)
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, [column]: newValue })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
