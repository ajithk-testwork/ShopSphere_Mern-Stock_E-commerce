import React from 'react'
import Hero from '../components/Hero'
import CategoryCard from '../components/CategoryCard'
import BrandBanner from '../components/BrandBanner'
import Testimonials from '../components/Testimonials'
import FeaturedSpotlight from '../components/FeaturedSpotlight'
import InfoShowcase from '../components/InfoShowcase'

const Home = () => {
  return (
    <div >
        <Hero />
        <CategoryCard />
        <BrandBanner />
        <Testimonials />
        {/* <FeaturedSpotlight /> */}
        <InfoShowcase />
        
    </div>
  )
}

export default Home