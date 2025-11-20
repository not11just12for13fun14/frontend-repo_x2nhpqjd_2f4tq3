import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const PracticeSubmit = () => {
  const [form, setForm] = useState({
    title: '',
    city: '',
    description: '',
    category: '',
    tags: '',
    impact_score: '',
    source_url: ''
  })
  const [status, setStatus] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    try {
      const payload = {
        title: form.title,
        city: form.city,
        description: form.description || undefined,
        category: form.category || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        impact_score: form.impact_score ? Number(form.impact_score) : undefined,
        source_url: form.source_url || undefined,
      }
      const res = await fetch(`${API_BASE}/practices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('Thanks! Your sustainable practice was submitted.')
      setForm({ title: '', city: '', description: '', category: '', tags: '', impact_score: '', source_url: '' })
    } catch (e) {
      setStatus(e.message)
    }
  }

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Share a sustainable practice in your city</h2>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={onChange} placeholder="Practice title" required className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
          <input name="city" value={form.city} onChange={onChange} placeholder="City" required className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="category" value={form.category} onChange={onChange} placeholder="Category (transport, energy, waste)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
          <input name="impact_score" type="number" min="1" max="5" value={form.impact_score} onChange={onChange} placeholder="Impact (1-5)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        </div>
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description" rows="3" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        <input name="tags" value={form.tags} onChange={onChange} placeholder="Tags (comma separated)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        <input name="source_url" value={form.source_url} onChange={onChange} placeholder="Reference URL (optional)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-lg bg-white/90 text-slate-900 px-5 py-2.5 font-medium shadow-xl shadow-emerald-500/20 hover:bg-white transition">Submit</button>
          {status && <p className="text-sm text-white/80">{status}</p>}
        </div>
      </form>
    </section>
  )
}

export default PracticeSubmit
