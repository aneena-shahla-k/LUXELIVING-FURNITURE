import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SignUpModal.css';

export default function SignUpModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCloseAction = () => {
    if (typeof onClose === 'function') {
      onClose();
    } else {
      navigate(-1); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const url = isLogin 
    ? 'http://localhost:5001/api/auth/login' 
    : 'http://localhost:5001/api/auth/register';

    const bodyData = isLogin 
      ? { email: formData.email, password: formData.password } 
      : formData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: isLogin ? 'Login Successful!' : 'Registration Successful!', type: 'success' });
        
        if (isLogin && data.token) {
          localStorage.setItem('token', data.token);
          
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }

        setTimeout(() => {
          // Trigger our unified close block
          handleCloseAction();

          if (isLogin && data.user) {
            if (data.user.role === 'admin') {
              navigate('/admin');
            } else {
              // 💡 Note: If they logged in from 'Shop the look', handleCloseAction already took them back.
              // Otherwise safely drop them to home page.
              if (typeof onClose === 'function') navigate('/');
            }
          }
        }, 1500); 
      } else {
        setMessage({ text: data.message || 'Something went wrong', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Cannot connect to server. Try again.', type: 'error' });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      handleCloseAction();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" style={{ position: 'relative' }}>
        
        {/* ⚡ UPDATED: Inline High Priority CSS Styles injected directly to bypass any layout bounds */}
        <button 
          className="modal-close-btn" 
          onClick={handleCloseAction}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            zIndex: 99999,        /* Force token above form backgrounds */
            pointerEvents: 'auto', /* Release pointer blocks */
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontSize: '28px',
            color: '#666',
            padding: '5px',
            display: 'block'
          }}
        >
          &times;
        </button>

        <div className="modal-header-section">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Please enter your details to sign in.' : 'Join LuxeLiving to explore premium designs.'}</p>
        </div>

        {message.text && (
          <div className={`alert-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe" 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-footer-text">
          {isLogin ? (
            <p>Don't have an account? <span style={{ cursor: 'pointer', color: '#394e43', fontWeight: '500' }} onClick={() => setIsLogin(false)}>Sign Up</span></p>
          ) : (
            <p>Already have an account? <span style={{ cursor: 'pointer', color: '#394e43', fontWeight: '500' }} onClick={() => setIsLogin(true)}>Sign In</span></p>
          )}
        </div>

      </div>
    </div>
  );
}