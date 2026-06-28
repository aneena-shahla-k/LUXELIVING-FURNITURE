import React from 'react'
import { Link } from 'react-router-dom'
import "./HomeSLook.css"
import img1 from "../../../assets/images/home/living room.jpg"
import img2 from "../../../assets/images/home/bedroom.jpg"
import img3 from "../../../assets/images/home/dining.jpg"

export default function HomeSLook() {
  return (
    <div>
        <section className="room-section py-5">
                <div className="container text-center mb-5">
                    <div className="section-title mb-5 mt-5">
                        <small>SHOP THE LOOK</small>
                    </div>

                    <div className="row justify-content-center g-5">

                        {/* <!-- Card 1 --> */}
                        <div className="col-lg-3 col-md-5 col-sm-10">
                            <div className="glass-card">
                                <Link to="/collection/collection-slook/living">
                                <img src={img1} className="card-img" alt="Places" />
                                    <div className="card-content text-center">
                                        <span className="line"> Living Room</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* <!-- Card 2 --> */}
                        <div className="col-lg-3 col-md-5 col-sm-10">
                            <div className="glass-card">
                                <Link to="/collection/collection-slook/bedroom">
                                <img src={img2} className="card-img" alt="Apogee" />
                                    <div className="card-content text-center">
                                        <span className="line">Bed Room</span> 
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* <!-- Card 3 --> */}
                        <div className="col-lg-3 col-md-5 col-sm-10">
                            <div className="glass-card">
                                <Link to="/collection/collection-slook/dining">
                                <img src={img3} className="card-img" alt="MilkBath" />
                                    <div className="card-content text-center">
                                        <span className="line">Dining Area</span> 
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                    <div className="d-flex align-items-center justify-content-center m-5">
                            <Link to="/collection" className="btn btn-view">View More</Link>
                    </div>
        
                </div>
        </section>
    </div>
  )
}
