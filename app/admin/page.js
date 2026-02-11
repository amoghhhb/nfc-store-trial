'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'
import { motion } from 'framer-motion'

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [cards, setCards] = useState([])
  const [newCardName, setNewCardName] = useState('')
  const [newCardUID, setNewCardUID] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser()
    const currentUser = data.user

    if (!currentUser) {
      window.location.href = '/'
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      window.location.href = '/'
      return
    }

    setUser(currentUser)
    fetchCards()
  }

  const fetchCards = async () => {
    const { data } = await supabase
      .from('nfc_cards')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setCards(data)
    setLoading(false)
  }

  const createCard = async () => {
    if (!newCardName || !newCardUID) {
      alert('Enter card name and UID')
      return
    }

    const { error } = await supabase.from('nfc_cards').insert({
      card_name: newCardName,
      card_uid: newCardUID,
      balance: 0
    })

    if (error) {
      alert(error.message)
      return
    }

    setNewCardName('')
    setNewCardUID('')
    fetchCards()
  }

  const updateCard = async (id, newBalance, newName) => {
    const { error } = await supabase
      .from('nfc_cards')
      .update({
        balance: newBalance,
        card_name: newName
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchCards()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Admin NFC Dashboard</h1>

      {/* Create NFC Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-zinc-900 p-6 rounded-xl mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Create NFC Card</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Card Name"
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            className="bg-zinc-800 p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Card UID"
            value={newCardUID}
            onChange={(e) => setNewCardUID(e.target.value)}
            className="bg-zinc-800 p-2 rounded w-full"
          />
        </div>

        <button
          onClick={createCard}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded"
        >
          Create Card
        </button>
      </motion.div>

      {/* Existing Cards */}
      <div className="grid gap-6">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900 p-6 rounded-xl flex flex-col gap-4"
          >
            <div>
              <p className="text-sm text-zinc-400">Card UID</p>
              <p className="font-mono">{card.card_uid}</p>
            </div>

            <div>
              <p className="text-sm text-zinc-400">Card Name</p>
              <input
                type="text"
                defaultValue={card.card_name}
                onBlur={(e) =>
                  updateCard(card.id, card.balance, e.target.value)
                }
                className="bg-zinc-800 p-2 rounded w-full"
              />
            </div>

            <div>
              <p className="text-sm text-zinc-400">Balance (₹)</p>
              <input
                type="number"
                defaultValue={card.balance}
                onBlur={(e) =>
                  updateCard(card.id, Number(e.target.value), card.card_name)
                }
                className="bg-zinc-800 p-2 rounded w-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
