import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./ProjectTestimonial.css"
import img from "../../../assets/images/project/ppl-1.jpg"
import img1 from "../../../assets/images/project/ppl-11.jpg"
import img2 from "../../../assets/images/project/ppl-2.jpg"
import img3 from "../../../assets/images/project/ppl22.jpg"
import img4 from "../../../assets/images/project/ppl44.jpg"
import img5 from "../../../assets/images/project/pp33.jpg"
import img6 from "../../../assets/images/project/ppl55.jpg"

export default function ProjectTestimonial() {
  return (
    <section className="testimonial-section">
      <div className="container m-0 m-md-5">
        <h2 className="testimonial-title">What Our Customers Say</h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          centeredSlides={true}
          spaceBetween={40}
          speed={800}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 3,
            },
          }}
          className="testimonialSwiper"
        >
          <SwiperSlide>
            <TestimonialCard
              img={img}
              text="The sofa quality is exceptional. It completely transformed our living room."
              name="Andriana Joel"
              city="Bangalore"
            />
          </SwiperSlide>

          <SwiperSlide>
            <TestimonialCard
              img={img1}
              text="Premium finishing and very comfortable. Worth every rupee."
              name="Chandeler Bing"
              city="Mumbai"
            />
          </SwiperSlide>

          <SwiperSlide>
            <TestimonialCard
              img={img2}
              text="Stylish furniture with excellent durability. Highly recommended!"
              name="Ross Geller"
              city="Delhi"
            />
          </SwiperSlide>

          <SwiperSlide>
            <TestimonialCard
              img={img3}
              text="Premium finishing and very comfortable. Worth every rupee."
              name="Selena George"
              city="Mumbai"
            />
          </SwiperSlide>

          <SwiperSlide>
            <TestimonialCard
              img={img4}
              text="Premium finishing and very comfortable. Worth every rupee."
              name="Rachel Green"
              city="Mumbai"
            />
          </SwiperSlide>

          <SwiperSlide>
            <TestimonialCard
              img={img5}
              text="Premium finishing and very comfortable. Worth every rupee."
              name="Monica Geller"
              city="Mumbai"
            />
          </SwiperSlide>

          <SwiperSlide>
            <TestimonialCard
              img={img6}
              text="Fast delivery and top-notch quality. Loved the overall experience."
              name="Rahul Verma"
              city="Hyderabad"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

// /* Reusable Card Component */
function TestimonialCard({ img, text, name, city }) {
  return (
    <div className="testimonial-card m-2">
      <img src={img} alt={name} className="avatar" />
      <p>“{text}”</p>
      <div className="stars">★★★★★</div>
      <h6>{name}</h6>
      <span>{city}</span>
    </div>
  );
}

