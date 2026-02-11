'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return

    setUser(authData.user)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileData) {
      setRole(profileData.role)
    }
  }

  const updatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else {
      setMessage('Password updated successfully')
      setPassword('')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-6">Profile Settings</h1>

      <div className="bg-zinc-900 p-6 rounded-xl max-w-md space-y-4">

        <div>
          <label>Email</label>
          <input
            value={user.email}
            disabled
            className="bg-zinc-800 p-2 rounded w-full opacity-60"
          />
        </div>

        <div>
          <label>Role</label>
          <input
            value={role || 'user'}
            disabled
            className="bg-zinc-800 p-2 rounded w-full opacity-60 capitalize"
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 p-2 rounded w-full"
          />
        </div>

        <button
          onClick={updatePassword}
          className="bg-blue-600 px-6 py-2 rounded"
        >
          Update Password
        </button>

        {message && <p>{message}</p>}
      </div>
    </div>
  )
}
