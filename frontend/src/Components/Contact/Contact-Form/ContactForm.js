import React, { useState } from 'react';
import "./ContactForm.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Furniture',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 

    const phoneNumber = "918281145211"; 

    const textMessage = `*New Inquiry*%0A%0A` +
                        `*Name:* ${formData.name}%0A` +
                        `*Email:* ${formData.email}%0A` +
                        `*Phone:* ${formData.phone}%0A` +
                        `*Service:* ${formData.service}%0A` +
                        `*Message:* ${formData.message}`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${textMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <section className="question-section py-5">
        <div className="container">
          
          <div className="text-center mb-5">
            <h2 className="question-title">Have Any Question?</h2>
            <p className="question-subtitle">
              We'd love to hear from you. Fill out the form and our team will get back to you shortly.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              
              <div className="question-card">
                <form className="row g-4" onSubmit={handleSubmit}>

                  <div className="col-md-6">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control custom-input" 
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control custom-input" 
                      placeholder="Your Email"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control custom-input" 
                      placeholder="Your Phone"
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <select 
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="form-select custom-input"
                    >
                      <option value="Furniture">Furniture</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Decor">Decor</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control custom-input" 
                      rows="5" 
                      placeholder="Message"
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 text-center">
                    <button type="submit" className="lux-btn">SEND MESSAGE</button>
                  </div>

                </form>
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
