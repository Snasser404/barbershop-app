import { useState, useEffect } from 'react'
import api from '../api/client'
import { BarberShop } from '../types'
import ShopCard from '../components/ShopCard'

export default function Home() {
  const [shops, setShops] = useState<BarberShop[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [minRating, setMinRating] = useState('')

  const fetchShops = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/shops', { params: { search: search || undefined, minRating: minRating || undefined } })
      setShops(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchShops() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchShops()
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-primary text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Find your perfect barber</h1>
          <p className="text-gray-300 text-lg mb-8">Browse local barbershops, compare prices, and book instantly</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Search by name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {loading ? 'Loading...' : `${shops.length} barbershop${shops.length !== 1 ? 's' : ''} found`}
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Min rating:</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={minRating}
              onChange={(e) => { setMinRating(e.target.value); setTimeout(fetchShops, 0) }}
            >
              <option value="">Any</option>
              <option value="3">3+ ★</option>
              <option value="4">4+ ★</option>
              <option value="4.5">4.5+ ★</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">✂</p>
            <p className="text-xl font-medium">No barbershops found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        )}
      </div>
    </div>
  )
}
