'use client'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Checkout() {
  const params = useSearchParams()
  const productId = params.get('product')
  const [status, setStatus] = useState("Tap NFC Card")

  const startScan = async () => {
    try {
      const ndef = new NDEFReader()
      await ndef.scan()

      ndef.onreading = async (event) => {
        const decoder = new TextDecoder()
        const cardUID = decoder.decode(event.message.records[0].data)

        const res = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            card_uid: cardUID,
            product_id: productId
          })
        })

        const data = await res.json()

        if (data.success) setStatus("Payment Successful ✓")
        else setStatus(data.error)
      }
    } catch {
      setStatus("NFC Not Supported")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={startScan}
        className="bg-blue-600 px-8 py-4 rounded-xl"
      >
        Pay with NFC
      </motion.button>

      <p className="mt-6 text-2xl">{status}</p>
    </div>
  )
}
