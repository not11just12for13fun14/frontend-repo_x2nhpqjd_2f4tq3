import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function ChatPage() {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [media, setMedia] = useState('')
  const [category, setCategory] = useState('General')
  const [items, setItems] = useState([])

  const fetchChat = async () => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    const res = await fetch(`${API_BASE}/chat?${params.toString()}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  useEffect(() => { fetchChat() }, [category])

  const send = async (e) => {
    e.preventDefault()
    const payload = {
      author: author || 'Anonymous',
      text: text || undefined,
      media_urls: media ? media.split(',').map(u => u.trim()).filter(Boolean) : [],
      category: category || undefined,
    }
    await fetch(`${API_BASE}/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    setText(''); setMedia('')
    fetchChat()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h1 className="text-3xl font-bold">Community Chat</h1>
            <p className="mt-2 text-white/80">Share updates, artworks, pictures and videos via links. Rooms by category.</p>
            <form onSubmit={send} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Your name" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Room (e.g., Architecture)" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input value={media} onChange={(e)=>setMedia(e.target.value)} placeholder="Media URLs (comma separated)" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10 md:col-span-2" />
              <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Message" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10 md:col-span-3" />
              <button className="rounded-lg bg-white/90 text-slate-900 px-5 py-2 font-medium">Send</button>
            </form>
          </div>

          <div className="mt-6 space-y-3">
            {items.map((m, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-sm text-white/60">{m.author} {m.category ? `• ${m.category}` : ''}</div>
                {m.text && <div className="mt-1">{m.text}</div>}
                {m.media_urls && m.media_urls.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {m.media_urls.map((u, idx) => (
                      <a key={idx} href={u} target="_blank" className="block rounded-lg overflow-hidden border border-white/10">
                        <img src={u} alt="media" className="aspect-video object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ChatPage
