# Student Productivity Assistant

A production-ready AI-powered web application that helps students manage study time, tasks, and focus effectively.

## Features

### Smart Daily Planner
- AI-generated personalized daily plans based on goals and available time
- Tasks automatically prioritized by importance and deadline
- Dynamic plan adjustment based on completed/missed tasks
- Different schedules for weekdays and weekends

### Task & Priority System
- Create, edit, delete tasks
- AI-assigned priority levels (High, Medium, Low)
- Smart recommendations on what to work on next
- Deadline and time estimate tracking

### Smart Learning Recommendations
- Task suggestions based on goals and past performance
- Adaptive recommendations that evolve with user progress
- Performance-based learning insights

### AI Notes Summarizer
- Input study material and get AI-generated summaries
- Key points extraction
- Revision bullets and explanations
- Customizable detail levels

### Focus Mode (Pomodoro)
- Customizable timer (user-defined durations)
- Distraction tracking
- Focus quality scoring
- Session analytics

### Analytics Dashboard
- Study time tracking
- Task completion metrics
- Consistency streaks
- Weekly and monthly trends
- Best study time identification
- Productivity pattern insights

### Personalization
- Learns user behavior over time
- Adjusts recommendations based on consistency and performance
- Short-term and long-term goal setting
- Dark mode support

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Analytics charts
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide Icons** - Icons

### Backend
- **Node.js + Express** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **OpenAI API** - AI integration
- **Helmet** - Security
- **CORS** - Cross-origin requests
- **Rate Limiting** - API protection

## Project Structure

```
Productivity-Assistant-for-Students/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # MongoDB connection
│   │   │   └── ai.js            # OpenAI integration
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   ├── DailyPlan.js
│   │   │   ├── FocusSession.js
│   │   │   ├── StudyNote.js
│   │   │   └── Analytics.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   ├── noteController.js
│   │   │   ├── focusController.js
│   │   │   └── analyticsController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── noteRoutes.js
│   │   │   ├── focusRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication
│   │   ├── utils/
│   │   └── server.js            # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── Planner.jsx
│   │   │   ├── FocusMode.jsx
│   │   │   └── Notes.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── TaskContext.jsx
│   │   ├── hooks/
│   │   │   └── useContexts.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
└── docs/
    ├── API_ENDPOINTS.md
    ├── DATABASE_SCHEMA.md
    ├── DEPLOYMENT.md
    └── USER_GUIDE.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:taskId` - Get single task
- `PUT /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task
- `POST /api/tasks/generate-plan` - Generate AI daily plan
- `GET /api/tasks/recommendation` - Get task recommendation

### Study Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create new note
- `GET /api/notes/:noteId` - Get single note
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note
- `POST /api/notes/:noteId/summarize` - Summarize with AI
- `PUT /api/notes/:noteId/favorite` - Toggle favorite

### Focus Sessions
- `POST /api/focus-sessions` - Start focus session
- `PUT /api/focus-sessions/:sessionId/end` - End session
- `GET /api/focus-sessions` - Get sessions
- `GET /api/focus-sessions/analytics/summary` - Get analytics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/report` - Get detailed report
- `GET /api/analytics/insights` - Get productivity insights

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  studyGoals: [String],
  weekdayStudyTime: Number,
  weekendStudyTime: Number,
  learningStyle: String,
  preferredSubjects: [String],
  focusDuration: Number,
  breakDuration: Number,
  streakDays: Number,
  totalStudyHours: Number,
  completionMetrics: {
    tasksCompleted: Number,
    tasksCompletedThisWeek: Number,
    completionRate: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  subject: String,
  priority: String (high/medium/low),
  estimatedTime: Number,
  deadline: Date,
  status: String (pending/in-progress/completed/cancelled),
  completedAt: Date,
  timeSpent: Number,
  focusSessions: Number,
  category: String,
  aiGenerated: Boolean,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### DailyPlan
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  dayOfWeek: String,
  plannedTasks: [{
    taskId: ObjectId,
    sequenceOrder: Number,
    plannedDuration: Number,
    isCompleted: Boolean
  }],
  totalPlannedTime: Number,
  totalActualTime: Number,
  completionRate: Number,
  focusSessionsCompleted: Number,
  mood: String,
  aiGenerated: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### FocusSession
```javascript
{
  userId: ObjectId (ref: User),
  taskId: ObjectId (ref: Task),
  startTime: Date,
  endTime: Date,
  plannedDuration: Number,
  actualDuration: Number,
  focusScore: Number (0-100),
  distractionsCount: Number,
  distractionTypes: [String],
  notes: String,
  isCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### StudyNote
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  content: String,
  subject: String,
  category: String,
  summary: {
    summary: String,
    keyPoints: [String],
    importantTerms: [{term, definition}],
    revisionBullets: [String],
    studyTips: [String]
  },
  tags: [String],
  isFavorited: Boolean,
  aiSummarized: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/productivity-assistant
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=sk-your-openai-key
FRONTEND_URL=http://localhost:3000
```

5. Start backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start frontend:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Running the Application

### Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

### Production Build

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
```

## Key Features Implementation

### 1. AI Daily Plan Generation
The system uses OpenAI to generate personalized plans based on:
- User's study goals
- Available study time (weekday/weekend)
- Learning style preference
- Subject areas
- Recent performance data

### 2. Smart Task Recommendations
AI evaluates:
- Current energy level
- Time until next break
- Task deadlines and priorities
- User's completion history
- Task complexity

### 3. Focus Session Tracking
Features include:
- Customizable Pomodoro durations
- Distraction counting and categorization
- Focus quality scoring
- Session statistics

### 4. Analytics & Insights
Provides:
- Daily/weekly/monthly metrics
- Subject-wise performance breakdown
- Best study times identification
- Productivity trends
- Personalized recommendations

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **CORS Protection**: Restricted cross-origin requests
- **Rate Limiting**: API abuse prevention
- **Helmet**: HTTP security headers
- **Input Validation**: Express validator
- **Authorization**: User-specific data access control

## Performance Optimizations

- Database indexing on frequently queried fields
- Efficient query filtering and pagination
- API response caching strategy
- Lazy loading of components
- Optimized bundle size with tree-shaking
- Responsive image handling

## Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Social features (study groups, leaderboards)
- [ ] Integration with calendar apps
- [ ] Offline mode
- [ ] Advanced ML-based recommendations
- [ ] Voice-based planning
- [ ] Study buddy matching
- [ ] Academic calendar integration
- [ ] Exam countdownfeature

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify firewall settings for Atlas

### OpenAI API Errors
- Verify API key is valid
- Check API account balance
- Ensure correct model name in `.env`

### CORS Errors
- Frontend URL must match `FRONTEND_URL` in backend `.env`
- Check that backend is running

### Port Already in Use
- Change port in `.env` or use different terminal

## Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check documentation in `/docs`
- Review API documentation

## Roadmap

- Q2 2026: Mobile app launch
- Q3 2026: Advanced AI features
- Q4 2026: Social learning features
- 2027: Enterprise version

---

**Built with ❤️ for students who want to be more productive**
