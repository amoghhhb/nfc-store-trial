'use client'

import { motion } from 'framer-motion'
import GlowButton from './GlowButton'
import { useCart } from '@/context/CartContext'

export default function ProductDetails({ product }) {
  const { addToCart } = useCart()

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(product.price)

  return (
    <div className="min-h-screen p-10 flex flex-col md:flex-row gap-10">

      <motion.img
        src={product.image_url}
        alt={product.name}
        className="w-full md:w-1/2 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold">
          {product.name}
        </h1>

        <p className="text-zinc-400">
          Sold by {product.seller_name}
        </p>

        <p className="text-green-400 text-2xl font-bold">
          {formattedPrice}
        </p>

        <p className="text-zinc-300">
          {product.description}
        </p>

        <GlowButton onClick={() => addToCart(product)}>
          Add to Cart
        </GlowButton>
      </motion.div>

    </div>
  )
}
