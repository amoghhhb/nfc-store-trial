import { supabaseServer } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetails from '@/components/ProductDetails'

export default async function ProductPage(props) {

  // Next.js 15 requires awaiting params
  const params = await props.params

  if (!params?.slug) return notFound()

  const slugValue = Array.isArray(params.slug)
    ? params.slug[0]
    : params.slug

  if (!slugValue) return notFound()

  // UUID is always first 36 characters
  const productId = slugValue.substring(0, 36)

  if (!productId) return notFound()

  const { data: product, error } = await supabaseServer
    .from('products')
    .select('*')
    .eq('id', productId)
    .maybeSingle()

  if (!product || error) return notFound()

  return <ProductDetails product={product} />
}
