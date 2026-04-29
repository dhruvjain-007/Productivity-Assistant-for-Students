# Quick Start Guide

Get your Student Productivity Assistant running in 10 minutes!

## Prerequisites

- Node.js 16+ and npm
- MongoDB (local or free tier at MongoDB Atlas)
- OpenAI API key (https://platform.openai.com/api-keys)
- Git

## Step 1: Clone & Setup (2 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/Productivity-Assistant.git
cd Productivity-Assistant

# Setup backend
cd backend
cp .env.example .env

# Setup frontend
cd ../frontend
cp .env.example .env
```

## Step 2: Configure Environment Variables (2 minutes)

### Backend `.env`
```
MONGODB_URI=mongodb://localhost:27017/productivity-assistant
JWT_SECRET=your_random_secret_key_here_min_32_chars
OPENAI_API_KEY=sk-your-openai-key-here
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Step 3: Install Dependencies (2 minutes)

```bash
# Install backend dependencies
cd backend
npm install

# In another terminal, install frontend dependencies
cd frontend
npm install
```

## Step 4: Start the Application (1 minute)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Expected output:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Browser will open automatically to `http://localhost:3000`

## Step 5: Create Your Account (1 minute)

1. Click "Sign up" on the login page
2. Enter your details:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: securePassword123

3. Click "Create Account"

## Step 6: Try Key Features (2 minutes)

### 1. Generate Daily Plan
- Go to "Planner" page
- Click "Generate Plan" button
- AI creates personalized study plan

### 2. Create Tasks
- Go to "Tasks" page
- Click "New Task"
- Add a task and set priority
- Click "Create Task"

### 3. Start Focus Session
- Go to "Focus Mode"
- Set duration (default 25 min)
- Click "Start Session"
- When done, "End Session" and rate focus

### 4. Create Study Notes
- Go to "Notes"
- Click "New Note"
- Paste your study material
- Click "Create Note"
- Use "Summarize" to get AI summary

### 5. View Analytics
- Go to "Dashboard"
- See your stats and insights
- Check productivity recommendations

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Start MongoDB: mongod (Windows/Mac)
2. Or use MongoDB Atlas connection string
3. Update MONGODB_URI in .env
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS

Solution:
1. Check backend is running on port 5000
2. Verify FRONTEND_URL in backend .env matches exactly
3. Restart backend server
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000

Solution:
1. Change PORT in backend .env
2. Or kill process: lsof -ti:5000 | xargs kill
3. Restart backend
```

### OpenAI API Error
```
Error: 401 Unauthorized

Solution:
1. Verify API key is valid
2. Check OpenAI account has credits
3. Ensure key starts with 'sk-'
4. Restart backend after updating key
```

## Project Structure Quick Reference

```
backend/
  ├── src/
  │   ├── models/       ← Database schemas
  │   ├── controllers/  ← Business logic
  │   ├── routes/       ← API endpoints
  │   └── server.js     ← Main server
  └── package.json

frontend/
  ├── src/
  │   ├── pages/        ← Different screens
  │   ├── components/   ← Reusable parts
  │   ├── services/     ← API calls
  │   └── App.jsx       ← Main app
  └── package.json
```

## API Quick Reference

All API calls need `Authorization` header:
```
Authorization: Bearer {token}
```

### Key Endpoints

```
# Authentication
POST   /api/auth/register        → Create account
POST   /api/auth/login           → Login
GET    /api/auth/me              → Get profile

# Tasks
GET    /api/tasks                → List tasks
POST   /api/tasks                → Create task
POST   /api/tasks/generate-plan  → AI plan

# Focus
POST   /api/focus-sessions       → Start session
PUT    /api/focus-sessions/:id/end → End session

# Analytics
GET    /api/analytics/dashboard  → Dashboard
GET    /api/analytics/insights   → Insights

# Notes
POST   /api/notes                → Create note
POST   /api/notes/:id/summarize  → AI summary
```

## Development Tips

### Hot Reload
- Frontend: Automatically reloads on changes
- Backend: Use `npm run dev` (uses nodemon)

### Debug Mode
- Browser: F12 → Network tab to see API calls
- Backend: Check terminal console logs

### Database Inspection
- Use MongoDB Compass (free GUI tool)
- Or MongoDB Atlas web interface

## Next Steps

1. **Explore the code** - Understand project structure
2. **Modify styles** - Update Tailwind classes
3. **Add features** - Follow IMPLEMENTATION_GUIDE
4. **Deploy** - Follow DEPLOYMENT.md for live deployment
5. **Scale up** - Add more features and users

## Additional Resources

- [Full README](../README.md)
- [API Documentation](./API_ENDPOINTS.md)
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Mongoose Docs](https://mongoosejs.com/docs)
- [React Docs](https://react.dev)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+S` | Save file (your editor) |
| `F12` | Open browser DevTools |
| `Ctrl+J` | Terminal in VS Code |
| `Ctrl+K Ctrl+C` | Comment code |

## Getting Help

1. Check [API_ENDPOINTS.md](./API_ENDPOINTS.md) for endpoint details
2. Review error messages carefully
3. Check browser console (F12)
4. Check backend terminal logs
5. Create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment info

## Great! You're all set! 🎉

Your Student Productivity Assistant is now running!

**Next:** Explore features and customize to your needs. See [README.md](../README.md) for more info.

---

**Having trouble?** Check the troubleshooting section above or create an issue on GitHub.
