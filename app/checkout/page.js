'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const calculatedTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    setTotal(calculatedTotal)
  }, [cart])

  const handleProceedToPay = () => {
    if (!cart.length) return
    router.push('/tap')
  }

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Your cart is empty.</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">Checkout</h1>

      <div className="bg-zinc-900 p-6 rounded-xl max-w-2xl">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b border-zinc-700 py-3"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-400">
                Qty: {item.quantity}
              </p>
            </div>

            <div>
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-6 text-xl font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={handleProceedToPay}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-lg"
        >
          Pay with NFC
        </button>
      </div>
    </div>
  )
}
