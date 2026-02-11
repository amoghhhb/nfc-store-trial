export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl animate-pulse">
      <div className="h-40 bg-zinc-800 rounded mb-4"></div>
      <div className="h-4 bg-zinc-800 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
    </div>
  )
}
