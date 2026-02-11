import { supabaseServer } from '@/lib/supabase'
import ProductsSection from '@/components/ProductsSection'

export default async function Home() {
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')

  return <ProductsSection products={products || []} />
}
