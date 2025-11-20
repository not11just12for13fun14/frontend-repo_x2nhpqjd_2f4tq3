import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import SubmitForm from './components/SubmitForm'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <SubmitForm />
        <footer id="about" className="mx-auto max-w-6xl px-6 py-16 text-white/70">
          <p>
            Built with an interactive glass-inspired 3D cover, this gallery lets you browse and submit digital artworks in a clean, modern space.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
