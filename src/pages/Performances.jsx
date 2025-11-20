import React, { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const disciplines = [
  'Architecture',
  'Performing Art',
  'Dance',
  'Music',
  'Cinema',
  'Photography',
  'Theater',
  'Littérature',
  'Puppets Art',
  'Slam',
  'Poetry',
]

function pickSupportedMime(preferAudioOnly) {
  const candidates = preferAudioOnly
    ? [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
      ]
    : [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ]
  for (const mt of candidates) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported?.(mt)) return mt
  }
  // Fallback
  return preferAudioOnly ? 'audio/webm' : 'video/webm'
}

function useRecorder({ audioOnly = false, maxDurationSec = 60 } = {}) {
  const [recording, setRecording] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [previewUrl, setPreviewUrl] = useState('')
  const [blob, setBlob] = useState(null)
  const [error, setError] = useState('')
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)

  const start = async () => {
    setError('')
    setPreviewUrl('')
    setBlob(null)
    chunksRef.current = []
    setElapsed(0)

    // Short countdown UX
    setCountdown(3)
    await new Promise((resolve) => {
      const iv = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(iv)
            resolve()
            return 0
          }
          return c - 1
        })
      }, 450)
    })

    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: audioOnly
          ? false
          : {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30 },
            },
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      const mimeType = pickSupportedMime(audioOnly)
      const rec = new MediaRecorder(stream, { mimeType })
      recorderRef.current = rec
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = () => {
        const type = mimeType || (audioOnly ? 'audio/webm' : 'video/webm')
        const b = new Blob(chunksRef.current, { type })
        setBlob(b)
        const url = URL.createObjectURL(b)
        setPreviewUrl(url)
        // stop tracks
        try {
          streamRef.current?.getTracks?.().forEach((t) => t.stop())
        } catch {}
        streamRef.current = null
        // stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }
      }
      rec.start(500)
      setRecording(true)

      // elapsed timer and auto-stop
      const startedAt = Date.now()
      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startedAt) / 1000)
        setElapsed(sec)
        if (sec >= maxDurationSec) {
          stop()
        }
      }, 200)
    } catch (e) {
      setError(e?.message || 'Unable to start recording')
      setRecording(false)
      try {
        streamRef.current?.getTracks?.().forEach((t) => t.stop())
      } catch {}
      streamRef.current = null
    }
  }

  const stop = () => {
    if (recorderRef.current && recording) {
      try { recorderRef.current.stop() } catch {}
      setRecording(false)
    }
  }

  const reset = () => {
    setPreviewUrl('')
    setBlob(null)
    chunksRef.current = []
    setElapsed(0)
    setError('')
  }

  return { recording, countdown, elapsed, previewUrl, blob, error, start, stop, reset }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function PerformancesPage() {
  const [form, setForm] = useState({
    title: '',
    artist: '',
    discipline: '',
    city: '',
    scheduled_at: '',
    live_url: '',
    recording_urls: '',
    description: '',
    tags: '',
  })
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [q, setQ] = useState({ city: '', discipline: '' })

  const [audioOnly, setAudioOnly] = useState(false)
  const [maxDurationSec, setMaxDurationSec] = useState(60)

  const { recording, countdown, elapsed, previewUrl, blob, error, start, stop, reset } = useRecorder({ audioOnly, maxDurationSec })

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const parsedRecordingUrls = useMemo(() => {
    return form.recording_urls
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [form.recording_urls])

  const parsedTags = useMemo(() => {
    return form.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }, [form.tags])

  const submit = async (e) => {
    e.preventDefault()
    setStatus('')
    const payload = {
      title: form.title,
      artist: form.artist,
      discipline: form.discipline || undefined,
      city: form.city || undefined,
      scheduled_at: form.scheduled_at || undefined,
      live_url: form.live_url || undefined,
      recording_urls: parsedRecordingUrls,
      description: form.description || undefined,
      tags: parsedTags,
    }
    const res = await fetch(`${API_BASE}/performances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setStatus('Performance submitted!')
      setForm({ title: '', artist: '', discipline: '', city: '', scheduled_at: '', live_url: '', recording_urls: '', description: '', tags: '' })
      fetchItems()
    } else {
      setStatus('Submission failed')
    }
  }

  const fetchItems = async () => {
    const url = new URL(`${API_BASE}/performances`)
    if (q.city) url.searchParams.set('city', q.city)
    if (q.discipline) url.searchParams.set('discipline', q.discipline)
    const res = await fetch(url)
    const data = await res.json().catch(() => ({ items: [] }))
    setItems(Array.isArray(data.items) ? data.items : [])
  }

  useEffect(() => { fetchItems() }, [])

  const uploadRecording = async () => {
    if (!blob) return
    setStatus('Uploading...')
    const fd = new FormData()
    const filename = `${audioOnly ? 'audio' : 'recording'}-${Date.now()}.${audioOnly ? 'webm' : 'webm'}`
    fd.append('file', new File([blob], filename, { type: blob.type || (audioOnly ? 'audio/webm' : 'video/webm') }))
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd })
      if (!res.ok) { setStatus('Upload failed'); return }
      const data = await res.json()
      const current = form.recording_urls ? form.recording_urls + ', ' : ''
      setForm({ ...form, recording_urls: current + (data.url || '') })
      setStatus('Recording uploaded')
      reset()
    } catch (e) {
      setStatus('Upload failed')
    }
  }

  const sizeMB = blob ? (blob.size / (1024 * 1024)).toFixed(2) : null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-3xl font-bold">Live & Multidisciplinary Performances</h1>
          <p className="mt-2 text-white/80">Share your live performance details, streaming links, and recordings. Browse community performances across disciplines.</p>
        </section>

        <section className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-8 pb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold">Submit a Performance</h2>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" required />
              <input name="artist" value={form.artist} onChange={onChange} placeholder="Artist / Group" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select name="discipline" value={form.discipline} onChange={onChange} className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10">
                  <option value="">Discipline</option>
                  {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input name="city" value={form.city} onChange={onChange} placeholder="City" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              </div>
              <input name="scheduled_at" value={form.scheduled_at} onChange={onChange} placeholder="Scheduled date/time" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input name="live_url" value={form.live_url} onChange={onChange} placeholder="Live stream URL (YouTube, Twitch, etc.)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <textarea name="recording_urls" value={form.recording_urls} onChange={onChange} placeholder="Recording URLs (comma-separated)" rows="2" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Short description" rows="3" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <input name="tags" value={form.tags} onChange={onChange} placeholder="Tags (comma-separated)" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
              <div className="flex items-center gap-3">
                <button className="rounded-lg bg-white/90 text-slate-900 px-5 py-2 font-medium">Submit</button>
                {status && <span className="text-white/80 text-sm">{status}</span>}
              </div>
            </form>

            <div className="mt-6 border-t border-white/10 pt-4">
              <h3 className="font-medium">Record a clip</h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" checked={audioOnly} onChange={(e)=>setAudioOnly(e.target.checked)} />
                  Audio-only
                </label>
                <label className="text-sm">
                  <span className="mr-2">Max length</span>
                  <select className="rounded bg-slate-900/60 border border-white/10 px-2 py-1" value={maxDurationSec} onChange={(e)=>setMaxDurationSec(Number(e.target.value))}>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                    <option value={120}>120s</option>
                  </select>
                </label>
                <div className="text-sm text-white/70 flex items-center">{recording ? `Elapsed ${formatTime(elapsed)}` : (blob ? `${sizeMB} MB` : 'Ready')}</div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!recording && !countdown && <button onClick={start} className="rounded bg-emerald-400/90 text-slate-900 px-3 py-1">Start</button>}
                {countdown > 0 && <span className="rounded bg-amber-400/90 text-slate-900 px-3 py-1">{countdown}</span>}
                {recording && <button onClick={stop} className="rounded bg-rose-400/90 text-slate-900 px-3 py-1">Stop</button>}
                {previewUrl && <button onClick={uploadRecording} className="rounded bg-white/90 text-slate-900 px-3 py-1">Upload</button>}
                {previewUrl && <button onClick={reset} className="rounded bg-white/20 px-3 py-1">Reset</button>}
                {error && <span className="text-rose-300 text-sm ml-2">{error}</span>}
              </div>

              {previewUrl && (
                audioOnly ? (
                  <audio className="mt-3 w-full" src={previewUrl} controls />
                ) : (
                  <video className="mt-3 w-full rounded-lg border border-white/10" src={previewUrl} controls />
                )
              )}
              {!previewUrl && recording && (
                <div className="mt-3 text-sm text-white/70">Recording... stop to preview.</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Community Performances</h2>
              <div className="flex gap-2">
                <input value={q.city} onChange={(e)=>setQ({ ...q, city: e.target.value })} placeholder="Filter by city" className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10" />
                <select value={q.discipline} onChange={(e)=>setQ({ ...q, discipline: e.target.value })} className="rounded-lg bg-slate-900/60 px-3 py-2 border border-white/10">
                  <option value="">All</option>
                  {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={fetchItems} className="rounded-lg bg-white/90 text-slate-900 px-4">Apply</button>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {items.map((p) => (
                <li key={p._id || p.title} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{p.title}</div>
                      <div className="text-sm text-white/70">{p.artist} • {p.discipline || '—'} {p.city ? `• ${p.city}` : ''}</div>
                    </div>
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" className="text-cyan-300 hover:text-cyan-200 underline">Live</a>
                    )}
                  </div>
                  {p.description && <p className="mt-2 text-white/80 text-sm">{p.description}</p>}
                  {Array.isArray(p.recording_urls) && p.recording_urls.length > 0 && (
                    <div className="mt-2 text-sm">
                      <div className="text-white/70">Recordings:</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.recording_urls.map((u, idx) => (
                          <a key={idx} href={u} target="_blank" className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/20">Link {idx+1}</a>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
              {items.length === 0 && <li className="text-white/70">No performances yet.</li>}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PerformancesPage
