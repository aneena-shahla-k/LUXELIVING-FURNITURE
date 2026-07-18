const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

require('dotenv').config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());


// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// Routes
app.use('/api/auth', require('./routes/auth'));

const cartRoutes = require("./routes/cart");
app.use( "/api/cart",cartRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const shopLook = require('./routes/shopLook');
app.use('/api/shop-look', shopLook);

const decorRoutes = require("./routes/decorRoutes");
app.use("/api/decor", decorRoutes);

const decorDetailRoutes = require("./routes/decorDetailRoutes");
app.use("/api/decor-details", decorDetailRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("LuxeLiving Backend API is running 🚀");
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() =>
    console.log(
      'MongoDB connected successfully...'
    )
  )
  .catch((err) =>
    console.log(
      'Database connection error:',
      err
    )
  );


const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>console.log( `Server running on port ${PORT}`)
);

