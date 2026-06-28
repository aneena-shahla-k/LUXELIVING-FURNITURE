import React from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./AboutWhy.css"
import img from "../../../assets/images/about/img-card4.JPG"

export default function AboutWhy() {
  return (
    <div>
        <section className="why-choose-section section-space">
                <div className="container">
                    <div className="row align-items-center gy-4">

                        <div className="col-lg-6">
                            <small className="text-uppercase text-muted m-3">Why Choose Us</small>
                            <h2 className="fw-bold m-3">
                            We Provide Better<br />Interior Solutions
                            </h2>
                            <p className="text-muted m-3">
                            We combine creativity, craftsmanship, and modern technology
                            to deliver elegant and functional spaces.
                            </p>

                            <div className="row m-3">
                                <div className="col-sm-6 mb-4">
                                    <div className="feature-box">
                                    <i className="bi bi-truck"></i>
                                    <div>
                                        <h6>Fast & Free Shipping</h6>
                                        <p>Reliable delivery with premium care</p>
                                    </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 mb-4">
                                    <div className="feature-box">
                                    <i className="bi bi-bag-check"></i>
                                    <div>
                                        <h6>Easy to Shop</h6>
                                        <p>Seamless shopping experience</p>
                                    </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 mb-4">
                                    <div className="feature-box">
                                    <i className="bi bi-headset"></i>
                                    <div>
                                        <h6>24/7 Support</h6>
                                        <p>Always here to help you</p>
                                    </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 mb-4">
                                    <div className="feature-box">
                                    <i className="bi bi-arrow-repeat"></i>
                                    <div>
                                        <h6>Hassle Free Returns</h6>
                                        <p>Easy & transparent returns</p>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="col-lg-6 position-relative text-center">
                            <img src={img} className="img-fluid rounded-5 why-img" alt="Interior Design" />
                        </div>

                    </div>
                </div>
        </section>
    </div>
  )
}
