import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const { card_uid, product_id } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const { data: card } = await supabase
    .from('nfc_cards')
    .select('*')
    .eq('card_uid', card_uid)
    .single()

  if (!card || !card.is_active)
    return Response.json({ error: 'Invalid Card' })

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single()

  if (card.balance < product.price)
    return Response.json({ error: 'Insufficient Balance' })

  await supabase
    .from('nfc_cards')
    .update({ balance: card.balance - product.price })
    .eq('card_uid', card_uid)

  await supabase
    .from('transactions')
    .insert({
      card_uid,
      product_id,
      amount: product.price,
      status: 'success'
    })

  return Response.json({ success: true })
}
