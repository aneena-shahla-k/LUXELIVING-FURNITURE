import React from 'react'
import "./ContactMap.css"

export default function ContactMap() {
  return (
    <div>
        <section className="map">
            <iframe src="https://www.google.com/maps?q=New%20York&output=embed" title='map'></iframe>
        </section>
    </div>
  )
}
