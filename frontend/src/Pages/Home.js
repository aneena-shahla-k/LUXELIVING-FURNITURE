import React from 'react'
import Carousel  from '../Components/Home/Carousel/Carousel'
import HomeAbout  from '../Components/Home/Home-About/HomeAbout'
import HomeCategory from '../Components/Home/Home-Category/HomeCategory'
import HomeSLook from '../Components/Home/Home-SLook/HomeSLook'
import HomeFounder from '../Components/Home/Home-Founder/HomeFounder'
import ScrollTop from '../Components/ScrollTop'
import ScrollToTop from '../Components/ScrollToTop'
import HomeAboutOne from '../Components/Home/Home-AboutOne/HomeAboutOne'

export default function Home() {
  return (
    <div>
      <ScrollTop/>
        < Carousel />
        < HomeAboutOne />
        < HomeAbout />
        < HomeCategory />
        < HomeSLook />
        < HomeFounder />
        <ScrollToTop/>
    </div>
  )
}
