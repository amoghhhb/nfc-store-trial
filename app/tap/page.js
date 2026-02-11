'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function TapPage() {
  const { cart, clearCart } = useCart()
  const [cardUid, setCardUid] = useState('')
  const [message, setMessage] = useState('')

  const handleTap = async () => {
    try {
      // Check Web NFC support
      if ('NDEFReader' in window) {
        const ndef = new window.NDEFReader()
        await ndef.scan()

        setMessage('Tap your NFC card...')

        ndef.onreading = async (event) => {
          const decoder = new TextDecoder()

          for (const record of event.message.records) {
            const text = decoder.decode(record.data)
            setCardUid(text)
            processPayment(text)
          }
        }

      } else {
        // fallback if NFC not supported
        if (!cardUid) {
          setMessage('Enter NFC Card UID manually')
          return
        }
        processPayment(cardUid)
      }

    } catch (error) {
      setMessage('NFC Scan failed or permission denied')
    }
  }

  const processPayment = async (uid) => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardUid: uid,
        total: total,
        productId: cart[0]?.id
      })
    })

    const data = await res.json()

    if (data.error) {
      setMessage(data.error)
    } else {
      setMessage(`Payment Successful! Balance: ₹${data.newBalance}`)
      clearCart()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl mb-6">Tap NFC Card to Pay</h1>

      <input
        type="text"
        placeholder="Or enter NFC UID manually"
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
