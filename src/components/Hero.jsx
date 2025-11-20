import React from 'react'
import Spline from '@splinetool/react-spline'

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/ESO6PnMadasO0hU3/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient overlay to improve text contrast; pointer-events-none so Spline stays interactive */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950/80" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 flex min-h-[80vh] items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Interactive 3D cover • Digital Art Gallery
          </div>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-[0_6px_40px_rgba(56,189,248,0.25)]">
            Diversity / Diverse City
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80">
            A modern gallery experience featuring vibrant digital works and interactive motion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#gallery" className="rounded-lg bg-white/90 text-slate-900 px-5 py-2.5 font-medium shadow-xl shadow-cyan-500/20 hover:bg-white transition">
              Explore Gallery
            </a>
            <a href="#submit" className="rounded-lg border border-white/20 bg-white/5 text-white px-5 py-2.5 font-medium backdrop-blur hover:bg-white/10 transition">
              Submit Artwork
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
