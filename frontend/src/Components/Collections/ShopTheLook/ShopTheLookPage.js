import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LucideCheck, LucideShoppingBag, LucideArrowLeft } from "lucide-react"; 
import "./CommonAll.css";

export default function ShopTheLookPage() {
  const { roomType } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [roomType]);

  useEffect(() => {
    const fetchRoomLook = async () => {
      setLoading(true);
      try {
        // 🛠️ FIXED: Port changed from 5001 to 5000
        const response = await fetch(`http://localhost:5000/api/shop-look/${roomType}`);
        const data = await response.json();
        
        if (response.ok) {
          setRoomData(data);
          const initialCheckboxes = {};
          data.products.forEach(item => {
            const idStr = String(item.id || item._id);
            initialCheckboxes[idStr] = true;
          });
          setSelectedItems(initialCheckboxes);
        } else {
          console.error("Failed to fetch room look data");
          setRoomData(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room look:", error);
        setLoading(false);
      }
    };

    if (roomType) {
      fetchRoomLook();
    }
  }, [roomType]);

  const handleCheckboxChange = (e, itemId) => {
    e.stopPropagation();
    const idStr = String(itemId);
    setSelectedItems((prev) => ({
      ...prev,
      [idStr]: !prev[idStr],
    }));
  };

  const calculateTotal = () => {
    if (!roomData || !roomData.products) return 0;
    return roomData.products.reduce((sum, item) => {
      const idStr = String(item.id || item._id);
      return selectedItems[idStr] ? sum + item.price : sum;
    }, 0);
  };

  const addSelectedToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please Sign In / Sign Up to add products to your cart!");
      return;
    }

    const itemsToAdd = roomData.products.filter(item => selectedItems[String(item.id || item._id)]);

    if (itemsToAdd.length === 0) {
      alert("Please select at least one product to add to cart!");
      return;
    }

    try {
      const promises = itemsToAdd.map(item => 
        // 🛠️ FIXED: Port changed from 5001 to 5000
        fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: item.title,
            price: item.price,
            img: item.img
          })
        })
      );

      await Promise.all(promises);
      alert("Selected products successfully added to cart! 🛒");
      window.dispatchEvent(new Event('cartUpdated'));

    } catch (error) {
      console.error("Error adding items to cart:", error);
      alert("Something went wrong while adding to cart.");
    }
  };

  if (loading) {
    return (
      <div className="container text-center d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '80vh', marginTop: '100px' }}>
        <div className="spinner-border text-success mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted tracking-wide font-serif">Curating your luxury interior design layout...</p>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="container text-center py-5 card border-0 shadow-sm" style={{ marginTop: '140px', minHeight: '50vh' }}>
        <h3 className="font-serif mb-2" style={{ color: '#2d4a3e' }}>Design Profile Unavailable</h3>
        <p className="text-muted mb-4">Our team hasn't published a concept setup for "{roomType}" yet.</p>
        <Link to="/collection" className="btn text-white align-self-center px-4" style={{ backgroundColor: '#3b5d50' }}>
          Return to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="shop-look-premium-container" style={{ marginTop: '90px', backgroundColor: '#fcfbf7', minHeight: '100vh' }}>
      
      {/* 1. HERO BILLBOARD SECTION */}
      <div className="position-relative overflow-hidden w-100" style={{ height: '55vh' }}>
        {/* 🛠️ FIXED: Port changed to 5000 */}
        <img 
          src={`http://localhost:5000/${roomData.mainImg}`} 
          className="w-100 h-100" 
          alt={roomType} 
          style={{ objectFit: 'cover', filter: 'brightness(0.85)' }}
        />
        <div className="position-absolute start-0 bottom-0 w-100 p-4 p-md-5 d-flex flex-column justify-content-end" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', height: '60%' }}>
          <span className="text-white-50 text-uppercase tracking-wider small mb-2">Interactive Editorial Look</span>
          <h1 className="text-white font-serif display-5 fw-normal m-0">{roomData.title}</h1>
        </div>
      </div>

      <div className="container py-5">
        {/* 2. META HEADER SECTION */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center border-bottom pb-4 mb-5">
          <div>
            <h2 className="font-serif h3 mb-2" style={{ color: '#2d4a3e' }}>Complete the Interior Set</h2>
            <p className="text-muted small m-0">Uncheck individual items to omit them from your collective space architecture.</p>
          </div>
          <button 
            className="btn text-white d-flex align-items-center gap-2 mt-3 mt-md-0 px-4 py-2.5 shadow-sm border-0 transition-all hover-opacity"
            style={{ backgroundColor: '#3b5d50', borderRadius: '4px', letterSpacing: '0.5px', fontWeight: '500' }}
            onClick={addSelectedToCart}
          >
            <LucideShoppingBag size={18} /> Add Selected Elements (₹{calculateTotal().toLocaleString('en-IN')})
          </button>
        </div>

        {/* 3. MODERN PRODUCT GRID */}
        <div className="row g-4">
          {roomData.products.map((item) => {
            const idStr = String(item._id || item.id);
            const isChecked = !!selectedItems[idStr];
            
            return (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={idStr}>                
                <div 
                  className={`card h-100 border-0 shadow-sm position-relative transition-all overflow-hidden`}
                  style={{ 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    border: isChecked ? '1px solid #3b5d50' : '1px solid transparent',
                    opacity: isChecked ? 1 : 0.75
                  }}
                  onClick={() => navigate(`/product/${idStr}`)}
                >
                  
                  {/* SELECTABLE INDICATOR BUTTON */}
                  <div 
                    className="position-absolute top-0 start-0 m-3 d-flex align-items-center justify-content-center transition-all"
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '4px', 
                      border: '1.5px solid #3b5d50',
                      backgroundColor: isChecked ? '#3b5d50' : 'transparent',
                      zIndex: 10
                    }}
                    onClick={(e) => handleCheckboxChange(e, idStr)}
                  >
                    {isChecked && <LucideCheck size={16} color="#ffffff" strokeWidth={3} />}
                  </div>

                  {/* PREMIUM IMAGE CONTAINER */}
                  <div className="bg-light overflow-hidden d-flex align-items-center justify-content-center p-4 position-relative" style={{ height: '280px' }}>
                    {/* 🛠️ FIXED: Port changed to 5000 and matches 'item.img' schema key */}
                    <img 
                      src={`http://localhost:5000/${item.img}`} 
                      alt={item.title} 
                      className="w-100 h-100 transition-transform img-hover-zoom"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>

                  {/* PREMIUM DETAILS CAPTION */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="h6 text-dark font-sans fw-normal mb-1 text-truncate" style={{ letterSpacing: '0.3px' }}>
                        {/* 🛠️ FIXED: Matches 'item.title' schema key */}
                        {item.title}
                      </h3>
                      <p className="text-muted fw-bold m-0" style={{ fontSize: '0.95rem', color: '#2d4a3e' }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                      <span className="text-muted small" onClick={(e) => { e.stopPropagation(); navigate(`/product/${idStr}`); }} style={{ textDecoration: 'underline' }}>
                        View Details →
                      </span>
                      <span className="small font-serif fw-bold" style={{ color: isChecked ? '#3b5d50' : '#bbbbbb' }}>
                        {isChecked ? "Selected" : "Omitted"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* 4. FOOTER BACK NAVIGATION */}
        <div className="mt-5 pt-4 text-start">
          <Link to="/collection" className="text-decoration-none d-inline-flex align-items-center gap-2 small font-serif" style={{ color: '#3b5d50', fontWeight: '500' }}>
            <LucideArrowLeft size={16} /> Explore Other Curated Spaces
          </Link>
        </div>

      </div>
    </div>
  );
}