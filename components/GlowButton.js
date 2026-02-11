'use client'
import { motion } from 'framer-motion'

export default function GlowButton({ children, onClick, className }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`relative px-6 py-2 rounded-xl font-semibold 
      bg-gradient-to-r from-blue-600 to-indigo-600
      shadow-lg shadow-blue-500/30
      hover:shadow-blue-500/60
      transition-all duration-300
      ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-xl blur-xl bg-blue-500 opacity-20"></span>
    </motion.button>
  )
}
