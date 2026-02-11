import { supabaseServer } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { transactionId } = await req.json()

  const { data: transaction } = await supabaseServer
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single()

  if (!transaction) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 400 })
  }

  // Refund to card
  await supabaseServer
    .from('nfc_cards')
    .update({
      balance: supabaseServer.raw(`balance + ${transaction.amount}`)
    })
    .eq('id', transaction.card_id)

  // Mark transaction as refunded
  await supabaseServer
    .from('transactions')
    .update({ refunded: true })
    .eq('id', transactionId)

  return NextResponse.json({ success: true })
}
