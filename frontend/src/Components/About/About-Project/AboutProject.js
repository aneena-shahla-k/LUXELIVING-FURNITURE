import React from 'react'
import { Link } from 'react-router-dom'
import "./AboutProject.css"
import pro1 from "../../../assets/images/about/project1.png"
import pro2 from "../../../assets/images/about/project2.png"
import pro3 from "../../../assets/images/about/project3.png"
import pro4 from "../../../assets/images/about/project4.jpg"
import pro5 from "../../../assets/images/about/project5.jpg"
import pro6 from "../../../assets/images/about/project6.jpg"

export default function AboutProject() {
  return (
    <div>
        <section className="about-projects-section section-space">
                <div className="container">

                    <div className="d-flex justify-content-between align-items-start flex-wrap mb-5">
                        <div>
                            <h2 className="section-title">Check Our Latest Projects</h2>
                            <p className="section-subtitle">
                            We design timeless interiors that balance comfort, elegance, and functionality.
                            </p>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
                            <img src={pro1} className="project-img" alt='' />
                        </div>

                        <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
                            <img src={pro2} className="project-img" alt='' />
                        </div>

                        <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
                            <img src={pro3} className="project-img" alt=''/>
                        </div>

                        <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
                            <img src={pro4} className="project-img" alt=''/>
                        </div>

                        <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
                            <img src={pro5} className="project-img" alt=''/>
                        </div>

                        <div className="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-duration="1500">
                            <img src={pro6} className="project-img" alt=''/>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-center mt-3">
                        <Link to="/project" className="btn view-all-btn mt-3">View All →</Link>
                    </div>

                </div>
        </section>

    </div>
  )
}
