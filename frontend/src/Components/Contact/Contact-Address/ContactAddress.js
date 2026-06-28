import React from 'react'
import "./ContactAddress.css"


export default function ContactAddress() { 
  return (
    <div>
        <section className="container ">
            <div className="row g-4 text-center">
                
                <div className="col-md-4">
                    <div className="info-card" data-aos="zoom-out" data-aos-duration="1500">
                        <i className="bi bi-geo-alt"></i>
                        <h5>Address</h5>
                        <p>7 Green Lake Street<br/>IN 47933</p>
                    </div>
                </div>

                <div class="col-md-4">
                    <div className="info-card" data-aos="zoom-out" data-aos-duration="1500">
                        <i className="bi bi-envelope"></i>
                        <h5>Email Us</h5>
                        <p>luxeliving@gmail.com<br/>hello@gmail.com</p>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="info-card" data-aos="zoom-out" data-aos-duration="1500">
                        <i className="bi bi-telephone"></i>
                        <h5>Call Now</h5>
                        <p>+1 800 123 456 789<br/>+1 800 654 987</p>
                    </div>
                </div>

            </div>
        </section>
    </div>
  )
}
