import React from 'react'
import "./ShopTheLook.css"
import img from "../../../assets/images/collection/SLook/ddlivingroom.JPG"
import img1 from "../../../assets/images/collection/SLook/ddbedroom.JPG"
import img2 from "../../../assets/images/collection/SLook/dddining.JPG"
import img3 from "../../../assets/images/collection/SLook/ddofficeroom.JPG"
import img4 from "../../../assets/images/collection/SLook/ddkitchen.JPG"
import img5 from "../../../assets/images/collection/SLook/ddbalcony.jpg"
import { Link } from 'react-router-dom'

export default function ShopTheLook() {
  return (
    <div>
        <section id="collection-section" className="collection-carousel py-5 mb-5 ">
                <div className="container text-center mb-4">
                    <h2 className="section-title mb-3">Explore Collections</h2>
                    <p className="section-subtitle mb-5 text-center">Curated spaces for refined living.</p>
                </div>

                <div className="container">
                    <div id="collectionSlider" className="carousel slide" data-bs-ride="carousel">
  
                        <div className="carousel-inner">

                            <div className="carousel-item active">
                                <div className="row g-4 justify-content-center">

                                    <div className="col-lg-4 col-md-6">
                                    <Link to="/collection/shop-the-look/living" className="look-card">
                                        <img src={img}  alt=""/>
                                        <span>Living Room</span>
                                    </Link>
                                    </div>

                                    <div className="col-lg-4 col-md-6">
                                    <Link to="/collection/shop-the-look/bedroom" className="look-card">
                                        <img src={img1} alt=""/>
                                        <span>Bedroom</span>
                                    </Link>
                                    </div>

                                    <div className="col-lg-4 col-md-6">
                                    <Link to="/collection/shop-the-look/dining" className="look-card">
                                        <img src={img2} alt=""/>
                                        <span>Dining</span>
                                    </Link>
                                    </div>

                                    
                                </div>
                            </div>

                    
                            <div className="carousel-item">
                                <div className="row g-4 justify-content-center">

                                    <div className="col-lg-4 col-md-6">
                                    <Link to="/collection/shop-the-look/office" className="look-card">
                                        <img src={img3} alt=""/>
                                        <span>Office Room</span>
                                    </Link>
                                    </div>

                                    <div className="col-lg-4 col-md-6">
                                    <Link to="/collection/shop-the-look/kitchen" className="look-card">
                                        <img src={img4} alt=""/>
                                        <span>Kitchen</span>
                                    </Link>
                                    </div>

                                    <div className="col-lg-4 col-md-6">
                                    <Link to="/collection/shop-the-look/balcony" className="look-card">
                                        <img src={img5} alt=""/>
                                        <span>Balcony</span>
                                    </Link>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <button className="carousel-control-prev" type="button" data-bs-target="#collectionSlider" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"></span>
                        </button>

                        <button className="carousel-control-next" type="button" data-bs-target="#collectionSlider" data-bs-slide="next">
                            <span className="carousel-control-next-icon"></span>
                        </button>

                
                    </div>
                </div>
        </section>  
    </div>
  )
}
