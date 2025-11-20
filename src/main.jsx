import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Test from './Test'
import PracticesPage from './pages/Practices'
import MapPage from './pages/Map'
import ChatPage from './pages/Chat'
import ContactPage from './pages/Contact'
import WorkshopsPage from './pages/Workshops'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<Test />} />
        <Route path="/practices" element={<PracticesPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
