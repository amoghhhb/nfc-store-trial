'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'
import { motion, AnimatePresence } from 'framer-motion'
import GlowButton from '@/components/GlowButton'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    // Fetch user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      location.href = '/admin'
    } else if (profile?.role === 'seller') {
      location.href = '/seller'
    } else {
      location.href = '/'
    }
  }

  const handleSignup = async () => {
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        role: 'buyer'
      })

      alert('Account created successfully')
      setIsLogin(true)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 p-8 rounded-2xl w-96 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Create Account'}
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 p-3 rounded-xl outline-none"
            />

            <motion.input
              whileFocus={{ scale: 1.03 }}
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 p-3 rounded-xl outline-none"
            />

            <GlowButton
              onClick={isLogin ? handleLogin : handleSignup}
              className="w-full"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
            </GlowButton>
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-6 text-sm text-zinc-400">
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <span
                onClick={() => setIsLogin(false)}
                className="text-blue-400 cursor-pointer"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setIsLogin(true)}
                className="text-blue-400 cursor-pointer"
              >
                Login
              </span>
            </>
          )}
        </div>
      </motion.div>

    </div>
  )
}
