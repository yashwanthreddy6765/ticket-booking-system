# Complete Clone & Deploy Guide

## PART 1: CLONE THE PROJECT LOCALLY

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` and press Enter

**Mac/Linux:**
- Open Terminal application

### Step 2: Navigate to Your Desired Directory

```bash
# Choose where to save the project
cd Desktop
# OR
cd Documents
# OR create a projects folder
mkdir projects
cd projects
```

### Step 3: Clone the Repository

```bash
git clone https://github.com/yashwanthreddy6765/ticket-booking-system.git
cd ticket-booking-system
```

**Output should show:**
```
Cloning into 'ticket-booking-system'...
remote: Enumerating objects...
remote: Counting objects: 100%
remote: Compressing objects: 100%
remote: Receiving objects: 100%
receiving: 100%, done.
```

---

## PART 2: BACKEND SETUP & LOCAL TESTING

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

**Expected packages:**
- express
- pg (PostgreSQL)
- cors
- dotenv
- uuid
- swagger-ui-express
- axios

### Step 2: Setup PostgreSQL Database

**Option A: Install PostgreSQL (if not already installed)**
- Download: https://www.postgresql.org/download/
- Install and remember your password

**Option B: Use PostgreSQL Online**
- Sign up at https://neon.tech (Free PostgreSQL hosting)
- Create a new project
- Get your connection string

### Step 3: Create Database

**If using local PostgreSQL:**
```sql
CREATE DATABASE ticket_booking;
```

**Using psql:**
```bash
psql -U postgres
CREATE DATABASE ticket_booking;
\q  # to exit
```

### Step 4: Configure Environment Variables

Create `.env` file in `backend/` directory:

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ticket_booking
NODE_ENV=development
API_URL=http://localhost:5000
```

**For Neon.tech PostgreSQL:**
```
PORT=5000
DB_HOST=ep-xxx.neon.tech
DB_USER=neon_user
DB_PASSWORD=your_neon_password
DB_NAME=ticket_booking
DB_PORT=5432
NODE_ENV=development
API_URL=http://localhost:5000
```

### Step 5: Test Backend Locally

```bash
cd backend
npm run dev
```

**Expected output:**
```
✓ Server running on port 5000
✓ API Docs: http://localhost:5000/api-docs
✓ Database connected
✓ Tables initialized
```

### Step 6: Test API Endpoints

Open new terminal window:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Get all shows (should return empty array initially)
curl http://localhost:5000/api/shows
```

---

## PART 3: FRONTEND SETUP & LOCAL TESTING

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 2: Configure Frontend Environment

Create `.env` file in `frontend/` directory:

```
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Create React Components

**Copy all component templates from FRONTEND_SETUP_GUIDE.md**

Create these files:
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── ShowsList.jsx
│   │   ├── SeatSelection.jsx
│   │   ├── BookingForm.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── BookingHistory.jsx
│   ├── pages/
│   │   ├── AdminPage.jsx
│   │   ├── UserPage.jsx
│   │   └── BookingPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── api.js (already created)
│   ├── App.jsx (already created)
│   ├── App.css (already created)
│   ├── main.jsx (already created)
│   └── index.html (already created)
```

### Step 4: Run Frontend Locally

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 5: Test Frontend

Open browser: `http://localhost:5173`

---

## PART 4: BACKEND DEPLOYMENT (RENDER.COM)

### Step 1: Create Account

1. Go to https://render.com
2. Sign up with GitHub account
3. Authorize GitHub access

### Step 2: Deploy Backend

1. Click **New +** → **Web Service**
2. Connect to your GitHub repository:
   - Search: `ticket-booking-system`
   - Select repository
   - Click **Connect**

3. Configure deployment:
   - **Name:** `ticket-booking-api`
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

4. Add Environment Variables:
   Click **Add Environment Variable**
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=your_neon_host
   DB_PORT=5432
   DB_NAME=ticket_booking
   NODE_ENV=production
   API_URL=https://your-render-url.onrender.com
   ```

5. Click **Create Web Service**

### Step 3: Wait for Deployment

- Check deployment logs
- Wait for "Service is live" message
- Note your API URL: `https://ticket-booking-api.onrender.com`

### Step 4: Test Deployed Backend

```bash
curl https://ticket-booking-api.onrender.com/api/health
```

---

## PART 5: FRONTEND DEPLOYMENT (VERCEL)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize GitHub

### Step 2: Deploy Frontend

1. Click **New Project**
2. Import Git Repository:
   - Search: `ticket-booking-system`
   - Select your repository

3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add Environment Variables:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://ticket-booking-api.onrender.com/api`
   - Click **Add**

5. Click **Deploy**

### Step 3: Wait for Deployment

- Check deployment logs
- Get your Vercel URL: `https://your-project.vercel.app`

### Step 4: Test Deployed Frontend

Open in browser: `https://your-project.vercel.app`

---

## PART 6: COMPLETE TESTING CHECKLIST

### Local Testing (Before Deployment)
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Test API
curl http://localhost:5000/api/shows

# Open browser to http://localhost:5173
```

### Production Testing

```bash
# Test deployed API
curl https://ticket-booking-api.onrender.com/api/health

# Test deployed frontend
Open: https://your-project.vercel.app

# Test full flow:
# 1. Load shows
# 2. Click on show
# 3. Select slot
# 4. Choose seats
# 5. Confirm booking
```

---

## PART 7: TROUBLESHOOTING

### Backend Issues

**Error: "Cannot find module 'express'"**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Database connection failed"**
- Check `.env` file credentials
- Ensure PostgreSQL is running
- Test connection: `psql -U postgres`

**Error: "CORS error in frontend"**
- Update API_URL in frontend `.env`
- Backend should have CORS enabled

### Frontend Issues

**Error: "Module not found: axios"**
```bash
cd frontend
npm install
```

**Error: "Cannot find api.js"**
- Create missing service files (see FRONTEND_SETUP_GUIDE.md)
- Ensure imports are correct

**Port 5173 already in use:**
```bash
# Kill process
lsof -i :5173
kill -9 <PID>
```

---

## PART 8: FINAL DEPLOYMENT CHECKLIST

✅ Backend repository pushed to GitHub
✅ Backend deployed on Render.com
✅ Frontend repository pushed to GitHub
✅ Frontend deployed on Vercel
✅ Environment variables configured
✅ Database connected and working
✅ All APIs tested and working
✅ Frontend-backend communication verified
✅ Forms submit and display data correctly
✅ No console errors or warnings

---

## YOUR DEPLOYMENT URLS

Once deployed, update these:

**Backend API:**
```
https://your-backend-name.onrender.com
```

**Frontend:**
```
https://your-frontend-name.vercel.app
```

**GitHub Repository:**
```
https://github.com/yashwanthreddy6765/ticket-booking-system
```

---

## QUICK REFERENCE

### Install Node.js (Required)
- Download: https://nodejs.org/ (LTS version)
- Install and verify: `node --version`

### Install Git (Required)
- Download: https://git-scm.com/
- Verify: `git --version`

### Install PostgreSQL (Optional - use Neon.tech instead)
- Download: https://www.postgresql.org/download/

### Recommended Free Services
- **Database:** https://neon.tech (PostgreSQL)
- **Backend:** https://render.com (Node.js)
- **Frontend:** https://vercel.com (React/Vite)

---

## TIME ESTIMATES

- Clone: 2 minutes
- Local Backend Setup: 10 minutes
- Database Setup: 5 minutes
- Local Frontend Setup: 10 minutes
- Frontend Components Creation: 60 minutes
- Backend Deployment: 10 minutes
- Frontend Deployment: 5 minutes
- Testing: 15 minutes

**Total: ~2 hours for complete setup and deployment**
