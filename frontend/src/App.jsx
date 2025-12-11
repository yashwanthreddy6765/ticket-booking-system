import { useState } from 'react';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [events] = useState([
    { id: 1, name: '🎬 आमिर खान की फिल्म - Mahavira Theatre, Hyderabad', date: '2024-02-15', price: 299, available: 100 },
    { id: 2, name: '🎭 Vyjayanthimala Theatre, Chennai', date: '2024-02-20', price: 249, available: 80 },
    { id: 3, name: '🎪 संगीत कार्यक्रम - Delhi Concert Hall', date: '2024-03-10', price: 399, available: 120 },
    { id: 4, name: '🏏 IPL Match - Eden Gardens, Kolkata', date: '2024-03-25', price: 799, available: 200 },
    { id: 5, name: '🎬 राज पली सिनेमा - Hyderabad', date: '2024-04-05', price: 279, available: 90 },
    { id: 6, name: '⚾ India vs Australia - Arun Jaitley Stadium, Delhi', date: '2024-04-15', price: 1299, available: 150 },
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
      setErrorMessage('कृपया अपना नाम दर्ज करें');
      return;
    }
    if (!formData.userEmail.trim() || !formData.userEmail.includes('@')) {
      setErrorMessage('कृपया एक वैध ईमेल दर्ज करें');
      return;
    }
    if (!formData.eventId) {
      setErrorMessage('कृपया एक इवेंट चुनें');
      return;
    }
    if (formData.quantity < 1) {
      setErrorMessage('कृपया कम से कम 1 टिकट चुनें');
      return;
    }

    const selectedEvent = events.find(e => e.id === parseInt(formData.eventId));
    if (formData.quantity > selectedEvent.available) {
      setErrorMessage(`केवल ${selectedEvent.available} टिकट उपलब्ध हैं`);
      return;
    }

    // Create booking
    const newBooking = {
      id: Date.now(),
      ...formData,
      eventId: parseInt(formData.eventId),
      eventName: selectedEvent.name,
      totalPrice: selectedEvent.price * formData.quantity,
      bookingDate: new Date().toLocaleDateString('hi-IN'),
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
        <h1>🎟️ भारतीय टिकट बुकिंग - Indian Ticket Booking</h1>
        <div className="nav-links">
          <button
            className={currentPage === 'home' ? 'active' : ''}
            onClick={() => setCurrentPage('home')}
          >
            होम / Home
          </button>
          <button
            className={currentPage === 'booking' ? 'active' : ''}
            onClick={() => setCurrentPage('booking')}
          >
            टिकट बुक करें / Book Tickets
          </button>
          <button
            className={currentPage === 'bookings' ? 'active' : ''}
            onClick={() => setCurrentPage('bookings')}
          >
            मेरी बुकिंग ({bookings.length})
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'home' && (
          <section className="home">
            <div className="hero">
              <h2>भारतीय टिकट बुकिंग सिस्टम में आपका स्वागत है</h2>
              <p>आसानी से और आत्मविश्वास के साथ अपने पसंदीदा इवेंट की टिकटें बुक करें</p>
              <button onClick={() => setCurrentPage('booking')} className="cta-button">
                अभी बुकिंग शुरू करें
              </button>
            </div>
            <div className="features">
              <div className="feature-card">
                <h3>✨ आसान बुकिंग</h3>
                <p>कुछ ही क्लिक में टिकट बुक करें</p>
              </div>
              <div className="feature-card">
                <h3>🛡️ सुरक्षित भुगतान</h3>
                <p>सुरक्षित और एन्क्रिप्टेड लेनदेन</p>
              </div>
              <div className="feature-card">
                <h3>📱 मोबाइल फ्रेंडली</h3>
                <p>कहीं से भी, कभी भी बुक करें</p>
              </div>
              <div className="feature-card">
                <h3>⚡ तुरंत पुष्टि</h3>
                <p>तुरंत बुकिंग पुष्टि प्राप्त करें</p>
              </div>
            </div>
          </section>
        )}

        {currentPage === 'booking' && (
          <section className="booking-section">
            <h2>अपनी टिकटें बुक करें</h2>
            {bookingSuccess && (
              <div className="success-message">
                ✅ बुकिंग की गई! अपनी बुकिंग टैब देखें।
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
                  <p><strong>तारीख:</strong> {event.date}</p>
                  <p><strong>कीमत:</strong> ₹{event.price}</p>
                  <p><strong>उपलब्ध:</strong> {event.available} टिकट</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleBookTicket} className="booking-form">
              <h3>अपना विवरण दर्ज करें</h3>
              <div className="form-group">
                <label>नाम:</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="आपका पूरा नाम"
                  required
                />
              </div>
              <div className="form-group">
                <label>ईमेल:</label>
                <input
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleInputChange}
                  placeholder="आपका@ईमेल.कॉम"
                  required
                />
              </div>
              <div className="form-group">
                <label>इवेंट चुनें:</label>
                <select
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- एक इवेंट चुनें --</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} - ₹{event.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>टिकटों की संख्या:</label>
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
                    कुल कीमत: ₹{events.find(e => e.id === parseInt(formData.eventId))?.price * formData.quantity || 0}
                  </strong>
                </div>
              )}
              <button type="submit" className="submit-button">
                बुकिंग की पुष्टि करें
              </button>
            </form>
          </section>
        )}

        {currentPage === 'bookings' && (
          <section className="bookings-section">
            <h2>मेरी बुकिंग</h2>
            {bookings.length === 0 ? (
              <p className="no-bookings">आपने अभी कोई टिकट बुक नहीं किया है।</p>
            ) : (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-details">
                      <h3>{booking.eventName}</h3>
                      <p><strong>नाम:</strong> {booking.userName}</p>
                      <p><strong>ईमेल:</strong> {booking.userEmail}</p>
                      <p><strong>टिकट:</strong> {booking.quantity}</p>
                      <p><strong>कुल कीमत:</strong> ₹{booking.totalPrice}</p>
                      <p><strong>बुकिंग की तारीख:</strong> {booking.bookingDate}</p>
                    </div>
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="cancel-button"
                    >
                      बुकिंग रद्द करें
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2024 भारतीय टिकट बुकिंग सिस्टम। सर्वाधिकार सुरक्षित।</p>
      </footer>
    </div>
  );
};

export default App;
