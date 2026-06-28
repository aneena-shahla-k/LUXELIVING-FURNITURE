// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const lookRoutes = require('./routes/lookRoutes'); // Custom routes folder

const app = express();

// 1. Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json()); // Parses incoming JSON payloads

// 2. Base API Routes
app.use('/api/looks', lookRoutes);

// 3. Centralized Error Handler (Premium practice for stability)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 4. Database Connection & Server Initialization
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('📦 MongoDB Connected Smoothly.');
    app.listen(PORT, () => console.log(`🚀 Server running flawlessly on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
  });

module.exports = app;