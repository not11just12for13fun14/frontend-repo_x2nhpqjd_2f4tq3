import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const Gallery = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/artworks`)
        if (!res.ok) throw new Error('Failed to load artworks')
        const data = await res.json()
        setItems(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <section id="gallery" className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Featured Artworks</h2>
          <p className="text-white/70">Fresh, vibrant pieces from digital creators.</p>
        </div>
        <button
          onClick={async () => {
            setLoading(true)
            setError('')
            try {
              const res = await fetch(`${API_BASE}/api/seed`, { method: 'POST' })
              if (!res.ok) throw new Error('Seed failed')
              const r = await fetch(`${API_BASE}/api/artworks`)
              setItems(await r.json())
            } catch (e) {
              setError(e.message)
            } finally {
              setLoading(false)
            }
          }}
          className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/10"
        >
          Load sample art
        </button>
      </div>

      {loading && <p className="text-white/80">Loading…</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(card => (
          <article key={card.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-xl">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={card.image_url} alt={card.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold">{card.title}</h3>
              <p className="text-white/70 text-sm">by {card.artist}</p>
              {card.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {card.tags.map((t, i) => (
                    <span key={i} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">{t}</span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Gallery
