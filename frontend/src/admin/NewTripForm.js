import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload } from 'react-icons/fa';
import '../Style/NewTripForm.css';

const NewTripForm = ({ setShowNewTripForm = () => { }, fetchTours = () => { }, existingTour = null }) => {
  const [newTripData, setNewTripData] = useState({
    title: '',
    description: '',
    image: null,
    gallery: [],
    price: '',
    duration: '',
    location: {
      address: '',
      city: '',
      country: '',
      latitude: 0,
      longitude: 0,
    },
    availability: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      maxGroupSize: 10,
    },
    services_included: '',
    services_excluded: '',
    banner: null,
    itinerary: [],
  });
  const [formMessage, setFormMessage] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState([]);


  // Populate data if editing
  useEffect(() => {
    if (existingTour) {
      setNewTripData({
        title: existingTour.title || '',
        description: existingTour.description || '',
        price: existingTour.price || '',
        duration: existingTour.duration || '',
        location: {
          address: existingTour.location?.address || '',
          city: existingTour.location?.city || '',
          country: existingTour.location?.country || '',
          latitude: existingTour.location?.latitude || 0,
          longitude: existingTour.location?.longitude || 0,
        },
        availability: {
          startDate: existingTour.availability?.startDate ? existingTour.availability.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
          endDate: existingTour.availability?.endDate ? existingTour.availability.endDate.split('T')[0] : new Date().toISOString().split('T')[0],
          maxGroupSize: existingTour.availability?.maxGroupSize || 10,
        },
        services_included: existingTour.services?.included ? existingTour.services.included.join(', ') : '',
        services_excluded: existingTour.services?.excluded ? existingTour.services.excluded.join(', ') : '',
        itinerary: existingTour.itinerary || [],
        image: null, // Don't pre-fill file objects, backend handles keeping existing if null
        banner: null,
        gallery: [],
      });

      const uniqueGallery = existingTour.gallery ? existingTour.gallery.filter((item, index, self) =>
        index === self.findIndex((t) => t.image === item.image)
      ) : [];

      setExistingGalleryUrls(uniqueGallery.map(g => g.image));
      // Set previews
      if (existingTour.image) setMainImagePreview(existingTour.image);
      if (existingTour.banner) setBannerPreview(existingTour.banner);
      if (uniqueGallery.length > 0) {
        setGalleryPreviews(uniqueGallery.map(g => g.image));
      }
    }
  }, [existingTour]);


  const handleNewTripChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      setNewTripData(prev => ({ ...prev, image: files[0] }));
      setMainImagePreview(URL.createObjectURL(files[0]));
    } else if (name === 'banner') {
      setNewTripData(prev => ({ ...prev, banner: files[0] }));
      setBannerPreview(URL.createObjectURL(files[0]));
    } else if (name === 'gallery') {
      const newGalleryFiles = Array.from(files);
      setNewTripData(prev => ({ ...prev, gallery: [...prev.gallery, ...newGalleryFiles] }));
      setGalleryPreviews(prev => [...prev, ...newGalleryFiles.map(file => URL.createObjectURL(file))]);
    } else if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setNewTripData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else if (name.includes('availability.')) {
      const availabilityField = name.split('.')[1];
      setNewTripData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [availabilityField]: availabilityField === 'maxGroupSize' ? parseInt(value, 10) : value
        }
      }));
    } else {
      setNewTripData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeMainImage = () => {
    setNewTripData(prev => ({ ...prev, image: null }));
    setMainImagePreview(null);
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const removeBannerImage = () => {
    setNewTripData(prev => ({ ...prev, banner: null }));
    setBannerPreview(null);
    const fileInput = document.getElementById('banner');
    if (fileInput) fileInput.value = '';
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));

    if (index < existingGalleryUrls.length) {
      // Removing an existing image URL
      setExistingGalleryUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // Removing a newly added file
      const fileIndex = index - existingGalleryUrls.length;
      setNewTripData(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== fileIndex)
      }));
    }
  };

  const addItineraryDay = () => {
    setNewTripData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, description: '' }]
    }));
  };

  const removeItineraryDay = (index) => {
    setNewTripData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }))
    }));
  };

  const handleItineraryChange = (index, value) => {
    const updatedItinerary = [...newTripData.itinerary];
    updatedItinerary[index].description = value;
    setNewTripData(prev => ({ ...prev, itinerary: updatedItinerary }));
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    setFormMessage('');

    const formData = new FormData();
    // Build combined gallery state
    formData.append('existingGallery', JSON.stringify(existingGalleryUrls));

    for (const key in newTripData) {
      if (key === 'location') {
        formData.append('location.address', newTripData.location.address || '');
        formData.append('location.city', newTripData.location.city || '');
        formData.append('location.country', newTripData.location.country || '');
        formData.append('location.latitude', newTripData.location.latitude || 0);
        formData.append('location.longitude', newTripData.location.longitude || 0);
      } else if (key === 'availability') {
        formData.append('availability.startDate', newTripData.availability.startDate);
        formData.append('availability.endDate', newTripData.availability.endDate);
        formData.append('availability.maxGroupSize', newTripData.availability.maxGroupSize);
      } else if (key === 'image') {
        if (newTripData.image) formData.append('image', newTripData.image);
      } else if (key === 'banner') {
        if (newTripData.banner) formData.append('banner', newTripData.banner);
      } else if (key === 'gallery') {
        if (newTripData.gallery && newTripData.gallery.length > 0) {
          newTripData.gallery.forEach((file) => formData.append(`gallery`, file));
        }
      } else if (key === 'itinerary') {
        formData.append('itinerary', JSON.stringify(newTripData.itinerary));
      } else if (key === 'services_included') {
        formData.append('services[included]', newTripData.services_included);
      } else if (key === 'services_excluded') {
        formData.append('services[excluded]', newTripData.services_excluded);
      } else if (key !== 'image' && key !== 'banner' && key !== 'gallery' && key !== 'location' && key !== 'availability' && key !== 'itinerary' && key !== 'services_included' && key !== 'services_excluded') {
        if (newTripData[key] !== null && newTripData[key] !== undefined) {
          formData.append(key, newTripData[key]);
        }
      }
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };

      const response = await axios.put(`https://travel-website-hfqu.onrender.com/api/v1/tours/${existingTour._id}`, formData, config);

      if (response.data.success) {
        setFormMessage({ type: 'success', text: 'Trip updated successfully!' });
        setTimeout(() => {
          if (typeof setShowNewTripForm === 'function') setShowNewTripForm(false);
          if (typeof fetchTours === 'function') fetchTours();
        }, 1500);
      } else {
        setFormMessage({ type: 'error', text: 'Update failed.' });
      }
    } catch (err) {
      console.error('Error updating trip:', err);
      setFormMessage({ type: 'error', text: err.response?.data?.error || 'An error occurred.' });
    }
  };

  const handleNewTripSubmit = async (e) => {
    e.preventDefault();
    setFormMessage('');

    const formData = new FormData();
    for (const key in newTripData) {
      if (key === 'location') {
        formData.append('location.address', newTripData.location.address || '');
        formData.append('location.city', newTripData.location.city || '');
        formData.append('location.country', newTripData.location.country || '');
        formData.append('location.latitude', newTripData.location.latitude || 0);
        formData.append('location.longitude', newTripData.location.longitude || 0);
      } else if (key === 'availability') {
        formData.append('availability.startDate', newTripData.availability.startDate);
        formData.append('availability.endDate', newTripData.availability.endDate);
        formData.append('availability.maxGroupSize', newTripData.availability.maxGroupSize);
      } else if (key === 'image') {
        if (newTripData.image) formData.append('image', newTripData.image);
      } else if (key === 'banner') {
        if (newTripData.banner) formData.append('banner', newTripData.banner);
      } else if (key === 'gallery') {
        if (newTripData.gallery && newTripData.gallery.length > 0) {
          newTripData.gallery.forEach((file) => formData.append(`gallery`, file));
        }
      } else if (key === 'itinerary') {
        formData.append('itinerary', JSON.stringify(newTripData.itinerary));
      } else if (key === 'services_included') {
        formData.append('services[included]', newTripData.services_included);
      } else if (key === 'services_excluded') {
        formData.append('services[excluded]', newTripData.services_excluded);
      } else if (key !== 'image' && key !== 'banner' && key !== 'gallery' && key !== 'location' && key !== 'availability' && key !== 'itinerary' && key !== 'services_included' && key !== 'services_excluded') {
        if (newTripData[key] !== null && newTripData[key] !== undefined) {
          formData.append(key, newTripData[key]);
        }
      }
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      };

      const response = await axios.post('https://travel-website-hfqu.onrender.com/api/v1/tours', formData, config);

      if (response.data.success) {
        setFormMessage({ type: 'success', text: 'Trip added successfully!' });
        // Reset
        setNewTripData({
          title: '', description: '', image: null, gallery: [], price: '', duration: '',
          location: { address: '', city: '', country: '', latitude: 0, longitude: 0 },
          availability: { startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], maxGroupSize: 10 },
          services_included: '', services_excluded: '', banner: null, itinerary: [],
        });
        setMainImagePreview(null);
        setBannerPreview(null);
        setGalleryPreviews([]);
        setExistingGalleryUrls([]);

        setTimeout(() => {
          if (typeof setShowNewTripForm === 'function') setShowNewTripForm(false);
          if (typeof fetchTours === 'function') fetchTours();
        }, 1500);
      } else {
        setFormMessage({ type: 'error', text: 'Operation failed.' });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setFormMessage({ type: 'error', text: err.response?.data?.error || 'An error occurred.' });
    }
  };

  return (
    <div className="new-trip-form-container">
      <h2>{existingTour ? 'Edit Trip' : 'Add New Trip'}</h2>
      <p>{existingTour ? 'Update the details of your tour package' : 'Add a new tour package to your offerings'}</p>

      {formMessage && (
        <div className={`form-message ${formMessage.type}`}>
          {formMessage.text}
        </div>
      )}

      <form onSubmit={existingTour ? handleUpdateTrip : handleNewTripSubmit} className="new-trip-form-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="form-section">
            <h3>Trip Information</h3>
            <div className="form-group">
              <label htmlFor="title">Trip Name</label>
              <input type="text" id="title" name="title" value={newTripData.title} onChange={handleNewTripChange} placeholder="e.g., Adventure in the Alps" required />
            </div>
            <div className="form-group">
              <label htmlFor="description">Trip Description</label>
              <textarea id="description" name="description" value={newTripData.description} onChange={handleNewTripChange} placeholder="Detailed description of the trip..." required></textarea>
            </div>

            <div className="form-group">
              <label>Itinerary</label>
              {newTripData.itinerary.map((item, index) => (
                <div key={index} className="itinerary-item" style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold' }}>Day {item.day}:</span>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItineraryChange(index, e.target.value)}
                    placeholder={`Description for Day ${item.day}`}
                    required
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={() => removeItineraryDay(index)} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                </div>
              ))}
              <button type="button" onClick={addItineraryDay} style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}>+ Add Day</button>
            </div>

            <div className="form-group">
              <label htmlFor="services_included">Services Included (comma-separated)</label>
              <input type="text" id="services_included" name="services_included" value={newTripData.services_included} onChange={handleNewTripChange} placeholder="e.g., Accommodation, Flights, Meals" />
            </div>
            <div className="form-group">
              <label htmlFor="services_excluded">Services Excluded (comma-separated)</label>
              <input type="text" id="services_excluded" name="services_excluded" value={newTripData.services_excluded} onChange={handleNewTripChange} placeholder="e.g., Visa fees, Personal expenses" />
            </div>
          </div>

          <div className="form-section">
            <h3>Location Details</h3>
            <div className="form-group">
              <label htmlFor="location_address">Address</label>
              <input type="text" id="location_address" name="location.address" value={newTripData.location.address} onChange={handleNewTripChange} placeholder="Street Address" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location_city">City</label>
                <input type="text" id="location_city" name="location.city" value={newTripData.location.city} onChange={handleNewTripChange} placeholder="City" required />
              </div>
              <div className="form-group">
                <label htmlFor="location_country">Country</label>
                <input type="text" id="location_country" name="location.country" value={newTripData.location.country} onChange={handleNewTripChange} placeholder="Country" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location_latitude">Latitude</label>
                <input type="number" id="location_latitude" name="location.latitude" value={newTripData.location.latitude} onChange={handleNewTripChange} placeholder="Latitude" />
              </div>
              <div className="form-group">
                <label htmlFor="location_longitude">Longitude</label>
                <input type="number" id="location_longitude" name="location.longitude" value={newTripData.location.longitude} onChange={handleNewTripChange} placeholder="Longitude" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="form-section">
            <h3>Pricing & Duration</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (RM)</label>
                <input type="number" id="price" name="price" value={newTripData.price} onChange={handleNewTripChange} placeholder="e.g., 1200" required />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (Days)</label>
                <input type="number" id="duration" name="duration" value={newTripData.duration} onChange={handleNewTripChange} placeholder="e.g., 7" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="availability_maxGroupSize">Max Group Size</label>
              <input type="number" id="availability_maxGroupSize" name="availability.maxGroupSize" value={newTripData.availability.maxGroupSize} onChange={handleNewTripChange} placeholder="e.g., 10" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="availability_startDate">Start Date</label>
                <input type="date" id="availability_startDate" name="availability.startDate" value={newTripData.availability.startDate} onChange={handleNewTripChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="availability_endDate">End Date</label>
                <input type="date" id="availability_endDate" name="availability.endDate" value={newTripData.availability.endDate} onChange={handleNewTripChange} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Trip Images</h3>
            {/* Main Image */}
            <div className="form-group">
              <label htmlFor="image">Main Image</label>
              {!mainImagePreview ? (
                <label htmlFor="image" className="image-upload-area">
                  <FaUpload />
                  <p>Click to Upload</p>
                  <input type="file" id="image" name="image" onChange={handleNewTripChange} accept="image/*" />
                </label>
              ) : (
                <div className="image-preview-container">
                  <div className="image-preview-item">
                    <img src={mainImagePreview} alt="Main Preview" />
                    <button type="button" className="remove-image-btn" onClick={removeMainImage}>Remove</button>
                  </div>
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div className="form-group">
              <label htmlFor="banner">Banner Image</label>
              {!bannerPreview ? (
                <label htmlFor="banner" className="image-upload-area">
                  <FaUpload />
                  <p>Click to Upload Banner</p>
                  <input type="file" id="banner" name="banner" onChange={handleNewTripChange} accept="image/*" />
                </label>
              ) : (
                <div className="image-preview-container">
                  <div className="image-preview-item">
                    <img src={bannerPreview} alt="Banner Preview" />
                    <button type="button" className="remove-image-btn" onClick={removeBannerImage}>Remove</button>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="form-group">
              <label htmlFor="gallery">Gallery Images (multiple)</label>
              <label htmlFor="gallery" className="image-upload-area">
                <FaUpload />
                <p>Click to Upload More</p>
                <input type="file" id="gallery" name="gallery" multiple onChange={handleNewTripChange} accept="image/*" />
              </label>
              {galleryPreviews.length > 0 && (
                <div className="image-preview-container">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Gallery Preview ${index + 1}`} />
                      <button type="button" className="remove-image-btn" onClick={() => removeGalleryImage(index)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions-bottom">
          <button type="button" className="save-btn" onClick={() => setShowNewTripForm(false)}>Cancel</button>
          <button type="submit" className="add-trip-btn">{existingTour ? 'Update Trip' : 'Add Trip'}</button>
        </div>
      </form>
    </div>
  );
};

export default NewTripForm;