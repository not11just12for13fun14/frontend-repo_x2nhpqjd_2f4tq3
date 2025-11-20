import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const SubmitForm = () => {
  const [form, setForm] = useState({ title: '', artist: '', image_url: '', description: '', tags: '' })
  const [status, setStatus] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('')
    try {
      const payload = {
        title: form.title,
        artist: form.artist,
        image_url: form.image_url,
        description: form.description || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      }
      const res = await fetch(`${API_BASE}/api/artworks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to submit')
      setStatus('Thanks! Your artwork was submitted.')
      setForm({ title: '', artist: '', image_url: '', description: '', tags: '' })
    } catch (e) {
      setStatus(e.message)
    }
  }

  return (
    <section id="submit" className="relative mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Submit your artwork</h2>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={onChange} placeholder="Title" required className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
          <input name="artist" value={form.artist} onChange={onChange} placeholder="Artist" required className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        </div>
        <input name="image_url" value={form.image_url} onChange={onChange} placeholder="Image URL" required className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        <textarea name="description" value={form.description} onChange={onChange} placeholder="Description (optional)" rows="3" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        <input name="tags" value={form.tags} onChange={onChange} placeholder="Tags (comma separated)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder-white/50 outline-none border border-white/10" />
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-lg bg-white/90 text-slate-900 px-5 py-2.5 font-medium shadow-xl shadow-cyan-500/20 hover:bg-white transition">Submit</button>
          {status && <p className="text-sm text-white/80">{status}</p>}
        </div>
      </form>
    </section>
  )
}

export default SubmitForm
