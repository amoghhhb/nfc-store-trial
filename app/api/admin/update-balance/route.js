import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const { uid, amount } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  await supabase
    .from('nfc_cards')
    .update({ balance: amount })
    .eq('card_uid', uid)

  return Response.json({ success: true })
}
