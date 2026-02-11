import { supabaseServer } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { cardUid, total, productId } = await req.json()

  // Get card
  const { data: card } = await supabaseServer
    .from('nfc_cards')
    .select('*')
    .eq('card_uid', cardUid)
    .single()

  if (!card) {
    return NextResponse.json({ error: 'Invalid card' }, { status: 400 })
  }

  if (!card.is_active) {
    return NextResponse.json({ error: 'Card is inactive' }, { status: 400 })
  }

  if (card.balance < total) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
  }

  const newBalance = card.balance - total

  // Deduct balance
  await supabaseServer
    .from('nfc_cards')
    .update({ balance: newBalance })
    .eq('id', card.id)

  // Create transaction
  await supabaseServer
    .from('transactions')
    .insert({
      card_uid: cardUid,
      product_id: productId,
      amount: total,
      status: 'completed'
    })

  return NextResponse.json({
    success: true,
    newBalance
  })
}
