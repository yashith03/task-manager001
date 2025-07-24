# 📝 Task Manager App

A full-stack Task Management application with features like CRUD operations, filters, dark mode, test coverage, and Dockerized deployment.

---

## 📦 Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Frontend  | React + Vite + Tailwind CSS            |
| Backend   | Node.js + Express + Prisma ORM         |
| Database  | PostgreSQL                             |
| Container | Docker + Docker Compose                |
| Testing   | Jest, React Testing Library, Supertest |

---

## 🚀 Features

- ✅ Add, edit, delete, mark tasks as done
- 🔍 Filter tasks by priority, tags, and due date
- 🌒 Toggle between Dark/Light mode
- 🧪 Full test coverage (unit + integration)
- 🐳 Fully containerized (Docker + Docker Compose)

---

## 🗂️ Project Structure

```
task-manager/
├── backend/
│   ├── controllers/         # Task logic
│   ├── prisma/              # Prisma DB schema
│   ├── routes/              # API routes
│   ├── tests/               # Backend test cases
│   ├── server.js            # Main backend entry
│   ├── Dockerfile           # Backend Docker setup
│   └── .env                 # Backend environment config
├── frontend/
│   ├── src/                 # React components
│   ├── public/              # Static files
│   ├── tailwind.config.js   # Tailwind config
│   ├── vite.config.js       # Vite config
│   ├── nginx.conf           # Nginx config for frontend
│   ├── Dockerfile           # Frontend Docker setup
│   └── .env                 # Vite environment config
├── docker-compose.yml       # Multi-container orchestration
└── README.md                # Project documentation
```

---

## ⚙️ Environment Variables

### `backend/.env`

```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@db:5432/taskmanager
DATABASE_URL_TEST=postgresql://postgres:postgres@db:5432/taskmanager_test
```

### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🐳 Dockerized Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
```

2. **Build and start containers**

```bash
docker-compose up --build
```

3. **Run database migration**

```bash
docker-compose exec backend npx prisma migrate deploy
```

4. **Visit the app**

- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🧪 Running Tests

### Backend

```bash
cd backend
npm install
npm test
```

### Frontend

```bash
cd frontend
npm install
npm test
```

---

## 🛠 Scripts

### Backend

```bash
npm run dev       # Start dev server with nodemon
npm start         # Run in production mode
npm test          # Run backend tests
```

### Frontend

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm test          # Run frontend tests
```

---

## ✅ Project Completion Checklist

- [x] Working CRUD with filtering
- [x] PostgreSQL with Prisma
- [x] Docker + Docker Compose support
- [x] Unit & integration testing
- [x] Responsive UI with dark mode
- [x] `.env` setup for environments

---

## 📄 License

MIT © 2025 [Yashith Chandeepa](https://github.com/yashith03)
