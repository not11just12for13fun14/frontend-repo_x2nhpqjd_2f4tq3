import React, { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const PracticeList = () => {
  const [city, setCity] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPractices = async () => {
    setLoading(true)
    setError('')
    try {
      const q = city ? `?city=${encodeURIComponent(city)}` : ''
      const res = await fetch(`${API_BASE}/practices${q}`)
      if (!res.ok) throw new Error('Failed to load practices')
      const data = await res.json()
      setItems(data?.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPractices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Sustainable Practices</h2>
          <p className="text-white/70">Discover initiatives by city and share your own.</p>
        </div>
        <div className="flex items-center gap-3">
          <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="Filter by city"
            className="rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
          <button onClick={loadPractices} className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/10">Apply</button>
        </div>
      </div>
      {loading && <p className="text-white/80">Loading…</p>}
      {error && <p className="text-rose-300">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p, idx) => (
          <article key={p._id || idx} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-white font-semibold">{p.title}</h3>
                {p.impact_score ? (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-xs text-emerald-300">Impact {p.impact_score}/5</span>
                ) : null}
              </div>
              <p className="text-white/70 text-sm">{p.city}{p.category ? ` • ${p.category}` : ''}</p>
              {p.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t, i) => (
                    <span key={i} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80">{t}</span>
                  ))}
                </div>
              ) : null}
              {p.description ? <p className="mt-3 text-white/80 text-sm">{p.description}</p> : null}
              {p.source_url ? <a href={p.source_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-cyan-300 hover:underline">Source</a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PracticeList
