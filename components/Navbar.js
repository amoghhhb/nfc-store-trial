'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseBrowser'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [open, setOpen] = useState(false)
  const { cart } = useCart()
  const dropdownRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) {
      setUser(null)
      setRole(null)
      return
    }

    setUser(authData.user)

    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileData) {
      setRole(profileData.role)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 w-full z-50 
                 bg-black/40 backdrop-blur-xl 
                 border-b border-white/10
                 px-8 py-4 flex justify-between items-center"
    >
      <Link href="/" className="text-xl font-bold tracking-wide">
        Marketplace
      </Link>

      <div className="flex items-center gap-6">

        {/* CART */}
        <Link href="/cart" className="relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl 
                            bg-white/5 backdrop-blur-md 
                            border border-white/10
                            flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                className="w-6 h-6"
              >
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
                <path d="M3 4h2l2.2 9.5a1 1 0 001 .8h8.5a1 1 0 001-.8L21 8H7" />
              </svg>
            </div>

            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 
                             bg-blue-600 text-xs px-2 py-0.5 
                             rounded-full"
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {!user && (
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Login
          </Link>
        )}

        {user && (
          <div className="relative" ref={dropdownRef}>

            <div
              onClick={() => setOpen(!open)}
              className="w-10 h-10 bg-blue-600 
                         rounded-full flex items-center 
                         justify-center cursor-pointer font-bold"
            >
              {user.email.charAt(0).toUpperCase()}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-56 
                             bg-zinc-900 rounded-xl shadow-xl overflow-hidden"
                >
                  <Link
                    href="/profile"
                    className="block px-4 py-3 hover:bg-zinc-800"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  {role === 'admin' && (
                    <>
                      <Link
                        href="/admin"
                        className="block px-4 py-3 hover:bg-zinc-800 text-blue-400"
                        onClick={() => setOpen(false)}
                      >
                        Admin Panel
                      </Link>

                      <Link
                        href="/admin/users"
                        className="block px-4 py-3 hover:bg-zinc-800 text-blue-400"
                        onClick={() => setOpen(false)}
                      >
                        Users List
                      </Link>
                    </>
                  )}

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>
    </motion.nav>
  )
}
