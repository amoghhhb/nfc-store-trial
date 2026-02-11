'use client'
import ProductCard from './ProductCard'
import SkeletonCard from './SkeletonCard'
import { motion } from 'framer-motion'

export default function ProductsSection({ products }) {

  if (!products.length) {
    return (
      <div className="grid md:grid-cols-3 gap-6 p-10">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="p-10">

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl mb-8"
      >
        Marketplace
      </motion.h1>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </div>
  )
}
