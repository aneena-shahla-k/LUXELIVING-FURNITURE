import React from 'react'
import ProjectLatest from '../Components/Project/Project-Latest/ProjectLatest'
import ProjectHow from '../Components/Project/Project-How/ProjectHow'
import ProjectTestimonial from '../Components/Project/Project-Testimonial/ProjectTestimonial'
import ProjectFAQ from '../Components/Project/Project-FAQ/ProjectFAQ'
import ScrollTop from '../Components/ScrollTop'
import ScrollToTop from '../Components/ScrollToTop'

export default function Project() {
  return (
    <div>
      <ScrollTop/>
        <ProjectLatest/>
        <ProjectHow/>
        <ProjectTestimonial/>
        <ProjectFAQ/>
        <ScrollToTop/>
    </div>
  )
}
