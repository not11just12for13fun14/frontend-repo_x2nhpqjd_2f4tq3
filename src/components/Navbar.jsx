import React from 'react'
import { Menu, GalleryHorizontalEnd, Sparkles } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <div className="rounded-lg bg-cyan-400/20 p-2 text-cyan-300">
              <GalleryHorizontalEnd size={18} />
            </div>
            <span className="font-semibold">Digital Gallery</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <a href="#gallery" className="hover:text-white">Gallery</a>
            <a href="#submit" className="hover:text-white">Submit</a>
            <a href="#about" className="hover:text-white">About</a>
          </nav>
          <button className="md:hidden rounded-lg border border-white/10 p-2 text-white/80">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
