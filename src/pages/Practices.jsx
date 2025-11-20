import React from 'react'
import Navbar from '../components/Navbar'
import PracticeList from '../components/PracticeList'
import PracticeSubmit from '../components/PracticeSubmit'
import Categories from '../components/Categories'

function PracticesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="pt-20">
        <section className="mx-auto max-w-6xl px-6 pt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h1 className="text-3xl font-bold">Sustainable City Practices</h1>
            <p className="mt-2 text-white/80">Explore and contribute practical sustainability initiatives happening around the world.</p>
          </div>
        </section>
        <Categories />
        <PracticeSubmit />
        <PracticeList />
      </main>
    </div>
  )
}

export default PracticesPage
