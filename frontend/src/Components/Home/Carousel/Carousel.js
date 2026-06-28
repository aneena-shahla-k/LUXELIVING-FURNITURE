import React, { useEffect } from "react";
import { Carousel as BsCarousel } from "bootstrap";
import "./Carousel.css";
import image1 from "../../../assets/images/home/carousel1.png";
import image2 from "../../../assets/images/home/carousel2.png";
import image3 from "../../../assets/images/home/carousel3.png";

export default function Carousel() {

  useEffect(() => {
    const el = document.querySelector("#heroCarousel");
    if (el) {
      new BsCarousel(el, {
        interval: 3000,
        ride: "carousel",
        pause: false,
        wrap: true
      });
    }
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-5" data-aos="fade-right">
            <h1 className="pt-5 mt-5">
              Designing Spaces <br /> You'll Love
            </h1>
            <p>
              Discover a curated collection of minimalist furniture crafted
              for comfort and longevity.
            </p>
          </div>

          <div className="col-lg-7" data-aos="fade-left">
            <div
              id="heroCarousel"
              className="carousel slide"
            >
              <div className="carousel-inner rounded-3">
                <div className="carousel-item active">
                  <img src={image1} className="d-block w-100 hero-img" alt="" data-aos="zoom-in" />
                </div>
                <div className="carousel-item">
                  <img src={image2} className="d-block w-100 hero-img" alt="" />
                </div>
                <div className="carousel-item">
                  <img src={image3} className="d-block w-100 hero-img" alt="" />
                </div>
              </div>

              <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" />
              </button>

              <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

