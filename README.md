# Student Productivity Assistant

A full-stack AI-powered web application that helps students manage tasks, plan study schedules, improve focus, summarize notes, and track productivity through intelligent recommendations and analytics.

## Features

### Smart Daily Planner

* AI-generated personalized study plans
* Automatic task prioritization
* Dynamic schedule adjustments
* Separate weekday and weekend planning

### Task Management

* Create, edit, and delete tasks
* Priority-based organization
* Deadline tracking
* Progress monitoring
* Smart task recommendations

### AI Notes Summarizer

* Generate concise summaries from study material
* Extract key points and important concepts
* Create revision notes automatically
* Improve study efficiency

### Focus Mode

* Customizable Pomodoro timer
* Focus session tracking
* Distraction monitoring
* Productivity scoring

### Analytics Dashboard

* Study time tracking
* Task completion statistics
* Consistency streaks
* Weekly and monthly reports
* Productivity insights

### Personalized Learning

* Goal-based recommendations
* Adaptive study suggestions
* Learning pattern analysis
* Performance-driven insights

---

## Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Axios
* Recharts
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* OpenAI API

### Security

* JWT Authentication
* Password Hashing (bcrypt)
* CORS Protection
* Helmet Security
* API Rate Limiting

---

## Project Structure

```text
Productivity-Assistant-for-Students/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── docs/
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/Productivity-Assistant-for-Students.git
cd Productivity-Assistant-for-Students
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:3000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Key Functionalities

### AI Study Planner

Generates personalized study schedules based on:

* Study goals
* Available study time
* Learning preferences
* Task priorities
* Recent performance

### Smart Recommendations

Provides intelligent suggestions by analyzing:

* Deadlines
* Task importance
* Study history
* Productivity patterns

### Focus Tracking

Records:

* Session duration
* Distractions
* Focus scores
* Productivity trends

### Productivity Analytics

Offers:

* Daily and weekly reports
* Subject-wise performance tracking
* Study consistency metrics
* Personalized improvement suggestions

---

## Future Enhancements

* Mobile Application
* Real-Time Notifications
* Calendar Integration
* Offline Support
* Voice-Based Planning
* Study Groups
* AI Chat Assistant
* Academic Calendar Integration

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Author

Developed as a productivity and learning assistant to help students study more effectively through AI-powered planning, focus management, and performance analytics.
