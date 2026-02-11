'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function TapPage() {
  const { cart, clearCart } = useCart()
  const [cardUid, setCardUid] = useState('')
  const [message, setMessage] = useState('')

  const handleTap = async () => {
    if (!cart.length) {
      setMessage('Cart is empty')
      return
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardUid: cardUid,
        total: total,
        productId: cart[0]?.id // using first product for now
      })
    })

    const data = await res.json()

    if (data.error) {
      setMessage(data.error)
    } else {
      setMessage(`Payment Successful! Remaining Balance: ₹${data.newBalance}`)
      clearCart()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-6">NFC Tap Simulation</h1>

      <input
        type="text"
        placeholder="Enter NFC Card UID"
        value={cardUid}
        onChange={(e) => setCardUid(e.target.value)}
        className="bg-zinc-800 p-2 rounded w-full max-w-md"
      />

      <button
        onClick={handleTap}
        className="mt-4 bg-blue-600 px-6 py-2 rounded"
      >
        Tap & Pay
      </button>

      {message && (
        <p className="mt-4 text-lg">{message}</p>
      )}
    </div>
  )
}
