'use client'

import './globals.css'
import Navbar from '@/components/Navbar'
import { CartProvider } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RootLayout({ children }) {
  const pathname = usePathname()
  const [particles, setParticles] = useState([])

  // Generate particles ONLY on client (prevents hydration error)
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: 20 + Math.random() * 20
    }))
    setParticles(generated)
  }, [])

  return (
    <html>
      <body className="bg-black text-white overflow-x-hidden">

        {/* Animated Particle Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-30"
              initial={{ x: p.x, y: p.y }}
              animate={{ y: -1000 }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <CartProvider>
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </CartProvider>

      </body>
    </html>
  )
}
