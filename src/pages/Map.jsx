import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function MapPage() {
  const [items, setItems] = useState([])
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams()
      if (city) params.append('city', city)
      if (category) params.append('category', category)
      const res = await fetch(`${API_BASE}/practices?${params.toString()}`)
      const data = await res.json()
      setItems(data.items || [])
    }
    fetchData()
  }, [city, category])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h1 className="text-3xl font-bold">City Map of Sustainable Projects</h1>
            <p className="mt-2 text-white/80">Filter by city and category. Pins appear based on submitted latitude/longitude.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="Filter by city" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
              <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Filter by category" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(56,189,248,0.12),rgba(99,102,241,0.12))]">
            {/* Simple map placeholder using CSS grid background. In production swap for Mapbox/Leaflet. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
            {/* Render pins where lat/lng exists */}
            {items.filter(p=>p.latitude && p.longitude).map((p, idx) => (
              <div key={idx} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + (p.longitude/360)*100}%`, top: `${50 - (p.latitude/180)*100}%` }}>
                <div className="group">
                  <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.6)]" />
                  <div className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity mt-2 w-56 rounded-xl border border-white/10 bg-slate-900/90 p-3 text-xs text-white/80 backdrop-blur">
                    <div className="font-semibold text-white">{p.title}</div>
                    <div className="text-white/70">{p.city}{p.category ? ` • ${p.category}` : ''}</div>
                    {p.description && <div className="mt-1 line-clamp-3">{p.description}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* List fallback */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((p, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-sm text-white/60">{p.city}{p.category ? ` • ${p.category}` : ''}</div>
                <div className="text-lg font-semibold">{p.title}</div>
                {p.description && <p className="mt-1 text-white/80 line-clamp-3">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default MapPage
