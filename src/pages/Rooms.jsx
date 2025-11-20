import React, { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const disciplines = [
  'Architecture','Performing Art','Dance','Music','Cinema','Photography','Theater','Littérature','Puppets Art','Slam','Poetry'
]

function RoomsPage() {
  const [form, setForm] = useState({ title: '', discipline: '' })
  const [rooms, setRooms] = useState([])
  const [filters, setFilters] = useState({ discipline: '', status: 'open' })
  const [activeRoom, setActiveRoom] = useState(null)
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [media, setMedia] = useState('')
  const [pin, setPin] = useState('')

  const fetchRooms = async () => {
    const url = new URL(`${API_BASE}/rooms`)
    if (filters.discipline) url.searchParams.set('discipline', filters.discipline)
    if (filters.status) url.searchParams.set('status', filters.status)
    const res = await fetch(url)
    const data = await res.json().catch(()=>({items:[]}))
    setRooms(data.items || [])
  }

  useEffect(()=>{ fetchRooms() }, [filters.discipline, filters.status])

  const create = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        title: form.title, discipline: form.discipline || undefined, pinned_media: [], status: 'open'
      })
    })
    if (res.ok) { setForm({ title: '', discipline: '' }); fetchRooms() }
  }

  const loadMessages = async (room) => {
    setActiveRoom({ ...room, messages: [] })
    const res = await fetch(`${API_BASE}/rooms/${room._id}/messages`)
    const data = await res.json().catch(()=>({items:[]}))
    setActiveRoom(r => r ? { ...r, messages: data.items || [] } : null)
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!activeRoom) return
    await fetch(`${API_BASE}/rooms/${activeRoom._id}/messages`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        room_id: activeRoom._id, author: author || 'Anon', text: text || undefined,
        media_urls: media ? media.split(',').map(u=>u.trim()).filter(Boolean) : []
      })
    })
    setText(''); setMedia('')
    loadMessages(activeRoom)
  }

  const pinMedia = async () => {
    if (!activeRoom || !pin) return
    const fd = new FormData(); fd.append('url', pin)
    const res = await fetch(`${API_BASE}/rooms/${activeRoom._id}/pin`, { method: 'POST', body: fd })
    if (res.ok) { setPin(''); fetchRooms(); loadMessages(activeRoom) }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-bold">Live Rooms</h1>
          <p className="mt-2 text-white/80">Open a live session room with real-time chat and pinned media.</p>
        </section>

        <section className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-8 pb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Create a Room</h2>
            <form onSubmit={create} className="mt-4 space-y-3">
              <input value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} placeholder="Room title" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" required />
              <select value={form.discipline} onChange={(e)=>setForm({...form, discipline: e.target.value})} className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10">
                <option value="">Discipline</option>
                {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button className="rounded-lg bg-white/90 text-slate-900 px-5 py-2 font-medium">Open Room</button>
            </form>

            {activeRoom && (
              <div className="mt-6 border-t border-white/10 pt-4">
                <h3 className="font-medium">Active Room: {activeRoom.title}</h3>
                <div className="mt-2 text-sm text-white/70">Pinned media:</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(activeRoom.pinned_media || []).map((u, i) => (
                    <a key={i} href={u} target="_blank" className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Pin {i+1}</a>
                  ))}
                  {(activeRoom.pinned_media || []).length === 0 && <div className="text-white/60 text-sm">None</div>}
                </div>
                <div className="mt-3 flex gap-2">
                  <input value={pin} onChange={(e)=>setPin(e.target.value)} placeholder="Media URL to pin" className="flex-1 rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
                  <button onClick={pinMedia} className="rounded-lg bg-white/90 text-slate-900 px-4">Pin</button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Rooms</h2>
              <div className="flex gap-2">
                <select value={filters.discipline} onChange={(e)=>setFilters({...filters, discipline: e.target.value})} className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10">
                  <option value="">All</option>
                  {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filters.status} onChange={(e)=>setFilters({...filters, status: e.target.value})} className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {rooms.map((r) => (
                <li key={r._id} className={`rounded-xl border border-white/10 bg-slate-900/40 p-4 ${activeRoom && activeRoom._id===r._id ? 'ring-1 ring-white/30' : ''}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{r.title}</div>
                      <div className="text-sm text-white/70">{r.discipline || '—'} • {r.status || 'open'}</div>
                    </div>
                    <button onClick={()=>loadMessages(r)} className="rounded bg-white/90 text-slate-900 px-3 py-1">Open</button>
                  </div>
                </li>
              ))}
              {rooms.length === 0 && <li className="text-white/70">No rooms open.</li>}
            </ul>

            {activeRoom && (
              <div className="mt-6">
                <h3 className="font-medium">Chat</h3>
                <form onSubmit={sendMessage} className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Your name" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
                  <input value={media} onChange={(e)=>setMedia(e.target.value)} placeholder="Media URLs" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10 md:col-span-2" />
                  <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Message" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10 md:col-span-3" />
                  <button className="rounded-lg bg-white/90 text-slate-900 px-5 py-2 font-medium">Send</button>
                </form>
                <div className="mt-3 space-y-2 max-h-80 overflow-auto pr-1">
                  {(activeRoom.messages || []).map((m) => (
                    <div key={m._id} className="rounded border border-white/10 bg-slate-900/60 p-2">
                      <div className="text-xs text-white/60">{m.author}</div>
                      {m.text && <div className="text-sm">{m.text}</div>}
                      {m.media_urls && m.media_urls.length>0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {m.media_urls.map((u, i) => (
                            <a key={i} href={u} target="_blank" className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Media {i+1}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default RoomsPage
