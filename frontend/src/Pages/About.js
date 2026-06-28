import React from 'react'
import AboutOne from '../Components/About/About-One/AboutOne'
import AboutProject from '../Components/About/About-Project/AboutProject'
import AboutWhy from '../Components/About/About-Why/AboutWhy'
import ScrollTop from '../Components/ScrollTop'
import ScrollToTop from '../Components/ScrollToTop'

export default function About() {
  return (
    <div>
      <ScrollTop/>
        < AboutOne />
        < AboutProject />
        < AboutWhy />
        <ScrollToTop/>
    </div>
  )
}
