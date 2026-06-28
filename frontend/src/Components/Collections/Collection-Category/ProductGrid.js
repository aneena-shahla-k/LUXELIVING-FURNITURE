import React from 'react';
import "./Common.css";

export default function ProductGrid({ products, title }) {

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please Sign In / Sign Up to add products to your cart!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          img: product.img 
        })
      });

      const data = await response.json();

     if (response.ok) {
        alert(`${product.name} successfully added to cart! 🛒`);
        window.dispatchEvent(new Event('cartUpdated'));
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
    <div className="container" style={{ marginTop: '100px' }}> 
      
      <div className="row featured g-4 justify-content-center px-5">
        {products.map((item) => (
          <div className="col-md-4 col-sm-6" key={item._id || item.name}>
            <div className="product-card">
              <img 
                src={`http://localhost:5001/${item.img}`} 
                alt={item.name} 
                className="img-fluid" 
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