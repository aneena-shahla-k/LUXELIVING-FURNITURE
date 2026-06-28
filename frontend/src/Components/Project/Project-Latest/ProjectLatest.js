import React from 'react'
import "./ProjectLatest.css"
import img from "../../../assets/images/project/about-1.jpg"
import img1 from "../../../assets/images/project/about-2.JPG"
import img2 from "../../../assets/images/project/about-4.jpg"
import img3 from "../../../assets/images/project/about-5.jpg"
import img4 from "../../../assets/images/project/project1.png"
import img5 from "../../../assets/images/project/project2.jpg"
import img6 from "../../../assets/images/project/carousel1.png"
import img7 from "../../../assets/images/project/project6.jpg"
import img8 from "../../../assets/images/project/furni1.jpeg"
import img9 from "../../../assets/images/project/project3.jpg"
import img10 from "../../../assets/images/project/project12.jpg"
import img11 from "../../../assets/images/project/img-card2.JPG"

export default function ProjectLatest() {
  return (
    <div>
        <section className="projects-section my-5 py-5">
                    <div className="container">

                        <h2 className="my-5 fw-bold text-center">Latest Projects</h2>

                        <div className="row align-items-center my-5">
            
                            <div className="col-lg-4"data-aos="fade-in">
                                <h4 className="fw-bold">Scandinavian Minimalism</h4>
                                <p className="text-muted">
                                A clean, functional interior inspired by Scandinavian simplicity and natural tones.
                                </p>
                            </div>

                            
                            <div className="col-lg-8">
                                <div className="project-images">
                                <img src={img} alt='pro' />
                                <img src={img1}  alt='pro'/>
                                <img src={img2} alt='pro'/>
                                </div>
                            </div>
                        </div>

                        
                        <div className="row align-items-center mb-5 flex-lg-row-reverse">
                            <div className="col-lg-4" data-aos="fade-in">
                                <h4 className="fw-bold">Sochi Apartment</h4>
                                <p className="text-muted">
                                Modern apartment design blending comfort with contemporary aesthetics.
                                </p>
                            </div>

                            <div className="col-lg-8">
                                <div className="project-images">
                                <img src={img3}  alt='pro'/>
                                <img src={img4}  alt='pro'/>
                                <img src={img5} alt='pro'/>
                                </div>
                            </div>
                        </div>

                        <div className="row align-items-center mb-5">
                            <div className="col-lg-4" data-aos="fade-in">
                                <h4 className="fw-bold">Hyatt Regency Sochi</h4>
                                <p className="text-muted">
                                Luxury hospitality interior with refined materials and lighting design.
                                </p>
                            </div>

                            <div className="col-lg-8">
                                <div className="project-images">
                                <img src={img6} alt='pro'/>
                                <img src={img7} alt='pro'/>
                                <img src={img8} alt='pro'/>
                                </div>
                            </div>
                        </div>

                
                        <div className="row align-items-center mb-5 flex-lg-row-reverse">
                            <div className="col-lg-4" data-aos="fade-in">
                                <h4 className="fw-bold">British Style Loft</h4>
                                <p className="text-muted">
                                Classic British character combined with modern loft-style interiors.
                                </p>
                            </div>

                            <div className="col-lg-8">
                                <div className="project-images">
                                <img src={img9} alt='pro' />
                                <img src={img10} alt='pro'/>
                                <img src={img11} alt='pro'/>
                                </div>
                            </div>
                        </div>

                    </div>
        </section>
    </div>
  )
}
