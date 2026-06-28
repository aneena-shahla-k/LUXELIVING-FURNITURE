import React from 'react'
import img from "../../../assets/images/home/image.png"
import "./HomeAboutOne.css"
import { Link } from 'react-router-dom'


export default function HomeAboutOne() {
  return (
    <div>
        <section className="about-section">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-lg-6 mb-4 mb-lg-0">
                            <div className="image-stack position-relative d-flex align-items-center justify-content-center">
                                <img src={img} className="img-fluid" alt="about" style={{width: "300px", height: "450px", borderRadius: "10%"}} />
                            </div>
                    </div>

                    <div className="col-lg-6 ps-lg-5">
                        <small className="text-muted d-block mb-2 small mt-5">ABOUT US</small>
                        <h1 className="display-5 fw-bold mb-4">Excellence In Every Detail</h1>
                        <p className="text-muted mb-4 lead">LuxeLiving is a leading furniture manufacturer known worldwide for its impeccable quality, exceptional customer service, and affordable prices. This is a family-owned, professional furniture company conveniently nestled in the heart of New York.</p>
                        <Link to="/about" className="btn btn-green mt-3">Learn More</Link>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}