import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DecorPage.css";
import { API } from "../../../api";

const DecorPage = () => {
  const [decor, setDecor] = useState([]);

  useEffect(() => {
    fetchDecor();
    window.scrollTo(0, 0);
  }, []);

  // Handles both Cloudinary and local uploads
  const getImageUrl = (img) => {
    if (!img) return "";

    // Cloudinary image
    if (img.startsWith("http")) {
      return img;
    }

    // Local upload image
    return `${process.env.REACT_APP_API_URL}/${img.replace(/^\/+/, "")}`;
  };

  const fetchDecor = async () => {
    try {
      const { data } = await axios.get(API.decor);

      // Supports both:
      // { success:true, data:[...] }
      // [...]
      setDecor(data.data || data);
    } catch (err) {
      console.error("Error fetching decor:", err);
    }
  };

  return (
    <div className="decor-page">

      {/* Header */}
      <div className="decor-header">
        <h1>Shop the Décor</h1>
        <p>Curated accents styled for effortless living</p>
      </div>

      {/* Cards */}
      <div className="decor-grid">

        {decor.map((item) => (
          <div className="decor-card" key={item._id}>

            <div className="decor-image-wrapper">
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
              />
            </div>

            <div className="decor-content">

              <h2>{item.title}</h2>

              <ul>
                {item.items?.map((i, index) => (
                  <li key={index}>{i}</li>
                ))}
              </ul>

              <Link
                to={`/collection/shop-the-decor/${item.slug}`}
                className="shop-decor-btn"
              >
                Shop This Look
              </Link>

            </div>

          </div>
        ))}

      </div>

      {/* Back Button */}
      <div className="collection-button">
        <Link
          to="/collection"
          className="back-collection-btn"
        >
          ← Back to Collections
        </Link>
      </div>

    </div>
  );
};

export default DecorPage;