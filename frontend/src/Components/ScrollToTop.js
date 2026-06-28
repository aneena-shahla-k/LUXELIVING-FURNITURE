import React, { useEffect, useState } from 'react'
import './ScrollToTop.css'

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    //Show button after scrolling down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300){
            setVisible(true);
        }else {
            setVisible(false);
        }
    };

    //Scroll to top smoothly
    const ScrollToTop = () => {
        window.scrollTo({
            top:0,
            behavior:'smooth',
        });
    };

    useEffect (() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

  return (
    <div
        className= {`scroll-to-top ${visible ? "show" : ""}`}
        onClick={ScrollToTop}
    >
        ↑
    </div>
  );
}
