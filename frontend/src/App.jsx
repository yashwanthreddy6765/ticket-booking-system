import { useState } from 'react';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [events] = useState([
    { id: 1, name: 'Concert - Taylor Swift', date: '2024-02-15', price: 150, available: 100 },
    { id: 2, name: 'Sports - Cricket IPL', date: '2024-02-20', price: 50, available: 500 },
    { id: 3, name: 'Theater - Hamilton', date: '2024-03-10', price: 120, available: 200 },
    { id: 4, name: 'Conference - TechFest', date: '2024-03-25', price: 75, available: 300 },
  ]);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    eventId: '',
    quantity: 1,
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleBookTicket = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setBookingSuccess(false);

    // Validation
    if (!formData.userName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    if (!formData.userEmail.trim() || !formData.userEmail.includes('@')) {
      setErrorMessage('Please enter a valid email');
      return;
    }
    if (!formData.eventId) {
      setErrorMessage('Please select an event');
      return;
    }
    if (formData.quantity < 1) {
      setErrorMessage('Please select at least 1 ticket');
      return;
    }

    const selectedEvent = events.find(e => e.id === parseInt(formData.eventId));
    if (formData.quantity > selectedEvent.available) {
      setErrorMessage(`Only ${selectedEvent.available} tickets available`);
      return;
    }

    // Create booking
    const newBooking = {
      id: Date.now(),
      ...formData,
      eventId: parseInt(formData.eventId),
      eventName: selectedEvent.name,
      totalPrice: selectedEvent.price * formData.quantity,
      bookingDate: new Date().toLocaleDateString(),
    };

    setBookings([...bookings, newBooking]);
    setBookingSuccess(true);
    setFormData({ userName: '', userEmail: '', eventId: '', quantity: 1 });
    setTimeout(() => setBookingSuccess(false), 5000);
  };

  const cancelBooking = (bookingId) => {
    setBookings(bookings.filter(b => b.id !== bookingId));
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>🎫 Ticket Booking System</h1>
        <div className="nav-links">
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button
            className={currentPage === 'booking' ? 'active' : ''}
            onClick={() => setCurrentPage('booking')}
          >
            Book Tickets
          </button>
          <button
            className={currentPage === 'bookings' ? 'active' : ''}
            onClick={() => setCurrentPage('bookings')}
          >
            My Bookings ({bookings.length})
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && (
          <section className="home">
            <div className="hero">
              <h2>Welcome to Ticket Booking System</h2>
              <p>Book your favorite events with ease and confidence</p>
              <button onClick={() => setCurrentPage('booking')} className="cta-button">
                Start Booking Now
              </button>
            </div>
            <div className="features">
              <div className="feature-card">
                <h3>✨ Easy Booking</h3>
                <p>Book tickets in just a few clicks</p>
              </div>
              <div className="feature-card">
                <h3>🛡️ Secure Payment</h3>
                <p>Safe and encrypted transactions</p>
              </div>
              <div className="feature-card">
                <h3>📱 Mobile Friendly</h3>
                <p>Book from anywhere, anytime</p>
              </div>
              <div className="feature-card">
                <h3>⚡ Instant Confirmation</h3>
                <p>Get your booking confirmed instantly</p>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'booking' && (
          <section className="booking-section">
            <h2>Book Your Tickets</h2>
            {bookingSuccess && (
              <div className="success-message">
                ✅ Booking confirmed! Check your bookings tab.
              </div>
            )}
            {errorMessage && (
              <div className="error-message">
                ❌ {errorMessage}
              </div>
            )}
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <h3>{event.name}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Price:</strong> ${event.price}</p>
                  <p><strong>Available:</strong> {event.available} tickets</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleBookTicket} className="booking-form">
              <h3>Enter Your Details</h3>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Event:</label>
                <select
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Choose an event --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} - ${event.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Number of Tickets:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              {formData.eventId && (
                <div className="price-display">
                  <strong>
                    Total Price: ${events.find(e => e.id === parseInt(formData.eventId))?.price * formData.quantity || 0}
                  </strong>
                </div>
              )}
              <button type="submit" className="submit-button">
                Confirm Booking
              </button>
            </form>
          </section>
        )}

        {currentPage === 'bookings' && (
          <section className="bookings-section">
            <h2>My Bookings</h2>
            {bookings.length === 0 ? (
              <p className="no-bookings">You haven't booked any tickets yet.</p>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-details">
                      <h3>{booking.eventName}</h3>
                      <p><strong>Name:</strong> {booking.userName}</p>
                      <p><strong>Email:</strong> {booking.userEmail}</p>
                      <p><strong>Tickets:</strong> {booking.quantity}</p>
                      <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                      <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
                    </div>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="cancel-button"
                    >
                      Cancel Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 Ticket Booking System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
