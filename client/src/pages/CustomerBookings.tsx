import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { Appointment, AppointmentStatus } from '../types'

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
}

export default function CustomerBookings() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('ALL')

  useEffect(() => {
    api.get('/appointments').then((r) => setAppointments(r.data)).finally(() => setLoading(false))
  }, [])

  const cancel = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    await api.put(`/appointments/${id}/status`, { status: 'CANCELLED' })
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'CANCELLED' } : a))
  }

  const filtered = filter === 'ALL' ? appointments : appointments.filter((a) => a.status === filter)

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">My Bookings</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium">No bookings found</p>
          <Link to="/" className="btn-primary mt-4 inline-block text-sm">Browse barbershops</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <div key={appt.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  {appt.shop?.coverImage ? (
                    <img src={appt.shop.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-2xl text-primary/30 shrink-0">✂</div>
                  )}
                  <div>
                    <Link to={`/shops/${appt.shopId}`} className="font-semibold text-primary hover:underline">{appt.shop?.name}</Link>
                    <p className="text-gray-500 text-sm">{appt.shop?.address}</p>
                    <p className="text-gray-700 text-sm mt-1">{appt.service?.name} — <span className="font-medium">${appt.service?.price}</span></p>
                    <p className="text-gray-400 text-sm">{appt.service?.duration} min</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`badge ${statusColors[appt.status]}`}>{appt.status}</span>
                  <p className="text-sm font-medium mt-2">{new Date(appt.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className="text-sm text-gray-500">{appt.time}</p>
                </div>
              </div>
              {appt.notes && <p className="text-sm text-gray-500 mt-3 border-t pt-3">📝 {appt.notes}</p>}
              {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                <button onClick={() => cancel(appt.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 hover:underline">
                  Cancel appointment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
