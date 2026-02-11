import React from 'react'
import Hero from '../components/Hero'
import CategoryCard from '../components/CategoryCard'
import BrandBanner from '../components/BrandBanner'
import Testimonials from '../components/Testimonials'

const Home = () => {
  return (
    <div >
        <Hero />
        <CategoryCard />
        <BrandBanner />
        <Testimonials />
    </div>
  )
}

export default Home