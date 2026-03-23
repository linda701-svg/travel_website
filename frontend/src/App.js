import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import News from './pages/News';
import Contact from './pages/Contact';
import Account from './pages/Account';
import FAQs from './pages/FAQs';
import Cart from './pages/Cart';
import Gallery from './pages/Gallery';
import TourDetail from './pages/TourDetail';
import Shop from './pages/shop';
import Checkout from './pages/Checkout';

import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';

// Import Admin components
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminTrips from './admin/AdminTrips';
import NewTripForm from './admin/NewTripForm';
import AdminBooking from './admin/AdminBooking'; // Import AdminBooking
import AdminUser from './admin/AdminUser';     // Import AdminUser

import EditBooking from './admin/EditBooking'; // Import EditBooking
import ViewTour from './admin/ViewTour'; // Import ViewTour

import AdminMessages from './admin/AdminMessages'; // Import AdminMessages

import axios from 'axios';

// Global error handling for auth
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stale token/user data on any 401 error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="trips" element={<AdminTrips />} />
          <Route path="trips/:id" element={<ViewTour />} /> {/* Added View Tour Route */}
          <Route path="trips/new" element={<NewTripForm />} />
          <Route path="booking" element={<AdminBooking />} />
          <Route path="bookings/edit/:id" element={<EditBooking />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="messages" element={<AdminMessages />} /> {/* Add Messages Route */}
        </Route>
        <Route path="*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tours" element={<Tours />} />
                <Route path="/tours/:id" element={<TourDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/News" element={<News />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/FAQs" element={<FAQs />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/Account" element={<Account />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/Checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
