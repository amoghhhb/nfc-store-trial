'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

export default function UsersListPage() {
  const [users, setUsers] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) return router.push('/')

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return router.push('/')
    }

    fetchUsers()
  }

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        nfc_cards (
          card_name,
          balance
        )
      `)

    if (data) setUsers(data)
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-6">Users List</h1>

      <div className="space-y-6">
        {users.map((user) => (
          <div key={user.id} className="bg-zinc-900 p-6 rounded-xl">
            <h2 className="font-bold mb-2">{user.email}</h2>

            {user.nfc_cards?.length > 0 ? (
              user.nfc_cards.map((card, index) => (
                <div key={index} className="text-sm text-zinc-300">
                  Card: {card.card_name} — ₹{card.balance}
                </div>
              ))
            ) : (
              <p className="text-zinc-500">No NFC cards</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
