import React from "react";
import "./Common.css";
import { API } from "../../../api";

export default function ProductGrid({ products }) {

  const getImageUrl = (img) => {
    if (!img) return "";

    // Cloudinary URL
    if (img.startsWith("http")) {
      return img;
    }

    // Old uploaded images
    return `${process.env.REACT_APP_API_URL}/${img}`;
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please Sign In / Sign Up to add products to your cart!");
      return;
    }

    try {
      const response = await fetch(`${API.cart}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          img: product.img,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${product.name} successfully added to cart! 🛒`);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Is backend server running?");
    }
  };

  return (
    <>
      <div className="container" style={{ marginTop: "100px" }}>
        {/* മൊബൈലിൽ പാഡിംഗ് ക്രമീകരിക്കാൻ px-5 മാറ്റി g-3 ആക്കിയിട്ടുണ്ട് */}
        <div className="row featured g-3 justify-content-center px-2 px-sm-5">
          {products.map((item) => (
            /* ഇവിടെ col-6 ആഡ് ചെയ്തിട്ടുണ്ട്: മൊബൈലിൽ 2 എണ്ണം, ടാബ്‌ലറ്റിൽ 2 എണ്ണം (col-sm-6), ഡെസ്ക്ടോപ്പിൽ 3 എണ്ണം (col-md-4) */
            <div className="col-6 col-sm-6 col-md-4" key={item._id || item.name}>
              <div className="product-card">
                <img
                  src={getImageUrl(item.img)}
                  alt={item.name}
                  className="img-fluid"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />

                <h6>{item.name}</h6>

                <p className="price">₹{item.price}</p>

                <button
                  className="add-cart-btn"
                  onClick={() => addToCart(item)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 d-flex justify-content-center mb-4">
            <a href="/collection" className="btn btn-green">
              Back to Collections →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
