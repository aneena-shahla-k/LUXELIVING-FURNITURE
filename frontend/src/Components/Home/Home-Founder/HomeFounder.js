import React from 'react'
import { Link } from 'react-router-dom'
import "./HomeFounder.css"
import img from "../../../assets/images/home/lilly.jpg"
import img1 from "../../../assets/images/home/img-card1.JPG"
import img2 from "../../../assets/images/home/img-card2.JPG"
import img3 from "../../../assets/images/home/img-card3.JPG"
import img4 from "../../../assets/images/home/img-card5.JPG"

export default function HomeFounder() {
  return (
    <div>
        <section className="founder-section">
            <div className="container">
                <div className="row align-items-center text-center text-lg-start mb-5">

                    <div className="col-lg-7 col-md-12">
                        <div className="profile d-flex align-items-center mb-4">
                            <img src={img} className="rounded-circle me-2" width="42" height="42" alt="lilly" />
                            <p className="mb-0 small">Hey, I'm <strong>Lilly</strong>, <br /> Founder of <strong>Luxe</strong>Living</p>
                        </div>

                        <h1 className="founder-title">
                            Designing Spaces, <br />
                            Defining Styles.
                        </h1>
                    </div>

                        <div className="col-lg-5 col-md-12 mt-4 mt-lg-0">
                            <p className="intro-text text-muted">
                                An interior designer passionate about transforming spaces into beautiful,
                                functional, and inspiring environments.
                            </p>
                            <Link to="/contact" className="btn btn-dark rounded-pill px-4 mt-3">CONTACT US</Link>
                        </div>
                </div>

                    <div className="row g-4">

                        <div className="col-lg-3 col-md-6">
                            <div className="img-card" data-aos="zoom-out" data-aos-duration="2000">
                                <img src={img1} alt="" />
                                <div className="img-card-text text-center">
                                    <h5>8+</h5>
                                    <span>Years Experience</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-6">
                            <div className="img-card" data-aos="zoom-out"  data-aos-duration="2000" >
                                <img src={img2} alt="" />
                                <div className="img-card-text text-center ">
                                    <h5>1500+</h5>
                                    <span>Projects Submit</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-6">
                            <div className="img-card" data-aos="zoom-out" data-aos-duration="2000">
                                <img src={img3} alt=""  />
                                <div className="img-card-text text-center">
                                    <h5>500+</h5>
                                    <span>Homes Designed</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-3 col-md-6">
                            <div className="img-card" data-aos="zoom-out" data-aos-duration="2000">
                                <img src={img4} alt="" />
                                <div className="img-card-text text-center">
                                    <h5>5000+</h5>
                                    <span>Happy Customers</span>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                
            </div>
     </section>
    </div>
  )
}
