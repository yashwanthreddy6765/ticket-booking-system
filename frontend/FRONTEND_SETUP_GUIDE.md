# Frontend Setup Guide - BookMyShow Ticket Booking

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Directory Structure to Create

```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── ShowsList.jsx
│   │   ├── SeatSelection.jsx
│   │   ├── BookingForm.jsx
│   │   ├── BookingHistory.jsx
│   │   └── Navigation.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── UserPage.jsx
│   │   └── BookingPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── index.html
├── vite.config.js
├── .env
└── .gitignore
```

## Files to Create Locally

### 1. vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
})
```

### 2. .env
```
VITE_API_URL=http://localhost:5000/api
```

### 3. .gitignore
```
node_modules/
.env
dist/
.DS_Store
*.log
```

### 4. public/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BookMyShow - Ticket Booking</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 5. src/main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 6. src/context/AuthContext.jsx
```jsx
import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    type: 'user', // 'admin' or 'user'
    bookings: []
  })

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 7. src/services/api.js
```javascript
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const showsAPI = {
  getAll: () => api.get('/shows'),
  getById: (id) => api.get(`/shows/${id}`),
  getSlots: (id) => api.get(`/shows/${id}/slots`),
  getSeats: (id, slotId) => api.get(`/shows/${id}/slots/${slotId}/seats`)
}

export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`)
}

export const adminAPI = {
  createShow: (data) => api.post('/admin/shows', data),
  createSlot: (showId, data) => api.post(`/admin/shows/${showId}/slots`, data)
}

export default api
```

### 8. src/App.jsx
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import AdminPage from './pages/AdminPage'
import UserPage from './pages/UserPage'
import BookingPage from './pages/BookingPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/booking/:showId/:slotId" element={<BookingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
```

### 9. src/App.css
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  background: #f5f5f5;
}

button {
  padding: 10px 20px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #c40812;
}

input, select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.seat {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  margin: 5px;
  cursor: pointer;
  display: inline-block;
}

.seat.available {
  background: #4CAF50;
  border-color: #4CAF50;
}

.seat.booked {
  background: #9E9E9E;
  border-color: #9E9E9E;
}

.seat.selected {
  background: #2196F3;
  border-color: #2196F3;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
}

.success {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 15px;
  border-radius: 4px;
  margin: 10px 0;
}
```

## Additional Component Templates

Create these components in `src/components/`:

- **Navigation.jsx**: Navigation bar with user/admin toggle
- **ShowsList.jsx**: List of all available shows
- **SeatSelection.jsx**: Interactive seat selection grid
- **BookingForm.jsx**: Booking confirmation form
- **AdminDashboard.jsx**: Admin panel for creating shows

Create these pages in `src/pages/`:

- **UserPage.jsx**: User home page with shows list
- **AdminPage.jsx**: Admin dashboard
- **BookingPage.jsx**: Booking confirmation page

## Deployment Instructions

### 1. Build for Production
```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option B: Using GitHub**
1. Push code to GitHub
2. Go to vercel.com
3. Import your GitHub repository
4. Set environment variables
5. Deploy

## Running Tests

All features include:
- Real-time seat availability
- Form validation
- Error handling
- Loading states
- Context API for state management
- React Router for navigation

## API Endpoints Connected

- `GET /api/shows` - List all shows
- `GET /api/shows/:id` - Get show details
- `GET /api/shows/:id/slots/:slotId/seats` - Get available seats
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `POST /api/admin/shows` - Create show (admin)
- `POST /api/admin/shows/:showId/slots` - Create slot (admin)

## Notes

- Update `VITE_API_URL` in .env with your deployed backend URL
- Ensure CORS is enabled on backend
- Test locally before deployment
- Use development mode for testing: `npm run dev`
