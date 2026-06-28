import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DynamicShopTheLook = () => {
  const { roomType } = useParams();
  const navigate = useNavigate();
  const [looks, setLooks] = useState([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for tracking selected product IDs
  const [selectedProducts, setSelectedProducts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLookbook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/shop-look/${roomType || 'bedroom'}`);
        const json = await response.json();
        
        if (json.success) {
          setLooks(json.data);
          
          // Pre-select all products inside the setup by default
          const initialSelection = {};
          json.data.forEach(look => {
            look.products?.forEach(prod => {
              initialSelection[prod._id] = true;
            });
          });
          setSelectedProducts(initialSelection);
        } else {
          setError(json.message || "Failed to parse look data");
        }
      } catch (err) {
        setError(err.message || "Something went wrong fetching look data");
      } finally {
        setLoading(false);
      }
    };

    fetchLookbook();
  }, [roomType]);
useEffect(() => {
  window.scrollTo(0, 0);
}, []); 
  const handleCheckboxChange = (productId) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

const handleAddSelectedToCart = async (lookProducts) => {
    // 1. Check if user is logged in
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      alert("Please Sign Up or Log In to add items to your cart! ✨");
      navigate('/signup-modal');
      return;
    }

    // 2. Filter only checked items
    const chosenItems = lookProducts.filter(prod => selectedProducts[prod._id]);
    
    if (chosenItems.length === 0) {
      alert("Please select at least one item to add to the cart.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const item of chosenItems) {
        await fetch('http://localhost:5001/api/cart/add', { // 👈 Fixed URL with /add
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: item.title,      
            price: item.price,    
            img: item.productImage 
          })
        });
      }

      alert(`Success! ${chosenItems.length} curated items added to your cart profile. 🛒✨`);
      navigate('/cart'); // Redirect straight to your client cart page
      
    } catch (err) {
      console.error("Cart Dynamic Push Error:", err);
      alert("Failed to update cart cluster database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error || looks.length === 0) {
    return (
      <div style={{ minHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999', fontSize: '14px', fontFamily: 'sans-serif' }}>
        <p>{error ? `Error: ${error}` : `No curated styles published for "${roomType}" yet.`}</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '40px 20px', fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#333' }}>
      {looks.map((look) => {
        const totalLookProducts = look.products || [];
        const selectedCount = totalLookProducts.filter(p => selectedProducts[p._id]).length;
        
        // Dynamic Total Calculation
        const totalSelectedPrice = totalLookProducts
          .filter(p => selectedProducts[p._id])
          .reduce((sum, p) => sum + (p.price || 0), 0);

        return (
          <div key={look._id} style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Top Concept Big Image (Responsive Banner) */}
            <div style={{ width: '100%', maxHeight: '480px', borderRadius: '16px', overflow: 'hidden', marginBottom: '50px', marginTop: '100px',backgroundColor: '#fcfcfc' }}>
              <img 
                src={`http://localhost:5001${look.mainImg}`} 
                alt={look.title} 
                style={{ width: '100%', height: 'auto', maxHeight: '480px', objectFit: 'cover' }}
              />
            </div>

            {/* Centered Heading Section */}
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 10px 0', trackingTight: '-0.5px' }}>
                Complete the Look
              </h2>
              <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                Select the items you want to purchase
              </p>
            </div>

            {/* Grid Box Layout (Matches your layout perfectly) */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '24px', 
              marginBottom: '40px' 
            }}>
              {totalLookProducts.map((prod, index) => {
                const isChecked = !!selectedProducts[prod._id];
                return (
                  <div 
                    key={prod._id || index}
                    onClick={() => handleCheckboxChange(prod._id)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #eef2f6',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                      position: 'relative',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Top-Left Corner Blue Checkbox */}
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}} // synthetic click handler is on parent div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                        accentColor: '#007aff' // Match blue standard browser checkbox
                      }}
                    />

                    {/* Product Asset Thumbnail */}
                    {prod.productImage && (
                      <div style={{ width: '100%', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px', overflow: 'hidden' }}>
                        <img 
                          src={`http://localhost:5001${prod.productImage}`} 
                          alt={prod.title} 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    {/* Title & Price Fields */}
                    <h4 style={{ fontSize: '14px', fontWeight: '500', color: '#222', margin: '0 0 8px 0' }}>
                      {prod.title}
                    </h4>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#1e4620', margin: '0' }}>
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* ⚡ Find this bottom total bar component near line 207 and replace its style style */}
                <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #eef2f6',
                borderRadius: '14px',
                padding: '20px 30px',
                display: 'flex',
                justifyContent: 'space-between', /* 👈 FIXED: Kept only 'space-between' and removed the duplicate duplicate */
                alignItems: 'center',
                boxShadow: '0 4px 25px rgba(0,0,0,0.01)',
                marginBottom: '50px',
                flexWrap: 'wrap',
                gap: '15px'
                }}>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
                    Total: ₹{totalSelectedPrice.toLocaleString('en-IN')}
                </div>
                {/* Add to cart button template below ... */}

              <button
                onClick={() => handleAddSelectedToCart(totalLookProducts)}
                disabled={isSubmitting || selectedCount === 0}
                style={{
                  backgroundColor: selectedCount === 0 ? '#a0a0a0' : '#147a46', // Clean interior dark green style
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {isSubmitting ? "Adding Items..." : "Add Selected to Cart"}
              </button>
            </div>

            {/* Navigation Footing Controller Button */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => navigate('/collection')}
                style={{
                  backgroundColor: '#394e43',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 35px',
                  borderRadius: '25px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Back to Collections →
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default DynamicShopTheLook;