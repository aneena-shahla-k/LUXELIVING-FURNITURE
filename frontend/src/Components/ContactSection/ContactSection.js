import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./ContactSection.css";
import qr from "../im"


export default function ContactSection() {
    const [formData, setFormData] = useState({
        name:"",
        phone:"",
        email:"",
        subject:"",
        message:"",
    });

// Handle input change
const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({ ...formData, [name]: value});
};

//Submit -> WhatsApp
const handleSubmit = (e) => {
    e.preventDefault();

   const whatsappNumber = "918281145211"; //without +

        const text = `
        Hello Luxe Living,
        Name: $(formData.name)
        Phone: $(formData.phone)
        Email: $(formData.email)
        Subject: $(formData.subject)

        Message: ${formData.message}
        `;

        const WhatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            text
        )}`;

        window.open(WhatsappURL, "_blank");

        //Reset form after submit
        setFormData({
            name: "",
            phone: "",
            email: "",
            subject: "",
            message: "",
        });
    };
  return (
    <section className="container-fluid contact-wrapper">
        <div className="container">
             {/* HEADER */}
             <div className= "text-center mb-5">
                <p className="contact-label"><b>CONTACT US</b></p>
                <h2 className="contact-title head-font">Get In Touch With Us</h2>
             </div>

             <div className="row g-4">
                {/* LEFT INFO */}
                 <div className="col-lg-6">
                    <div className="contact-box h-100">
                        <h4 className="mb-3 head-font text-sucess"><b>Contact Info</b></h4>
                        <p className="contact-text para-font">
                            We're here to guide you on your wellness journey. Get in touch with us today to begin your path to natural healing
                        </p>
                        <div className="contact-item">
                            <FaPhone className="text-success" />
                            <p>+91 8281 145 211</p>
                        </div>
                        <div className="contact-item">
                            <MdOutlineMail className="text-success" />
                            <p>luxeliving@gmail.com</p>
                        </div>
                        <div className="contact-item">
                            <FaLocationDot className="text-success" />
                            <p>+91 8281 145 211</p>
                        </div>
                        <div className="contact-item">
                            <FaPhone className="text-success" />
                            <p>
                                Door No.108, rubhhdk,
                                kerala, 7672837
                            </p>
                        </div>

                        <div className="contact-item">
                            <AiFillInstagram className="text-success"/>
                            <Link
                            to="https://www.instagram.com/ayur.moksha"
                            className = "text-muted text-decoration-none"
                            target = "_blank"
                            >
                                LuxeLiving
                            </Link>
                        </div>

                        <div className='contact-item'>
                            <img
                                src={qr}
                                alt="QR Code"
                                className='img-fluid'
                                width={200}
                            />
                        </div>
                    </div>                    
                 </div>

            {/* RIGHT FORM */}
            <div className="col-lg-6">
                <div className="contact-box h-100">
                    <form onSubmit={handleSubmit}>
                    <div className="row g-3">

                        <div className="col-md-6">
                        <label className="form-label">NAME</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter Name"
                        />
                        </div>

                        <div className="col-md-6">
                        <label className="form-label">PHONE</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter Phone"
                        />
                        </div>

                        <div className="col-md-6">
                        <label className="form-label">EMAIL</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                        />
                        </div>

                        <div className="col-md-6">
                        <label className="form-label">SUBJECT</label>
                        <input
                            type="text"
                            className="form-control"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Write Subject"
                        />
                        </div>

                        <div className="col-12">
                        <label className="form-label">MESSAGE</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Write Message"
                        ></textarea>
                        </div>

                        <div className="col-12 mt-3 text-center">
                        <button type="submit" className="btn contact-btn">
                            Send Message
                        </button>
                        </div>

                    </div>
                    </form>
                </div>
                </div>
             </div>
        </div>
    </section>
  );
}

