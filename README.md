# 📝 Task Manager App

A full-stack, **Offline-First** Task Management application with features like CRUD operations, real-time sync markers, dark mode, test coverage, and Dockerized deployment.

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

- ✅ **Offline-First Architecture**: Works 100% without a backend.
- 🔄 **Background Sync**: Automatically reconciles local state with the server when connectivity is restored.
- 🟢/🟡 **Sync Indicators**: Real-time visual feedback on data persistence status.
- ✅ Add, edit, delete, mark tasks as done.
- 🔍 Filter tasks by priority, tags, and due date.
- 🌒 Toggle between Dark/Light mode.
- 🧪 Full test coverage (unit + integration).
- 🐳 Fully containerized (Docker + Docker Compose).

---

## 🏗️ Architectural Design: Offline-First

The application is built with a senior-level architecture that prioritizes UX:
1. **Source of Truth**: The frontend state and `localStorage` are the primary sources of truth for the UI, ensuring zero-latency interactions.
2. **Optimistic Updates**: Every action (create, update, delete) updates the UI instantly.
3. **Background Sync Service**: A background processes handles communication with the API. 
   - 🟡 Tasks shown with a yellow marker are stored locally.
   - 🟢 Tasks shown with a green marker are successfully synced to the cloud.

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
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── hooks/           # custom hooks (useTasks)
│   │   ├── services/        # API and Sync logic
│   │   ├── storage/         # localStorage layer
│   │   └── api/             # Axios configuration
│   ├── tailwind.config.js   # Tailwind config
│   ├── vite.config.js       # Vite config
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
git clone https://github.com/yashith03/task-manager001.git
cd task-manager001
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


https://github.com/user-attachments/assets/fb7c704a-4cef-488f-8308-c8591dd1a630


---

## ✅ Project Completion Checklist

- [x] Offline-first architecture (Optimistic UI)
- [x] Working CRUD with filtering
- [x] Sync reconciliation logic (🟢/🟡)
- [x] PostgreSQL with Prisma
- [x] Docker + Docker Compose support
- [x] Unit & integration testing
- [x] Responsive UI with dark mode
- [x] `.env` setup for environments

---

## 📄 License

MIT © 2025 [Yashith Chandeepa](https://github.com/yashith03)
