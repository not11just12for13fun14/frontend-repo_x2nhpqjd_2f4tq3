import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function WorkshopsPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', preferred_date: '', message: '' })
  const [status, setStatus] = useState('')
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    setStatus('')
    const res = await fetch(`${API_BASE}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setStatus('Booking request sent!'); setForm({ name: '', email: '', topic: '', preferred_date: '', message: '' }) } else { setStatus('Submission failed') }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-3xl px-6 py-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h1 className="text-3xl font-bold">Workshops & Bookings</h1>
            <p className="mt-2 text-white/80">Book a workshop or request a custom session across art and sustainability themes.</p>
            <form onSubmit={submit} className="mt-6 space-y-3">
              <input name="name" value={form.name} onChange={onChange} placeholder="Your name" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input name="email" type="email" value={form.email} onChange={onChange} placeholder="Your email" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input name="topic" value={form.topic} onChange={onChange} placeholder="Workshop topic" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input name="preferred_date" value={form.preferred_date} onChange={onChange} placeholder="Preferred date" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <textarea name="message" value={form.message} onChange={onChange} placeholder="Notes" rows="4" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <div className="flex items-center gap-3">
                <button className="rounded-lg bg-white/90 text-slate-900 px-5 py-2 font-medium">Request</button>
                {status && <span className="text-white/80 text-sm">{status}</span>}
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default WorkshopsPage
