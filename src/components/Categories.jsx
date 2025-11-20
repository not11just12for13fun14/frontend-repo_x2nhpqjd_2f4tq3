import React from 'react'

const categories = [
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

const Categories = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16" id="categories">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Diversity of Expressions</h2>
        <p className="mt-2 text-white/80">Explore creative disciplines across cities and communities.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <a key={c} href={`/practices?category=${encodeURIComponent(c)}`} className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/10 transition">
            <div className="text-lg font-semibold">{c}</div>
            <div className="mt-1 text-sm text-white/70 group-hover:text-white/90">See initiatives</div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Categories
