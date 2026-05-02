import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'
import { BarberShop, Appointment } from '../../types'
import StarRating from '../../components/StarRating'

export default function BarberDashboard() {
  const [shop, setShop] = useState<BarberShop | null | undefined>(undefined)
  const [upcoming, setUpcoming] = useState<Appointment[]>([])

  useEffect(() => {
    api.get('/shops/mine').then((r) => setShop(r.data)).catch(() => setShop(null))
    api.get('/appointments').then((r) => {
      const today = new Date().toISOString().split('T')[0]
      setUpcoming(r.data.filter((a: Appointment) => a.date >= today && (a.status === 'PENDING' || a.status === 'CONFIRMED')).slice(0, 5))
    })
  }, [])

  if (shop === undefined) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl">✂</span>
        <h1 className="text-2xl font-bold text-primary mt-4">Set up your shop</h1>
        <p className="text-gray-500 mt-2">Create your barbershop profile to start accepting bookings</p>
        <Link to="/barber/shop" className="btn-accent mt-6 inline-block">Create my shop</Link>
      </div>
    )
  }

  const pendingCount = upcoming.filter((a) => a.status === 'PENDING').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">{shop.name}</h1>
          <p className="text-gray-500 text-sm">{shop.address}</p>
        </div>
        <Link to={`/shops/${shop.id}`} className="btn-outline text-sm">View public page →</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="⭐" label="Rating" value={shop.rating.toFixed(1)} sub={`${shop.reviewCount} reviews`} />
        <StatCard icon="✂" label="Services" value={String(shop.services?.length || 0)} sub="active" />
        <StatCard icon="🏷" label="Offers" value={String(shop.offers?.length || 0)} sub="running" />
        <StatCard icon="📅" label="Pending" value={String(pendingCount)} sub="appointments" highlight={pendingCount > 0} />
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { to: '/barber/shop', icon: '🏪', label: 'Edit Shop', desc: 'Profile, hours, photos' },
          { to: '/barber/services', icon: '✂', label: 'Services', desc: 'Manage your menu' },
          { to: '/barber/offers', icon: '🏷', label: 'Offers', desc: 'Promotions & discounts' },
          { to: '/barber/appointments', icon: '📅', label: 'Appointments', desc: 'View & manage bookings' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="card p-4 hover:shadow-md transition-shadow">
            <span className="text-3xl">{item.icon}</span>
            <p className="font-semibold mt-2">{item.label}</p>
            <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments */}
      {upcoming.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Upcoming Appointments</h2>
            <Link to="/barber/appointments" className="text-sm text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-2">
            {upcoming.map((appt) => (
              <div key={appt.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {appt.customer?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{appt.customer?.name}</p>
                    <p className="text-gray-400 text-xs">{appt.service?.name} — {appt.service?.duration}min</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appt.date} at {appt.time}</p>
                  <span className={`badge text-xs ${appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{appt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, sub, highlight }: { icon: string; label: string; value: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`card p-4 ${highlight ? 'border-amber-300 bg-amber-50' : ''}`}>
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-primary mt-1">{value}</p>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  )
}
