import React, { useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DecorPage.css";
import { API } from "../../../api";

const DecorPage = () => {
  const [decor, setDecor] =
    useState([]);
  useEffect(() => {
    fetchDecor();
  }, []);
  useEffect(() => {
  window.scrollTo(0, 0);
}, []); 


  const fetchDecor = async () => {
    const { data } = await axios.get(API.decor);

    setDecor(data);
  };


  return (
  <div className="decor-page">

    {/* HEADER */}
    <div className="decor-header">
      <h1>Shop the Décor</h1>

      <p>
        Curated accents styled for
        effortless living
      </p>
    </div>


    {/* GRID */}
    <div className="decor-grid">

      {decor.map((item) => (

        <div
          className="decor-card"
          key={item._id}
        >

          {/* IMAGE */}
          <div className="decor-image-wrapper">

            <img
              src={`${process.env.REACT_APP_API_URL}${item.image}`}
              alt={item.title}
            />

          </div>


          {/* CONTENT */}
          <div className="decor-content">

                <h2>{item.title}</h2>

                <ul>
                  {item.items.map(
                    (i, index) => (
                      <li key={index}>
                        {i}
                      </li>
                    )
                  )}
                </ul>

          <Link to={`/collection/shop-the-decor/${item.slug}`} className="shop-decor-btn">
            Shop This Look
          </Link>

          </div>

        </div>

      ))}

      <div className="collection-button">

      <Link
        to="/collection"
        className="back-collection-btn"
      >
        ← Back to Collections
      </Link>

    </div>

    </div>

  </div>
);
};

export default DecorPage;