import { useState } from 'react';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({ userName: '', userEmail: '', eventId: '', quantity: 1 });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [likes, setLikes] = useState({});

  const events = [
    { id: 1, name: 'Arijit Singh Live Concert', location: 'Mumbai', date: '2025-01-15', price: 2499, available: 500, category: 'concert' },
    { id: 2, name: 'Sunburn Festival', location: 'Goa', date: '2025-01-20', price: 3999, available: 1000, category: 'festival' },
    { id: 3, name: 'Coldplay World Tour', location: 'Bangalore', date: '2025-02-05', price: 4999, available: 800, category: 'concert' },
    { id: 4, name: 'IPL Cricket Final', location: 'Delhi', date: '2025-03-25', price: 1999, available: 2000, category: 'sports' },
    { id: 5, name: 'Lollapalooza India', location: 'Delhi', date: '2025-02-01', price: 2999, available: 5000, category: 'festival' },
    { id: 6, name: 'Indian Premier League', location: 'Kolkata', date: '2025-04-10', price: 2499, available: 1500, category: 'sports' },
    { id: 7, name: 'Holi Music Festival', location: 'Jaipur', date: '2025-03-10', price: 1499, available: 2000, category: 'festival' },
    { id: 8, name: 'NH7 Weekender', location: 'Pune', date: '2025-01-31', price: 3499, available: 3000, category: 'festival' },
    { id: 9, name: 'IIFA Awards Gala', location: 'Chennai', date: '2025-02-28', price: 5999, available: 2000, category: 'theater' },
    { id: 10, name: 'Indian Idol Live Show', location: 'Hyderabad', date: '2025-02-15', price: 1299, available: 1000, category: 'concert' },
    { id: 11, name: 'Epicenter Music Fest', location: 'Bangalore', date: '2025-03-05', price: 2999, available: 1500, category: 'festival' },
    { id: 12, name: 'Cricket India vs Australia', location: 'Delhi', date: '2025-04-20', price: 1799, available: 3000, category: 'sports' }
  ];

  const getThemeStyle = (category) => {
    const themes = {
      sports: { background: 'linear-gradient(135deg, #00a86b 0%, #228b22 100%)', bgImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)', icon: '⚽' },
      concert: { background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)', bgImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, transparent 50%)', icon: '🎸' },
      theater: { background: 'linear-gradient(135deg, #d4a574 0%, #8b4513 100%)', bgImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 10px, transparent 10px, transparent 20px)', icon: '🎭' },
      festival: { background: 'linear-gradient(135deg, #ffa500 0%, #ff6347 100%)', bgImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0%, transparent 50%)', icon: '🎪' }
    };
    return themes[category] || themes.concert;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'quantity' ? parseInt(value) : value });
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (formData.userName && formData.userEmail && formData.eventId) {
      const event = events.find((e) => e.id === parseInt(formData.eventId));
      const booking = {
        ...formData,
        eventId: parseInt(formData.eventId),
        eventName: event.name,
        totalPrice: event.price * formData.quantity,
        bookingDate: new Date().toLocaleDateString(),
      };
      setBookings([...bookings, booking]);
      setFormData({ userName: '', userEmail: '', eventId: '', quantity: 1 });
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    }
  };

  const toggleLike = (eventId) => {
    setLikes((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const cancelBooking = (index) => {
    setBookings(bookings.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    if (formData.eventId) {
      const event = events.find((e) => e.id === parseInt(formData.eventId));
      return event ? event.price * formData.quantity : 0;
    }
    return 0;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">🎭 Event Booking System</h1>
          <div className="nav-buttons">
            <button className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`} onClick={() => { setCurrentPage('home'); setSelectedEvent(null); }}>Home</button>
            <button className={`nav-btn ${currentPage === 'events' ? 'active' : ''}`} onClick={() => setCurrentPage('events')}>Book Tickets</button>
            <button className={`nav-btn ${currentPage === 'bookings' ? 'active' : ''}`} onClick={() => setCurrentPage('bookings')}>My Bookings ({bookings.length})</button>
          </div>
        </div>
      </nav>

      {selectedEvent && (
        <div className="event-detail-hero" style={{ background: getThemeStyle(selectedEvent.category).background, backgroundImage: getThemeStyle(selectedEvent.category).bgImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="event-detail-content">
            <button className="close-btn" onClick={() => setSelectedEvent(null)}>✕</button>
            <h2 className="event-detail-title">{getThemeStyle(selectedEvent.category).icon} {selectedEvent.name}</h2>
            <p className="event-detail-subtitle">📍 {selectedEvent.location} • 📅 {selectedEvent.date}</p>
            <div className="event-detail-info">
              <p><strong>Price per Ticket:</strong> ₹{selectedEvent.price}</p>
              <p><strong>Available Tickets:</strong> {selectedEvent.available}</p>
              <p><strong>Category:</strong> {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}</p>
            </div>
          </div>
        </div>
      )}

      {currentPage === 'home' && !selectedEvent && (
        <div className="home-section">
          <div className="hero-banner">
            <h2 className="hero-title">Experience Live Entertainment</h2>
            <p className="hero-subtitle">Discover and book tickets for concerts, festivals, sports, and theater events across India</p>
            <button className="hero-btn" onClick={() => setCurrentPage('events')}>Start Booking Now</button>
          </div>

          <div className="features-section">
            <div className="feature-card feature-1"><span className="feature-icon">⚡</span><h3>Instant Booking</h3><p>Reserve your tickets in seconds with our fast booking process</p></div>
            <div className="feature-card feature-2"><span className="feature-icon">🔒</span><h3>Secure Payment</h3><p>Your payment is encrypted and protected with industry standards</p></div>
            <div className="feature-card feature-3"><span className="feature-icon">📱</span><h3>Mobile Friendly</h3><p>Book anytime, anywhere on any device</p></div>
            <div className="feature-card feature-4"><span className="feature-icon">❤️</span><h3>Wishlist</h3><p>Like and save your favorite events for later</p></div>
          </div>
        </div>
      )}

      {currentPage === 'events' && !selectedEvent && (
        <div className="events-section">
          <h2 className="section-title">🎪 Upcoming Events in India</h2>
          <div className="events-container">
            {events.map((event) => (
              <div key={event.id} className="event-card" style={{ borderTopColor: getThemeStyle(event.category).background.split(',')[1] || '#667eea' }} onClick={() => handleEventClick(event)}>
                <div className="event-header">
                  <div className="event-title-section">
                    <span className="event-category-icon">{getThemeStyle(event.category).icon}</span>
                    <h3 className="event-name">{event.name}</h3>
                  </div>
                  <button className={`like-btn ${likes[event.id] ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); toggleLike(event.id); }}>{likes[event.id] ? '❤️' : '🤍'}</button>
                </div>
                <div className="event-details">
                  <p><strong>📍 Location:</strong> {event.location}</p>
                  <p><strong>📅 Date:</strong> {event.date}</p>
                  <p><strong>💰 Price:</strong> ₹{event.price}</p>
                  <p><strong>🎟️ Available:</strong> {event.available} tickets</p>
                </div>
                <button className="book-btn" onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}>View Details</button>
              </div>
            ))}
          </div>

          <div className="booking-form-section">
            <h2 className="section-title">✨ Complete Your Booking</h2>
            {bookingSuccess && <div className="success-message">✅ Booking confirmed! Check your bookings section.</div>}
            <form className="booking-form" onSubmit={handleBooking}>
              <div className="form-group"><label htmlFor="userName">Your Name:</label><input type="text" id="userName" name="userName" value={formData.userName} onChange={handleInputChange} placeholder="Enter your full name" required /></div>
              <div className="form-group"><label htmlFor="userEmail">Email Address:</label><input type="email" id="userEmail" name="userEmail" value={formData.userEmail} onChange={handleInputChange} placeholder="your@email.com" required /></div>
              <div className="form-group"><label htmlFor="eventId">Select Event:</label><select id="eventId" name="eventId" value={formData.eventId} onChange={handleInputChange} required><option value="">-- Choose an event --</option>{events.map((event) => (<option key={event.id} value={event.id}>{event.name} - ₹{event.price}</option>))}</select></div>
              <div className="form-group"><label htmlFor="quantity">Number of Tickets:</label><input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" max="10" required /></div>
              {calculateTotal() > 0 && <div className="total-price">Total Price: ₹{calculateTotal()}</div>}
              <button type="submit" className="submit-btn">Confirm Booking</button>
            </form>
          </div>
        </div>
      )}

      {currentPage === 'bookings' && (
        <div className="bookings-section">
          <h2 className="section-title">📋 My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="empty-bookings"><p>No bookings yet. Start booking your favorite events!</p></div>
          ) : (
            <div className="bookings-container">
              {bookings.map((booking, index) => (
                <div key={index} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.eventName}</h3>
                    <button className="cancel-btn" onClick={() => cancelBooking(index)}>Cancel Booking</button>
                  </div>
                  <div className="booking-details">
                    <p><strong>Name:</strong> {booking.userName}</p>
                    <p><strong>Email:</strong> {booking.userEmail}</p>
                    <p><strong>Tickets:</strong> {booking.quantity}</p>
                    <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                    <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="footer"><p>&copy; 2025 Event Booking System. All Rights Reserved.</p></footer>
    </div>
  );
};

export default App;
