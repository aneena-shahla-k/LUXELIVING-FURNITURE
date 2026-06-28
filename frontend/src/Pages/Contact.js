import React from 'react'
import ContactAddress from '../Components/Contact/Contact-Address/ContactAddress'
import ContactBanner from '../Components/Contact/Contact-Banner/ContactBanner'
import ContactForm from '../Components/Contact/Contact-Form/ContactForm'
import ContactMap from '../Components/Contact/Contact-Map/ContactMap'
import ScrollTop from '../Components/ScrollTop'
import ScrollToTop from '../Components/ScrollToTop'
import WhatsAppButton from '../Components/WhatsAppButton'

export default function Contact() {
  return (
    <div>
      <ScrollTop/>
        <ContactBanner/>
        <ContactAddress/>
        <ContactForm/>
        <WhatsAppButton/>
        <ContactMap/>
        <ScrollToTop/>
        
    </div>
  )
}
