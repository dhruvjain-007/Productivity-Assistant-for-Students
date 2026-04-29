# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65abc123...",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Validation error
- `500`: Server error

---

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "65abc123...",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

**Status Codes:**
- `200`: Login successful
- `401`: Invalid credentials
- `400`: Missing email/password

---

### Get Current User
**GET** `/auth/me`

Get the logged-in user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "65abc123...",
    "email": "student@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "learningStyle": "visual",
    "weekdayStudyTime": 3,
    "weekendStudyTime": 4
  }
}
```

---

### Update User Profile
**PUT** `/auth/profile`

Update user preferences and settings.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "learningStyle": "visual",
  "weekdayStudyTime": 3.5,
  "weekendStudyTime": 5,
  "preferredSubjects": ["Mathematics", "Physics"]
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Task Endpoints

### Get All Tasks
**GET** `/tasks`

Retrieve all tasks with optional filtering.

**Query Parameters:**
```
?status=pending          // Filter by status: pending, in-progress, completed
?priority=high           // Filter by priority: high, medium, low
?subject=Mathematics     // Filter by subject
?sortBy=-createdAt       // Sort order (- for descending)
```

**Example Request:**
```
GET /tasks?status=pending&priority=high&sortBy=-deadline
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "tasks": [
    {
      "_id": "65abc456...",
      "title": "Study Chapter 3",
      "description": "Physics chapter 3",
      "priority": "high",
      "status": "pending",
      "estimatedTime": 60,
      "deadline": "2024-05-15T23:59:59Z",
      "subject": "Physics",
      "category": "studying",
      "createdAt": "2024-05-10T10:00:00Z"
    }
  ]
}
```

---

### Create Task
**POST** `/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Study Chapter 3",
  "description": "Physics chapter 3 - Thermodynamics",
  "priority": "high",
  "estimatedTime": 60,
  "deadline": "2024-05-15T23:59:59Z",
  "subject": "Physics",
  "category": "studying",
  "tags": ["exam-prep", "important"]
}
```

**Response:**
```json
{
  "success": true,
  "task": {
    "_id": "65abc456...",
    "userId": "65abc123...",
    "title": "Study Chapter 3",
    "status": "pending",
    "priority": "high",
    "estimatedTime": 60,
    "createdAt": "2024-05-10T10:00:00Z"
  }
}
```

**Status Codes:**
- `201`: Task created
- `400`: Validation error
- `401`: Unauthorized

---

### Get Single Task
**GET** `/tasks/:taskId`

Retrieve a specific task.

**Response:**
```json
{
  "success": true,
  "task": { ... }
}
```

**Status Codes:**
- `200`: Success
- `404`: Task not found
- `403`: Not authorized

---

### Update Task
**PUT** `/tasks/:taskId`

Update task details or status.

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "completed",
  "priority": "medium",
  "timeSpent": 45
}
```

**Response:**
```json
{
  "success": true,
  "task": { ... }
}
```

---

### Delete Task
**DELETE** `/tasks/:taskId`

Delete a task.

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### Generate AI Daily Plan
**POST** `/tasks/generate-plan`

Generate an AI-powered daily study plan.

**Request Body:**
```json
{
  "date": "2024-05-15T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "plan": {
    "tasks": [
      {
        "id": 1,
        "title": "Physics Practice Problems",
        "timeEstimate": 45,
        "priority": "high",
        "subject": "Physics",
        "description": "Complete section 3.1 to 3.5"
      }
    ]
  },
  "dailyPlan": {
    "_id": "65abc789...",
    "userId": "65abc123...",
    "date": "2024-05-15",
    "totalPlannedTime": 180,
    "aiGenerated": true
  }
}
```

**Status Codes:**
- `201`: Plan generated
- `500`: AI service error

---

### Get Task Recommendation
**GET** `/tasks/recommendation`

Get AI recommendation for the next task to work on.

**Query Parameters:**
```
?energyLevel=medium      // Current energy level
?timeUntilBreak=30min    // Time until next break
```

**Response:**
```json
{
  "success": true,
  "recommendation": {
    "taskId": "65abc456...",
    "reasoning": "This task has the earliest deadline and matches your current energy level",
    "estimatedDuration": 45,
    "tips": ["Take water break first", "Minimize distractions"]
  }
}
```

---

## Study Notes Endpoints

### Get All Notes
**GET** `/notes`

Retrieve all study notes.

**Query Parameters:**
```
?subject=Mathematics     // Filter by subject
?category=lecture        // Filter by category: lecture, textbook, etc.
?isFavorited=true        // Show only favorites
?sortBy=-createdAt       // Sort order
```

**Response:**
```json
{
  "success": true,
  "count": 8,
  "notes": [
    {
      "_id": "65abc123...",
      "title": "Chapter 3 Notes",
      "subject": "Physics",
      "category": "lecture",
      "content": "...",
      "isFavorited": false,
      "aiSummarized": false,
      "createdAt": "2024-05-10T10:00:00Z"
    }
  ]
}
```

---

### Create Note
**POST** `/notes`

Create a new study note.

**Request Body:**
```json
{
  "title": "Chapter 3 Notes",
  "content": "Full note content here...",
  "subject": "Physics",
  "category": "lecture",
  "tags": ["thermodynamics", "chapter-3"]
}
```

**Response:**
```json
{
  "success": true,
  "note": {
    "_id": "65abc123...",
    "title": "Chapter 3 Notes",
    "subject": "Physics",
    "createdAt": "2024-05-10T10:00:00Z"
  }
}
```

---

### Get Single Note
**GET** `/notes/:noteId`

Retrieve a specific note.

**Response:**
```json
{
  "success": true,
  "note": { ... }
}
```

---

### Update Note
**PUT** `/notes/:noteId`

Update note content.

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

---

### Delete Note
**DELETE** `/notes/:noteId`

Delete a note.

**Response:**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

### Summarize Note with AI
**POST** `/notes/:noteId/summarize`

Generate AI summary of study notes.

**Request Body:**
```json
{
  "detailLevel": "balanced"  // Options: concise, balanced, detailed
}
```

**Response:**
```json
{
  "success": true,
  "note": {
    "_id": "65abc123...",
    "summary": {
      "summary": "This chapter covers...",
      "keyPoints": ["Point 1", "Point 2"],
      "importantTerms": [
        {
          "term": "Thermodynamics",
          "definition": "Study of heat and energy..."
        }
      ],
      "revisionBullets": ["Remember...", "Focus on..."],
      "studyTips": ["Try practicing problems", "Create mind map"]
    }
  }
}
```

---

### Toggle Favorite Note
**PUT** `/notes/:noteId/favorite`

Mark note as favorite or remove from favorites.

**Response:**
```json
{
  "success": true,
  "note": {
    "_id": "65abc123...",
    "isFavorited": true
  }
}
```

---

## Focus Session Endpoints

### Start Focus Session
**POST** `/focus-sessions`

Begin a new focus/Pomodoro session.

**Request Body:**
```json
{
  "taskId": "65abc456...",           // Optional
  "plannedDuration": 25              // Duration in minutes
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "_id": "65abc789...",
    "userId": "65abc123...",
    "taskId": "65abc456...",
    "startTime": "2024-05-10T14:00:00Z",
    "plannedDuration": 25
  }
}
```

---

### End Focus Session
**PUT** `/focus-sessions/:sessionId/end`

Complete a focus session with metrics.

**Request Body:**
```json
{
  "focusScore": 85,                  // 0-100
  "distractionsCount": 2,
  "distractionTypes": ["phone", "other-tab"],
  "notes": "Session went well"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "_id": "65abc789...",
    "actualDuration": 25,
    "focusScore": 85,
    "distractionsCount": 2,
    "isCompleted": true
  }
}
```

---

### Get Focus Sessions
**GET** `/focus-sessions`

Retrieve completed focus sessions.

**Query Parameters:**
```
?taskId=65abc456...      // Filter by task
?startDate=2024-05-01    // Start date
?endDate=2024-05-31      // End date
?sortBy=-startTime       // Sort order
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "sessions": [ ... ]
}
```

---

### Get Focus Analytics
**GET** `/focus-sessions/analytics/summary`

Get focus session statistics.

**Query Parameters:**
```
?days=7                  // Number of days to analyze
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "period": "Last 7 days",
    "totalSessions": 15,
    "totalFocusTimeHours": 6.25,
    "averageFocusScore": 82.5,
    "totalDistractions": 8,
    "averageSessionDuration": "25.00",
    "dailyBreakdown": {
      "2024-05-10": {
        "sessions": 3,
        "focusTime": 75,
        "focusScore": 85
      }
    }
  }
}
```

---

## Analytics Endpoints

### Get Dashboard
**GET** `/analytics/dashboard`

Get dashboard metrics and summaries.

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "today": {
      "completedTasks": 5,
      "focusSessionsCount": 2,
      "focusTimeMinutes": 90,
      "focusTimeHours": "1.50"
    },
    "week": {
      "completedTasks": 28,
      "focusSessionsCount": 14,
      "focusTimeMinutes": 420,
      "focusTimeHours": "7.00"
    },
    "stats": {
      "currentStreakDays": 5,
      "pendingTasks": 12,
      "averageFocusScore": 82.5
    }
  }
}
```

---

### Get Detailed Report
**GET** `/analytics/report`

Get comprehensive analytics report.

**Query Parameters:**
```
?days=30                 // Report period
```

**Response:**
```json
{
  "success": true,
  "report": {
    "period": "Last 30 days",
    "totalTasksCompleted": 120,
    "totalFocusSessions": 90,
    "totalFocusTimeMinutes": 2250,
    "subjectBreakdown": {
      "Mathematics": {
        "tasksCompleted": 40,
        "totalTimeSpent": 600,
        "averageFocusScore": 85,
        "focusSessions": 30
      }
    },
    "dailyBreakdown": { ... },
    "bestStudyDay": "2024-05-15"
  }
}
```

---

### Get Productivity Insights
**GET** `/analytics/insights`

Get personalized productivity recommendations.

**Query Parameters:**
```
?days=30                 // Analysis period
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "bestStudyTime": "14:00",
    "bestStudyDay": "Monday",
    "recommendedSessionDuration": 25,
    "recommendations": [
      "Your best focus time is around 14:00. Try scheduling important tasks then.",
      "You're most productive on Mondays. Plan challenging work for that day.",
      "Keep distractions minimal - they reduce your focus score significantly."
    ]
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers in Response**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Use appropriate HTTP methods**: GET (read), POST (create), PUT (update), DELETE (delete)
3. **Include proper error handling** in your frontend
4. **Validate input data** before sending to API
5. **Store token securely** in localStorage
6. **Use query parameters** for filtering and pagination
7. **Check response status codes** to handle errors

---

For more details, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
