<p align="right">
🇧🇬 <a href="README.bg.md">Прочети на български</a>
</p>

# 🧩 Task & Team Collaboration Platform

A Trello/Asana-like platform for managing tasks, teams, and projects, with a focus on real-time collaboration, role-based access control, and a modern full-stack architecture. The project demonstrates proficiency in frontend frameworks, Django backend, WebSocket integration, and Docker-based DevOps.

---

## ⚙️ Technologies Used

| Layer            | Technologies                                          |
|------------------|-------------------------------------------------------|
| **Frontend**     | Angular, WebSocket client, JWT, Drag & Drop UI        |
| **Backend**      | Django, Django REST Framework                         |
| **WebSocket**    | Node.js, Express, `ws` (native WebSocket server)      |
| **Database**     | PostgreSQL                                            |
| **Auth**         | JWT (SimpleJWT)                                       |
| **DevOps**       | Docker, Docker Compose                                |

---

## 🧱 Project Architecture

### 🔐 Authentication
- JWT-based authentication (SimpleJWT)
- Middleware and route guards by role
- Registration, login, and token refresh

### 📁 Backend (Django + DRF)
- Manage projects, tasks, comments, and user roles
- REST API that notifies the WebSocket server on key events
- RBAC – Role-based access per project: `admin`, `member`

### 📡 WebSocket Server (Node.js)
- Separate `ws` server that groups clients by `projectId`
- Accepts POST requests from Django and broadcasts events to clients
- Supports events like `task_created`, `task_updated`, `comment_added`

### 💬 Real-Time Updates
- Angular listens to the WebSocket server at `ws://localhost:8001/?project=ID`
- UI is updated live when new tasks or comments are added

---

## 🔄 Core Functionality (MVP)

- ✅ Registration and login
- ✅ Create and edit projects
- ✅ Kanban board with drag & drop tasks
- ✅ Task comments
- ✅ Project roles (admin, member, viewer)
- ✅ Real-time WebSocket notifications (tasks, comments)
- ✅ Invite users to projects
- ✅ Display project members

---

## 📂 Project Structure

```
Colaboration-Platform/
├── backend/          # Django + DRF API
├── frontend/         # Angular app (ng serve)
├── ws-server/        # Node.js WebSocket server
├── docker-compose.yml
```

---

## 🐳 Docker Setup

The project is fully dockerized. Use `docker-compose` to start:

### ▶️ Start

```bash
docker-compose up --build
```

### 🧪 Available Services:

| Component     | Address               |
|---------------|------------------------|
| Frontend      | http://localhost:4200  |
| Backend API   | http://localhost:8000  |
| WebSocket     | ws://localhost:8001    |
| PostgreSQL    | port 5432 (internal)   |

---

## 🧪 User Journey

1. The user logs in and receives a JWT token
2. They see a list of projects they are a member of
3. They create a new project or enter an existing one
4. The Kanban board displays tasks by status
5. They can:
   - Move tasks via drag & drop
   - Edit/delete/comment on tasks
   - See other users' actions in real time
6. WebSocket notifications inform all users in the project of updates
7. Users can invite others to projects

---

## 📎 Dev Notes

- Django settings use `.env` environment variables

---

## 🧪 Possible Enhancements

- PDF reports for tasks
- File uploads (attachments)
- Dashboard with charts
- Tagging and filters
- Activity logs
- PWA (Progressive Web App)
- Slack/Discord integration
- Email notifications for key events (e.g., user added to project)

---

## 🎯 Target Audience

- **Employers:** Full-stack showcase (Django + Angular + WebSocket)
- **Freelance Clients:** Ready-to-use team management system
- **Learning/Demo Purposes:** Demonstrates real-time updates, RBAC, Docker

---

## 🧩 Contact

The project is open to improvement and contributions.
