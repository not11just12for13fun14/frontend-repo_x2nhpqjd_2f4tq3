import React, { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function toWsUrl(pathWithQuery = '') {
  try {
    const httpUrl = new URL(API_BASE)
    const isSecure = httpUrl.protocol === 'https:'
    const wsProto = isSecure ? 'wss:' : 'ws:'
    return `${wsProto}//${httpUrl.host}${pathWithQuery}`
  } catch {
    // Fallback
    return API_BASE.replace(/^http/, 'ws') + pathWithQuery
  }
}

function ChatPage() {
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [media, setMedia] = useState('')
  const [category, setCategory] = useState('General')
  const [items, setItems] = useState([])
  const [online, setOnline] = useState(0)
  const [typing, setTyping] = useState('')

  const wsRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const fetchChat = async () => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    const res = await fetch(`${API_BASE}/chat?${params.toString()}`)
    const data = await res.json()
    setItems(data.items || [])
  }

  // Connect websocket per category
  useEffect(() => {
    // Close existing
    try { wsRef.current?.close() } catch {}
    setOnline(0)
    setTyping('')

    const ws = new WebSocket(toWsUrl(`/ws/chat?category=${encodeURIComponent(category || 'General')}`))
    wsRef.current = ws

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data)
        if (data.type === 'presence') {
          if (typeof data.count === 'number') setOnline(data.count)
        } else if (data.type === 'typing') {
          const who = data.author || 'Someone'
          setTyping(`${who} is typing…`)
          // Clear after 2s
          clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = setTimeout(() => setTyping(''), 2000)
        } else if (data.type === 'message' && data.item) {
          setItems((prev) => [data.item, ...prev])
        }
      } catch {}
    }

    ws.onopen = () => {
      // Ping keepalive every 20s
      const iv = setInterval(() => {
        try { ws.send(JSON.stringify({ type: 'ping' })) } catch {}
      }, 20000)
      ws._pingIv = iv
    }

    ws.onclose = () => {
      if (ws._pingIv) clearInterval(ws._pingIv)
    }

    // Initial history
    fetchChat()

    return () => {
      try { ws.close() } catch {}
    }
  }, [category])

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
  }

  const notifyTyping = () => {
    try { wsRef.current?.send(JSON.stringify({ type: 'typing', author: author || 'Anon' })) } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-3xl font-bold">Community Chat</h1>
              <div className="text-sm text-white/70">Online: {online}</div>
            </div>
            <p className="mt-2 text-white/80">Share updates, artworks, pictures and videos via links. Rooms by category.</p>
            <form onSubmit={send} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder="Your name" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Room (e.g., Architecture)" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input value={media} onChange={(e)=>setMedia(e.target.value)} placeholder="Media URLs (comma separated)" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10 md:col-span-2" />
              <input value={text} onChange={(e)=>{ setText(e.target.value); notifyTyping() }} placeholder="Message" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10 md:col-span-3" />
              <button className="rounded-lg bg-white/90 text-slate-900 px-5 py-2 font-medium">Send</button>
            </form>
            {typing && <div className="mt-2 text-xs text-white/60">{typing}</div>}
          </div>

          <div className="mt-6 space-y-3">
            {items.map((m, i) => (
              <div key={m._id || i} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
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
