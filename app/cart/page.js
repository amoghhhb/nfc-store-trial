'use client'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const { cart, removeFromCart } = useCart()
  const router = useRouter()

  const checkout = async () => {
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
      router.push('/login')
      return
    }

    router.push('/checkout')
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl mb-6">Your Cart</h1>

      {cart.map(item => (
        <div key={item.id} className="flex justify-between bg-zinc-800 p-4 rounded mb-4">
          <div>
            <p>{item.name}</p>
            <p className="text-green-400">₹ {item.price}</p>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-red-600 px-4 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <button
          onClick={checkout}
          className="bg-green-600 px-6 py-2 rounded mt-4"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  )
}
