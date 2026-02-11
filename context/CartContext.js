'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowser'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (user) loadCart()
  }, [user])

  const loadCart = async () => {
    const { data } = await supabase
      .from('user_carts')
      .select('quantity, products(*)')
      .eq('user_id', user.id)

    if (data) {
      const formatted = data.map(item => ({
        ...item.products,
        quantity: item.quantity
      }))
      setCart(formatted)
    }
  }

  const addToCart = async (product) => {
    if (!user) return alert('Login required')

    await supabase.from('user_carts').upsert({
      user_id: user.id,
      product_id: product.id,
      quantity: 1
    })

    loadCart()
  }

  const removeFromCart = async (productId) => {
    await supabase
      .from('user_carts')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    loadCart()
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
