import React, { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default marker icons for Vite bundling
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function MapPage() {
  const [items, setItems] = useState([])
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (city) params.append('city', city)
        if (category) params.append('category', category)
        const res = await fetch(`${API_BASE}/practices?${params.toString()}`)
        const data = await res.json()
        setItems(Array.isArray(data.items) ? data.items : [])
      } catch (e) {
        console.error('Failed to load practices', e)
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [city, category])

  const points = useMemo(() => items.filter(p => typeof p.latitude === 'number' && typeof p.longitude === 'number'), [items])

  // Compute bounds if we have points
  const bounds = useMemo(() => {
    if (!points.length) return null
    const latlngs = points.map(p => [p.latitude, p.longitude])
    return L.latLngBounds(latlngs)
  }, [points])

  const initialCenter = useMemo(() => {
    // Default to roughly Europe/Africa view if no points
    return [20, 0]
  }, [])

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
              <button onClick={()=>{setCity(''); setCategory('')}} className="rounded-lg bg-white/10 hover:bg-white/20 transition px-3 py-2 border border-white/10">Reset</button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-white/10">
            <MapContainer
              center={initialCenter}
              zoom={2}
              minZoom={2}
              className="h-full w-full"
              worldCopyJump
              whenCreated={(map) => {
                mapRef.current = map
                if (bounds) {
                  setTimeout(() => map.fitBounds(bounds.pad(0.2)), 0)
                }
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {bounds && mapRef.current && (
                // Fit bounds on updates
                <FitBounds bounds={bounds} mapRef={mapRef} />
              )}

              <MarkerClusterGroup chunkedLoading>
                {points.map((p, idx) => (
                  <Marker key={idx} position={[p.latitude, p.longitude]}>
                    <Popup>
                      <div className="text-sm">
                        <div className="font-semibold">{p.title || 'Untitled'}</div>
                        <div className="text-slate-600">{p.city}{p.category ? ` • ${p.category}` : ''}</div>
                        {p.description && <div className="mt-1">{p.description}</div>}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>

            {loading && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/30">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </div>
            )}
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

function FitBounds({ bounds, mapRef }) {
  useEffect(() => {
    if (mapRef.current && bounds) {
      try {
        mapRef.current.fitBounds(bounds.pad(0.2))
      } catch (e) {
        // ignore
      }
    }
  }, [bounds, mapRef])
  return null
}

export default MapPage
