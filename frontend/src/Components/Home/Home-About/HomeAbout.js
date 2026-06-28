import React from "react";
import "./HomeAbout.css";

import logo4 from "../../../assets/images/home/logo1.jpg";
import logo1 from "../../../assets/images/home/logo2.jpg";
import logo2 from "../../../assets/images/home/logo3.jpg";
import logo3 from "../../../assets/images/home/logo4.jpg";


export default function TrustedBy() {
  const logos = [logo4, logo1, logo2, logo3];

  return (
    <section className="trustedby-section">
      <div className="trustedby-container">
        <p className="trustedby-subtitle">TRUSTED BY DESIGNERS & HOMES</p>

        <div className="trustedby-logos">
          {logos.map((logo, index) => (
            <div key={index} className="trustedby-logo">
              <img src={logo} alt="Trusted brand logo" />
            </div>
          ))}
        </div>

        <div className="trustedby-rating">
          <div className="stars">★★★★★</div>
          <p>
            Rated <strong>4.9</strong> by <strong>5,000+</strong> customers
          </p>
        </div>
      </div>
    </section>
  );
}
