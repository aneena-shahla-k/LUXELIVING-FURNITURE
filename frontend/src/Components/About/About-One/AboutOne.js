import React from 'react'
import "./AboutOne.css"
import img1 from "../../../assets/images/about/AboutOne.jpg"

export default function AboutOne() {
  return (
    <div>
        <section className="about-clean section-space">
                <div className="container">
                    <div className="row align-items-center">
 
                        <div className="col-lg-5">
                            <span className="about-label">ABOUT LUXELIVING</span>
                            <h2 className="about-title">Designing Spaces That Feel Like Home</h2>
            
                            <p className="about-text text-muted">
                            We create premium interiors using modern materials and timeless
                            craftsmanship. Our designs focus on elegance, comfort, and
                            functionality — crafted for modern living.
                            </p>


                            <p className="about-signature">— LuxeLiving Studio</p>
                        </div>

                        <div className="col-lg-7 d-flex justify-content-center">   
                            <img src={img1} className="about-image" alt="Interior Design" />
                        </div>

                    </div>
                </div>
        </section>
    </div>
  )
}
