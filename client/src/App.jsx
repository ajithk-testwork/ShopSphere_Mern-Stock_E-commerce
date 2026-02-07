import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/navbar'
import Home from './pages/Home';

function App() {

  return (
    <Router>
      <div className="antialiased text-slate-900 min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </main>
      </div>
    </Router>
  )
}

export default App
