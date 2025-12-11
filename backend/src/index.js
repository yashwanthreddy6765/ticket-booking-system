const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory storage for bookings
let bookings = [];
let bookingIdCounter = 1;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock database for events
const events = [
  { id: 1, name: 'Concert - Taylor Swift', date: '2024-02-15', price: 150, available: 100 },
  { id: 2, name: 'Sports - Cricket IPL', date: '2024-02-20', price: 50, available: 500 },
  { id: 3, name: 'Theater - Hamilton', date: '2024-03-10', price: 120, available: 200 },
  { id: 4, name: 'Conference - TechFest', date: '2024-03-25', price: 75, available: 300 },
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Get all events
app.get('/api/events', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: events,
      message: 'Events retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving events',
      error: error.message
    });
  }
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    res.status(200).json({
      success: true,
      data: event,
      message: 'Event retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving event',
      error: error.message
    });
  }
});

// Create a booking
app.post('/api/bookings', (req, res) => {
  try {
    const { userName, userEmail, eventId, quantity } = req.body;

    // Validation
    if (!userName || !userEmail || !eventId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userName, userEmail, eventId, quantity'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Find event
    const event = events.find(e => e.id === parseInt(eventId));
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check availability
    if (quantity > event.available) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.available} tickets available for this event`
      });
    }

    // Create booking
    const booking = {
      id: bookingIdCounter++,
      userName,
      userEmail,
      eventId: parseInt(eventId),
      eventName: event.name,
      quantity: parseInt(quantity),
      totalPrice: event.price * parseInt(quantity),
      bookingDate: new Date().toISOString(),
      status: 'confirmed'
    };

    bookings.push(booking);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: bookings,
      message: 'Bookings retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message
    });
  }
});

// Get booking by ID
app.get('/api/bookings/:id', (req, res) => {
  try {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving booking',
      error: error.message
    });
  }
});

// Update booking
app.put('/api/bookings/:id', (req, res) => {
  try {
    const booking = bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update fields
    if (req.body.userName) booking.userName = req.body.userName;
    if (req.body.userEmail) booking.userEmail = req.body.userEmail;
    if (req.body.quantity) {
      const event = events.find(e => e.id === booking.eventId);
      booking.quantity = req.body.quantity;
      booking.totalPrice = event.price * booking.quantity;
    }

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking',
      error: error.message
    });
  }
});

// Delete booking (cancel)
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const deletedBooking = bookings.splice(index, 1);
    res.status(200).json({
      success: true,
      data: deletedBooking[0],
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Ticket Booking System API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      events: {
        getAll: 'GET /api/events',
        getById: 'GET /api/events/:id'
      },
      bookings: {
        create: 'POST /api/bookings',
        getAll: 'GET /api/bookings',
        getById: 'GET /api/bookings/:id',
        update: 'PUT /api/bookings/:id',
        delete: 'DELETE /api/bookings/:id'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
