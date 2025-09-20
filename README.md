🌐 SkillShare Platform

A Django + React full-stack platform for skill sharing, events, and networking.
Users can register, showcase skills, find others by skills, host/join events, chat, and receive notifications.

🚀 Features

User Authentication (JWT-based login/register)

Skill Management (add skills with proficiency, update, view)

Skill Match Filter (find users by skills)

Connect Requests (send/accept/reject connections)

Event Management (host, join, manage events)

Dashboard (total users, events, top skills, most active users)

Chat System (real-time chat between connected users)

Event Reminders & Notifications (users get notified for upcoming events)

🛠 Tech Stack

Frontend: React + TailwindCSS
Backend: Django REST Framework + Django Channels (WebSockets)
Database: PostgreSQL
Real-time: Redis + WebSockets
Auth: JWT

📊 Dashboard Overview

Total users

Total events

Top skills (most common)

Most active users (based on skills & events)

🔮 Future Improvements

Improve Recommendation Engine (suggest users/events based on skills & proficiency)

Advanced Analytics Dashboard (growth trends, engagement charts)

File Sharing in Chat (send docs, images within chat)

Skill Endorsements (users endorse each other’s skills)

Global Learning Resources (integrate APIs like YouTube, Coursera, etc. for skill-based learning)

Payment Integration (premium features, resource access, or event tickets)

⚙️ Installation
Backend (Django + DRF)
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend (React + Vite + Tailwind)
cd frontend
npm install
npm run dev

📌 Usage

Register & log in

Add skills with proficiency

Search users with skill match filter

Send/accept/reject connection requests

Host or join events

Chat with connected users

View dashboard for insights

Get reminders & notifications

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
