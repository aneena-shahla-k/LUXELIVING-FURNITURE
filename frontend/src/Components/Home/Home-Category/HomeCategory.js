import React from 'react'
import { Link } from 'react-router-dom'
import "./HomeCategory.css"
import img1 from "../../../assets/images/home/cat-chair.jpg"
import img2 from "../../../assets/images/home/cat-sofa.jpg"
import img3 from "../../../assets/images/home/cat-table.jpg"
import img4 from "../../../assets/images/home/cat-bed.jpg"


export default function HomeCategory() {
  return (
    <div>
         <section className="category-section py-5">
            <div className="container text-center">

                <div className="section-title mb-5 mt-5">
                    <small>SHOP BY CATEGORIES</small>
                </div>

                <div className="row justify-content-center">

                    <div className="category-box col-lg-3 col-md-6">
                        <div className="image-border" data-aos="zoom-in" data-aos-duration="1300">
                            <Link to="/collection/chair">
                            <img src={img1} alt="cat 1" />
                            </Link>
                        </div>
                        <div className="category-name">Chair</div>
                    </div>

                    <div className="category-box col-lg-3 col-md-6">
                        <div className="image-border" data-aos="zoom-in" data-aos-duration="1300">
                             <Link to="/collection/sofa">
                            <img src={img2} alt="cat 2" />
                            </Link>
                        </div>
                        <div className="category-name">Sofa</div>
                    </div>

                    <div className="category-box col-lg-3 col-md-6">
                        <div className="image-border" data-aos="zoom-in" data-aos-duration="1300">
                             <Link to="/collection/table">
                            <img src={img3} alt="cat 3" />
                            </Link>
                        </div>
                        <div className="category-name">Table</div>
                    </div>

                    <div className="category-box col-lg-3 col-md-6">
                        <div className="image-border" data-aos="zoom-in" data-aos-duration="1300">
                             <Link to="/collection/bed">
                            <img src={img4} alt="cat 4" />
                            </Link>
                        </div>
                        <div className="category-name">Bed</div>
                    </div>
                </div>

                <div>
                    <Link to="/collection" className="btn btn-view mt-3">View More</Link>
                </div>
            </div>
        </section>
    </div>
  )
}
