'use client'
import { supabase } from '@/lib/supabaseBrowser'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Seller() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')

  const addProduct = async () => {
    const { data } = await supabase.auth.getUser()

    await supabase.from('products').insert({
      name,
      price,
      image_url: image,
      seller_id: data.user.id
    })

    alert("Product Added")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10"
    >
      <h1 className="text-3xl mb-6">Seller Dashboard</h1>

      <motion.input
        whileFocus={{ scale: 1.05 }}
        placeholder="Product Name"
        onChange={e=>setName(e.target.value)}
        className="bg-zinc-800 p-2 rounded w-full mb-4"
      />

      <motion.input
        whileFocus={{ scale: 1.05 }}
        placeholder="Price"
        onChange={e=>setPrice(e.target.value)}
        className="bg-zinc-800 p-2 rounded w-full mb-4"
      />

      <motion.input
        whileFocus={{ scale: 1.05 }}
        placeholder="Image URL"
        onChange={e=>setImage(e.target.value)}
        className="bg-zinc-800 p-2 rounded w-full mb-4"
      />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={addProduct}
        className="bg-green-600 px-6 py-2 rounded"
      >
        Add Product
      </motion.button>
    </motion.div>
  )
}
