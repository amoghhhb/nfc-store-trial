'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        created_at,
        nfc_cards(card_name),
        profiles(email)
      `)
      .order('created_at', { ascending: false })

    if (data) setTransactions(data)
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>

      <div className="space-y-4">
        {transactions.map((t) => (
          <div key={t.id} className="bg-zinc-900 p-4 rounded-xl">
            <p>Amount: ₹{t.amount}</p>
            <p>Card: {t.nfc_cards?.card_name}</p>
            <p>User: {t.profiles?.email}</p>
            <p className="text-sm text-zinc-400">
              {new Date(t.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
