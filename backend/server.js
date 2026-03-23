const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Import mongoose
require('./models/User');    // Ensure User model is registered
require('./models/Booking');  // Ensure Booking model is registered
const Tour = require('./models/Tour'); // Import Tour model to seed data (also registers it)

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Initial tour data seed removed per user request
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Connect to database
connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('<h1>Travel Website API</h1>');
});

// API Routes
const tourRoutes = require('./routes/tourRoutes'); // Import tour routes
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/v1/tours', tourRoutes); // Use tour routes

app.use('/api/auth', authRoutes);
// app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/users', userRoutes); // Use user routes
app.use('/api/v1/payments', paymentRoutes); // Use payment routes
app.use('/api/v1/reviews', reviewRoutes); // Use review routes


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
