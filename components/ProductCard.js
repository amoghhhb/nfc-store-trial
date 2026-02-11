'use client'

import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import GlowButton from './GlowButton'
import Link from 'next/link'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(product.price)

  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')

  return (
    <Link
      href={`/product/${product.id}-${slug}`}
      className="block h-full"
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="bg-zinc-900 rounded-xl shadow-lg 
                   flex flex-col h-full 
                   overflow-hidden cursor-pointer"
      >
        <div className="w-full aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold line-clamp-2 min-h-[56px]">
            {product.name}
          </h2>

          <p className="text-xs text-zinc-400 mb-2">
            Sold by {product.seller_name}
          </p>

          <p className="text-green-400 font-bold text-lg mb-4">
            {formattedPrice}
          </p>

          <div className="mt-auto">
            <GlowButton
              onClick={(e) => {
                e.preventDefault()
                addToCart(product)
              }}
              className="w-full"
            >
              Add to Cart
            </GlowButton>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
