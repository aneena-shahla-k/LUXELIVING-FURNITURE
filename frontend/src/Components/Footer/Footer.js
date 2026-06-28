import React from 'react'
import "./Footer.css"
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
        <footer className="lux-footer-2">
            <div className="container">

                <div className="row gy-5">

                    <div className="col-lg-4 col-md-6">
                        <h4 className="lux-logo"> <b>Luxe</b>Living</h4>
                        <p className="lux-desc">
                        Creating refined spaces that blend elegance,
                        comfort <br /> and functionality for modern living.
                        </p>
                    </div>

                    <div className="col-lg-2 col-md-6">
                        <h6 className="lux-title">Explore</h6>
                            <ul className="lux-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/collection">Collection</Link></li>
                                <li><Link to="/project">Projects</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>       
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h6 className="lux-title">What We Do</h6>
                        <ul className="lux-links">
                        <li>Interior Styling</li>
                        <li>Furniture Design</li>
                        <li>Space Planning</li>
                        <li>3D Visualisation</li>
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h6 className="lux-title">Newsletter</h6>
                        <p className="lux-desc small">
                        Get design inspiration and updates.
                        </p>

                        <form className="lux-newsletter">
                        <input type="email" placeholder="Email address" />
                        <button type="submit">Subscribe</button>
                        </form>
                    </div>

                </div>

                <div className="lux-bottom">
                    <p>© 2025 LuxeLiving. Crafted with care.</p>

                    <div className="lux-social">
                        <a href="https://instagram.com" target='_blank' rel='noreferrer'>Instagram</a>
                        <a href="https://pinterest.com" target='_blank' rel='noreferrer'>Pinterest</a>
                        <a href="https://linkedin.com" target='_blank' rel='noreferrer'>LinkedIn</a>
                    </div>
                </div>

            </div>
        </footer>
    </div>
  )
}
