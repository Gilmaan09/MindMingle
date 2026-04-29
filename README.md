# 🧘 Mindmingle - Mental Wellness MERN App

A full-stack wellness application built with **MongoDB, Express, React, Node.js**.  
All 7 user stories implemented with beautiful, production-quality UI.

---

## 📁 Project Structure

```
mindmingle/
├── backend/
│   ├── models/
│   │   ├── User.js          # User model with auth + reminders
│   │   ├── Mood.js          # Mood tracking model
│   │   ├── Exercise.js      # Mindfulness exercises model
│   │   └── Post.js          # Community posts model
│   ├── routes/
│   │   ├── auth.js          # Register, login, Google/Facebook OAuth
│   │   ├── mood.js          # Mood CRUD + stats
│   │   ├── exercises.js     # Exercise library
│   │   ├── community.js     # Anonymous peer support posts
│   │   └── reminders.js     # Wellness reminders
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── .env.example         # Copy to .env
│   └── server.js            # Express app entry
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js    # Global auth state
        ├── components/
        │   └── Layout.js         # Sidebar + nav
        ├── pages/
        │   ├── Login.js          # US-2: Email + social login
        │   ├── Register.js       # US-1: Sign up
        │   ├── Dashboard.js      # Overview + quick mood check-in
        │   ├── Exercises.js      # US-3: Mindfulness exercises
        │   ├── MoodTracker.js    # US-4: Mood tracking + chart
        │   ├── Community.js      # US-5: Anonymous peer support
        │   ├── Reminders.js      # US-6: Reminders
        │   └── Profile.js        # Goals + privacy settings
        ├── App.js                # Router + protected routes
        └── index.css             # Design system
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mindmingle
JWT_SECRET=your_very_secret_key_change_this_in_production
NODE_ENV=development
```

### 3. Run the App

```bash
# From root - runs both simultaneously
npm run dev

# OR separately:
# Terminal 1 - Backend:
cd backend && npm run dev

# Terminal 2 - Frontend:
cd frontend && npm start
```

App runs at: **http://localhost:3000**  
API runs at: **http://localhost:5000**

### 4. Seed Exercises

After logging in, go to **Exercises** page and click **"Load Exercises"**,  
or hit the API directly:
```bash
curl -X POST http://localhost:5000/api/exercises/seed
```

---

## ✅ User Stories Coverage

| # | Story | Status | Page |
|---|-------|--------|------|
| 1 | User Sign Up (email + social) | ✅ | `/register` |
| 2 | User Login (email + social) | ✅ | `/login` |
| 3 | Mindfulness Exercises | ✅ | `/exercises` |
| 4 | Mood Tracking + History | ✅ | `/mood` |
| 5 | Anonymous Peer Support | ✅ | `/community` |
| 6 | Customizable Reminders | ✅ | `/reminders` |
| 7 | Mobile-Responsive Design | ✅ | All pages |

---

## 🎨 Design Features

- **Sage green & warm cream** color palette
- **Playfair Display** + **DM Sans** typography pairing
- Smooth animations and hover transitions
- Responsive layout (sidebar collapses on mobile)
- Mood trend chart with Chart.js
- Anonymous community with safety features

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Mood
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/mood` | Log mood |
| GET | `/api/mood` | Get history + stats |
| GET | `/api/mood/today` | Today's mood |
| DELETE | `/api/mood/:id` | Delete entry |

### Exercises
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exercises` | Get all exercises |
| GET | `/api/exercises/:id` | Get single exercise |
| POST | `/api/exercises/seed` | Seed library |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/community` | Get posts |
| POST | `/api/community` | Create post |
| PUT | `/api/community/:id/like` | Like/unlike |
| POST | `/api/community/:id/comment` | Comment |

### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reminders` | Get reminders |
| POST | `/api/reminders` | Create reminder |
| PUT | `/api/reminders/:id` | Update reminder |
| DELETE | `/api/reminders/:id` | Delete reminder |

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (12 rounds)
- JWT tokens (30-day expiry)
- Protected routes (middleware)
- Anonymous posting with auto-generated names
- Community content moderation (report system)
- Input validation on all models

---

## 📱 Mobile Ready

The app is fully responsive:
- Sidebar collapses to hamburger menu on mobile
- Touch-friendly mood selector
- Adaptive grid layouts
- Scrollable tag selectors

---

## 🌱 Environment Variables (Production)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mindmingle
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
```

---

*Built with ❤️ for mental wellness*
