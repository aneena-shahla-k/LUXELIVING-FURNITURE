import React, { useState, useEffect, useCallback } from 'react'; // 💡 useCallback കൂടി ഇമ്പോർട്ട് ചെയ്തു
import "./Navbar.css";
import { NavLink, useNavigate } from 'react-router-dom';
import image from "../../assets/images/logo/logo-LL.png";
import SignUpModal from '../SignUpModal/SignUpModal';
import { jwtDecode } from 'jwt-decode';
import { API } from "../../api";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const toggleMenu = () => setIsExpanded(!isExpanded);
  const closeMenu = () => setIsExpanded(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false);
    setUserName('');
    closeMenu();
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/'); 
  }, [navigate]); 

  const updateCartCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setCartCount(0);
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
        handleLogout();
        return;
      }

      const data = await response.json();

      if (response.ok) {
        const items = data.items || [];
        setCartCount(items.length);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error reading cart from backend API", error);
      setCartCount(0);
    }
  }, [handleLogout]); 

  useEffect(() => {
    const checkUserStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserName(decoded.name || decoded.email.split('@')[0]); 
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Invalid token");
          handleLogout(); 
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    checkUserStatus();
    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [showModal, handleLogout, updateCartCount]); 

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{backgroundColor: '#3b5d50'}}>
        <div className="container-fluid d-flex align-items-center justify-content-between">
          
          <div className="nav-logo-section">
            <img src={image} style={{width: '100px'}} alt="logo" />
          </div>

          <NavLink className="navbar-brand logo" to="/" onClick={closeMenu} style={{ flex: '1' }}>
            <b>Luxe</b>Living
          </NavLink>

          <div className="nav-toggle-section d-flex justify-content-end" style={{ flex: '1' }}>
            <button className="navbar-toggler" type="button" onClick={toggleMenu} aria-expanded={isExpanded}>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-center align-items-center">
              <li className="nav-item"><NavLink className="nav-link" to="/" onClick={closeMenu}>HOME</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/about" onClick={closeMenu}>ABOUT</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/collection" onClick={closeMenu}>COLLECTION</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/project" onClick={closeMenu}>PROJECTS</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/contact" onClick={closeMenu}>CONTACT</NavLink></li>
              
              <li className="nav-item">
                <NavLink className="nav-link d-flex align-items-center justify-content-center gap-1 positional-cart" to="/cart" onClick={closeMenu}>
                  <div className="cart-icon-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5" 
                      stroke="currentColor" 
                      style={{ width: '22px', height: '22px', verticalAlign: 'middle' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    
                    {cartCount > 0 && (
                      <span className="cart-badge">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              </li>

              {isLoggedIn ? (
                <li className="nav-item user-profile-wrapper">
                  <div className="user-logout-container">
                    <span className="welcome-text">Hi, {userName}</span>
                    <button className="signup-btn logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </li>
              ) : (
                <li className="nav-item signup-btn-wrapper">
                  <button className="signup-btn" onClick={() => { closeMenu(); setShowModal(true); }}>
                    Sign Up
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {showModal && <SignUpModal onClose={() => setShowModal(false)} />}
    </>
  );
}