# Complete API Integration Guide

## Overview
This guide contains all backend API endpoints and their integration with the frontend.

## Backend API Endpoints

### 1. GET /api/shows - List All Shows
**Description:** Fetch all available shows with optional filtering
**Method:** GET
**Query Parameters:**
- `genre` (optional): Filter by genre
- `language` (optional): Filter by language
- `sort` (optional): 'latest' or 'rating'

**Response:**
```json
{
  "success": true,
  "shows": [
    {
      "id": "uuid",
      "name": "Avatar 2",
      "description": "Amazing movie",
      "language": "English",
      "genre": "Sci-Fi",
      "duration": 192,
      "rating": 8.5,
      "poster_url": "https://...",
      "created_at": "2024-12-11T..."
    }
  ]
}
```

### 2. GET /api/shows/:id - Get Show Details
**Description:** Get specific show with all its slots
**Method:** GET
**URL Parameters:**
- `id`: Show UUID

**Response:**
```json
{
  "success": true,
  "show": {
    "id": "uuid",
    "name": "Avatar 2",
    "description": "Amazing movie",
    "language": "English",
    "genre": "Sci-Fi",
    "duration": 192,
    "rating": 8.5,
    "poster_url": "https://...",
    "slots": [
      {
        "id": "slot-uuid",
        "start_time": "2024-12-15T10:00:00",
        "available_seats": 45,
        "price": 250.00
      }
    ]
  }
}
```

### 3. GET /api/shows/:id/slots/:slotId/seats - Get Seat Layout
**Description:** Get all seats for a specific slot with availability status
**Method:** GET
**URL Parameters:**
- `id`: Show UUID
- `slotId`: Slot UUID

**Response:**
```json
{
  "success": true,
  "layout": {
    "rows": {
      "A": [
        {"id": "seat-uuid", "number": "A1", "status": "AVAILABLE"},
        {"id": "seat-uuid", "number": "A2", "status": "BOOKED"}
      ],
      "B": [...]
    },
    "totalSeats": 300,
    "availableSeats": 150
  }
}
```

### 4. POST /api/bookings - Create Booking
**Description:** Create a new booking with seat selection
**Method:** POST
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "userId": "user-uuid",
  "slotId": "slot-uuid",
  "seatNumbers": ["A1", "A2", "A3"]
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "booking-uuid",
    "user_id": "user-uuid",
    "slot_id": "slot-uuid",
    "show_id": "show-uuid",
    "num_seats": 3,
    "total_price": 750.00,
    "status": "PENDING",
    "payment_status": "PENDING",
    "seats_booked": ["A1", "A2", "A3"],
    "created_at": "2024-12-11T...",
    "expires_at": "2024-12-11T..."
  }
}
```

### 5. GET /api/bookings/:id - Get Booking Details
**Description:** Get specific booking information
**Method:** GET
**URL Parameters:**
- `id`: Booking UUID

**Response:**
```json
{
  "success": true,
  "booking": {...}
}
```

### 6. GET /api/bookings/user/:userId - Get User Bookings
**Description:** Get all bookings for a specific user
**Method:** GET
**URL Parameters:**
- `userId`: User UUID

**Response:**
```json
{
  "success": true,
  "bookings": [{...}, {...}]
}
```

### 7. PATCH /api/bookings/:id/cancel - Cancel Booking
**Description:** Cancel an existing booking
**Method:** PATCH
**URL Parameters:**
- `id`: Booking UUID

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully"
}
```

---

## ADMIN ENDPOINTS

### 8. POST /api/admin/shows - Create Show
**Description:** Create a new show (ADMIN ONLY)
**Method:** POST
**Headers:** Content-Type: application/json
**Body:**
```json
{
  "name": "Avatar 2",
  "description": "Epic sci-fi movie",
  "language": "English",
  "genre": "Sci-Fi",
  "duration": 192,
  "rating": 8.5,
  "poster_url": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "show": {"id": "uuid", ...}
}
```

### 9. POST /api/admin/shows/:showId/slots - Create Slot
**Description:** Create a new time slot for a show
**Method:** POST
**Headers:** Content-Type: application/json
**URL Parameters:**
- `showId`: Show UUID

**Body:**
```json
{
  "start_time": "2024-12-15T10:00:00",
  "end_time": "2024-12-15T12:30:00",
  "total_seats": 300,
  "price": 250.00,
  "screen_name": "Screen 1"
}
```

**Response:**
```json
{
  "success": true,
  "slot": {...},
  "seats_created": 300
}
```

### 10. GET /api/admin/shows/:showId/slots - Get Show Slots
**Description:** Get all slots for a show
**Method:** GET
**URL Parameters:**
- `showId`: Show UUID

**Response:**
```json
{
  "success": true,
  "slots": [{...}, {...}]
}
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": "userId is required"
}
```

### 409 Conflict
```json
{
  "error": "You already have a booking for this slot",
  "code": "DUPLICATE_BOOKING"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database error occurred"
}
```

---

## FRONTEND INTEGRATION

### API Service (src/services/api.js)

All endpoints are already configured. Usage example:

```javascript
// Fetch all shows
const response = await showsAPI.getAll();

// Get show details
const show = await showsAPI.getById(showId);

// Get seat layout
const seats = await showsAPI.getSeats(showId, slotId);

// Create booking
const booking = await bookingsAPI.create({
  userId: 'user-123',
  slotId: 'slot-456',
  seatNumbers: ['A1', 'A2']
});

// Get user bookings
const userBookings = await bookingsAPI.getUserBookings(userId);

// Cancel booking
await bookingsAPI.cancel(bookingId);

// Create show (admin)
await adminAPI.createShow({...});

// Create slot (admin)
await adminAPI.createSlot(showId, {...});
```

---

## TESTING WITH CURL

### Get All Shows
```bash
curl http://localhost:5000/api/shows
```

### Create a Show (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/shows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Avatar 2",
    "description": "Epic movie",
    "language": "English",
    "genre": "Sci-Fi",
    "duration": 192,
    "rating": 8.5,
    "poster_url": "https://..."
  }'
```

### Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "slotId": "slot-456",
    "seatNumbers": ["A1", "A2", "A3"]
  }'
```

### Get User Bookings
```bash
curl http://localhost:5000/api/bookings/user/user-123
```

---

## KEY FEATURES

✅ **Concurrency Control** - SERIALIZABLE transactions prevent race conditions
✅ **Seat Locking** - Automatic PENDING booking expiry after 2 minutes
✅ **Real-time Availability** - Live seat status updates
✅ **Validation** - Input validation on all endpoints
✅ **Error Handling** - Comprehensive error messages
✅ **Indexes** - Optimized database queries
✅ **Swagger Docs** - Full API documentation at /api-docs

---

## NOTES

1. All timestamps are in ISO 8601 format (UTC)
2. UUIDs are used for all IDs
3. Prices are in decimal format
4. Seat numbers follow pattern: ROW + NUMBER (e.g., A1, B5)
5. Bookings expire after 2 minutes in PENDING status
6. Multiple bookings per user per slot are prevented
