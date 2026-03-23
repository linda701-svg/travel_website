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

    // Seed initial tour data if collection is empty
    const tourCount = await Tour.countDocuments();
    if (tourCount === 0) {
      const initialTours = [
        {
          title: "Fabulous Dubai",
          description: "Dubai is situated on the Persian Gulf coast of the United Arab Emirates and is roughly at sea level (16 m or 52...). A vibrant city with stunning architecture.",
          price: 1450,
          duration: 7,
          image: "/images/tours/dubai.jpg",
          location: {
            address: "Downtown Dubai",
            city: "Dubai",
            country: "UAE",
            latitude: 25.2048,
            longitude: 55.2708
          },
          availability: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            maxGroupSize: 20
          },
          services: {
            included: ["Accommodation", "Flights", "Desert Safari"],
            excluded: ["Visa fees", "Personal expenses"]
          }
        },
        {
          title: "Luxurious London",
          description: "Experience the historical and modern marvels of London. From ancient castles to vibrant cultural scenes.",
          price: 1900,
          duration: 8,
          image: "/images/tours/london.jpg",
          location: {
            address: "Westminster",
            city: "London",
            country: "UK",
            latitude: 51.5074,
            longitude: -0.1278
          },
          availability: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            maxGroupSize: 15
          },
          services: {
            included: ["Accommodation", "City tours", "Museum passes"],
            excluded: ["International flights", "Food"]
          }
        },
        {
          title: "Modern Sydney",
          description: "Sydney, capital of New South Wales and one of Australia's largest cities, is best known for its harbour front Sydney Opera House, with...",
          price: 950,
          duration: 5,
          image: "/images/tours/sydney.jpg",
          location: {
            address: "Sydney Harbour",
            city: "Sydney",
            country: "Australia",
            latitude: -33.8688,
            longitude: 151.2093
          },
          availability: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            maxGroupSize: 10
          },
          services: {
            included: ["Accommodation", "City tours", "Beach trips"],
            excluded: ["Flights", "Drinks"]
          }
        },
        {
          title: "Rio De Janeiro",
          description: "Rio de Janeiro is a huge seaside city in Brazil, famed for its Copacabana and Ipanema beaches, 38m Christ the Redeemer statue atop...",
          price: 1150,
          duration: 7,
          image: "/images/tours/rio.jpg",
          location: {
            address: "Copacabana",
            city: "Rio de Janeiro",
            country: "Brazil",
            latitude: -22.9068,
            longitude: -43.1729
          },
          availability: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            maxGroupSize: 25
          },
          services: {
            included: ["Accommodation", "Beach activities", "Mountain tours"],
            excluded: ["Flights", "Souvenirs"]
          }
        }
      ];

      await Tour.insertMany(initialTours);
      console.log('Initial tour data seeded successfully');
    }
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
