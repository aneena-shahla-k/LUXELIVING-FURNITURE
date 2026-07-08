import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API } from "../../api";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [couponError, setCouponError] = useState('');

  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API.cart, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        setCartItems([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        const rawItems = data.items || [];
        console.log("Cart Items from Backend:", rawItems); 

        const formattedItems = rawItems.map(item => {
          const productData = item.productId || item.product || item; 
          
          let imgUrl = productData.img || productData.image || "https://via.placeholder.com/150";
          
          if (imgUrl && !imgUrl.startsWith('http')) {
            if (imgUrl.startsWith('/')) {
              imgUrl = `${process.env.REACT_APP_API_URL}${imgUrl}`;
            } else {
              imgUrl = `${process.env.REACT_APP_API_URL}/${imgUrl}`;
            }
          }

          return {
            ...item,
            _id: item._id || item.id, 
            name: productData.name || "Unknown Item",
            price: productData.price || 0,
            quantity: item.quantity || 1,
            image: imgUrl
          };
        });
        setCartItems(formattedItems);
      } else {
        console.error("Failed to fetch cart:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API.cart}/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });

      if (response.ok) {
        fetchCart(); 
        window.dispatchEvent(new Event('cartUpdated')); 
      } else {
        console.error("Failed to update quantity on server");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (item) => {
    const itemId = item._id || item.id || item.productId || item.productId?._id;
    
    if (!itemId) {
      console.error("Error: Item ID missing in frontend");
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API.cart}/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCart(); 
        window.dispatchEvent(new Event('cartUpdated')); 
        alert("Item removed from cart! 🛒");
      } else {
        console.error("Failed to remove item from server. Status:", response.status);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // --- Coupon Logic ---
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');

    const formattedCode = couponCode.trim().toUpperCase();

    if (formattedCode === 'SAVE10') {
      setAppliedCoupon({
        code: 'SAVE10',
        type: 'percentage',
        value: 10 // 10% Discount
      });
    } else if (formattedCode === 'FLAT500') {
      if (subtotal < 1000) {
        setCouponError('Minimum purchase of ₹1,000 required for this coupon.');
        return;
      }
      setAppliedCoupon({
        code: 'FLAT500',
        type: 'flat',
        value: 500 // ₹500 Flat Discount
      });
    } else {
      setCouponError('Invalid Coupon Code ❌');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // --- Calculations ---
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);
  
  // Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round(subtotal * (appliedCoupon.value / 100));
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.value;
    }
  }

  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  // Final Total Formula: Subtotal - Discount + Shipping
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleCheckout = () => {
    const checkoutData = {
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
      cartItems: cartItems.map(item => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: "Calicut, Kerala" 
    };

    navigate('/checkout', { state: { ...checkoutData } });
  };

  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '120px', minHeight: '60vh' }}>
        <h4 className="mb-4">Please login to view your shopping bag</h4>
        <button className="btn text-white px-4 py-2" style={{ backgroundColor: '#3b5d50' }} onClick={() => navigate('/')}>
          Go to Home / Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '120px' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ marginTop: '100px', minHeight: '70vh' }}>
      <h2 className="mb-5 font-serif text-start" style={{ color: '#2d4a3e' }}>Your Shopping Bag</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm">
          <p className="text-muted mb-4">Your cart is empty!</p>
          <Link to="/collection" className="btn text-white align-self-center px-4" style={{ backgroundColor: '#3b5d50' }}>
            Go to Collection
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* LEFT: Items List */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4">
              {cartItems.map((item, index) => (
                <div key={item._id || index}>
                  <div className="row align-items-center py-3 g-3">
                    
                    {/* Combined Image and Text Area */}
                    <div className="col-7 col-md-5">
                      <div className="d-flex align-items-center gap-3">
                        
                        {/* Fixed-size Image Wrapper */}
                        <div 
                          className="rounded bg-light d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '75px', height: '75px', overflow: 'hidden' }}
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-100 h-100" 
                            style={{ objectFit: 'cover', padding: '4px' }} 
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                          />
                        </div>

                        {/* Text Details */}
                        <div className="min-w-0">
                          <h6 className="mb-1 text-truncate" style={{ fontSize: '0.95rem', fontWeight: '600' }}>{item.name}</h6>
                          <p className="text-muted small mb-0">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        </div>

                      </div>
                    </div>
                    
                    {/* Quantity Selector */}
                    <div className="col-5 col-md-3 d-flex justify-content-end justify-content-md-start">
                      <div className="input-group input-group-sm border rounded align-items-center" style={{ maxWidth: '100px', height: '35px', overflow: 'hidden' }}>
                        <button 
                          className="btn border-0 h-100 px-2 fw-bold text-secondary bg-transparent" 
                          type="button"
                          style={{ width: '20px', zIndex: 1 }}
                          onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          className="form-control text-center border-0 bg-white fw-bold h-100 p-0 m-0 text-dark" 
                          value={item.quantity} 
                          readOnly 
                          style={{ 
                            fontSize: '0.95rem', 
                            boxShadow: 'none',
                            pointerEvents: 'none',
                            minWidth: '35px'
                          }}
                        />
                        <button 
                          className="btn border-0 h-100 px-2 fw-bold text-secondary bg-transparent" 
                          type="button"
                          style={{ width: '30px', zIndex: 1 }}
                          onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price & Delete */}
                    <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0 d-flex justify-content-between align-items-center d-md-block">
                      <span className="fw-bold d-block">
                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button 
                        className="btn btn-link text-danger btn-sm p-0 d-block ms-auto mt-1 text-decoration-none" 
                        onClick={() => handleRemoveItem(item)}
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                  {index < cartItems.length - 1 && <hr className="opacity-25" />}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Order Summary & Coupon */}
          <div className="col-lg-4">
            
            {/* Promo Code Input Box */}
            <div className="card border-0 shadow-sm p-4 mb-3">
              <h6 className="mb-3" style={{ fontWeight: '600' }}>Have a Coupon?</h6>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Enter Coupon (e.g., SAVE10)" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-dark btn-sm px-3"
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="d-flex align-items-center justify-content-between bg-light p-2 rounded border border-success">
                  <div>
                    <small className="text-success fw-bold d-block">Coupon Applied!</small>
                    <span className="fw-bold text-dark">{appliedCoupon.code}</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger py-1 px-2"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <div className="text-danger small mt-2">{couponError}</div>}
              <div className="mt-2 text-muted" style={{ fontSize: '0.78rem' }}>
                💡 Try <b>SAVE10</b> (10% Off) or <b>FLAT500</b> (₹500 Off on orders above ₹1000)
              </div>
            </div>

            {/* Price Calculations Summary */}
            <div className="card border-0 shadow-sm p-4">
              <h5 className="mb-4" style={{ fontWeight: '600' }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {/* Discount Row (Only shows if a coupon is active) */}
              {discountAmount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>
                <span>{shipping === 0 ? <strong className="text-success">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total Amount</span>
                <span className="fw-bold text-success fs-5">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="btn text-white w-100 py-2.5 fw-semibold" 
                style={{ backgroundColor: '#3b5d50', borderRadius: '6px' }}
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
