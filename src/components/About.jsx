function About() {
  return (
    <section id="about" className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 backdrop-blur">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">About the Artist</h2>
          <p className="mt-4 text-blue-100/90 leading-relaxed">
            Blending technology with modern aesthetics, this work explores light, depth, and motion.
            Each piece is crafted to evoke a sense of presence and interactivity, inviting the viewer to
            engage beyond the surface.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-blue-200/70">Medium</p>
              <p className="mt-1 text-white font-semibold">Digital & 3D</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-blue-200/70">Themes</p>
              <p className="mt-1 text-white font-semibold">Futurism, Glass, Light</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-blue-200/70">Location</p>
              <p className="mt-1 text-white font-semibold">Global / Remote</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
