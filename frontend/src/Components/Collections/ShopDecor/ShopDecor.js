import React from 'react'
import "./ShopDecor.css"
import img from "../../../assets/images/collection/decor/decor.png"
import { Link } from 'react-router-dom'


const ShopDecor = () => {
  return (
    <section id='decor-section' className="decor-hero-section">
      <div className="decor-hero">
        <div className="hero-image-side">
          <img 
        src={img }
            alt="Minimalist home decor with vase and candle" 
            className="hero-main-img"
          />
        </div>
        
        <div className="decor-overlay">
          <h2>Elevate Your Decor</h2>
          <p>
            Thoughtful accents to add style and personality to every corner of your home.
          </p>
<Link to="/collections/shop-the-decor">
  <button className='decor-btn'>
    Shop the Décor
  </button>
</Link>        </div>
      </div>
    </section>
  );
};

export default ShopDecor;