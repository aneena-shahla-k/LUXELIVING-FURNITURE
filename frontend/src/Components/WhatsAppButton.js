import React from 'react'
import "./WhatsAppButton.css"

export default function WhatsAppButton() {
    const phoneNumber = "+91 8281145211";
    const message = "Hello, I would like to know more about your Luxeliving"

    const WhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  return (
    <a
        href={WhatsappUrl}
        className='whatsapp-float'
        target='_blank'
        rel='noopener noreferrer'
    >
        <i className='bi bi-whatsapp'></i>
    </a>
  );
}
