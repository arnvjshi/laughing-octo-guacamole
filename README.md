# BulkBite

BulkBite is a modern web platform designed to empower street food vendors and suppliers through **smart group buying**. By aggregating orders from multiple vendors, BulkBite enables everyone to access wholesale prices, reduce supply chain friction, and foster a collaborative local food ecosystem.

---

## 💡 Our Idea

Street vendors often face challenges in sourcing quality ingredients at affordable prices due to low order volumes and fragmented supply chains. BulkBite solves this by:

- **Group Buying:** Vendors can join group orders to unlock bulk discounts from suppliers.
- **Supplier Discovery:** Vendors easily find and connect with trusted suppliers in their area.
- **Order Management:** Both vendors and suppliers get intuitive dashboards to track orders, payments, and deliveries.
- **Community Building:** The platform encourages collaboration and knowledge sharing among local food entrepreneurs.

Our mission is to make local food businesses more profitable, sustainable, and connected.

---

## 🛠️ Tech Stack

BulkBite is built with a robust, scalable, and modern stack:

### **Frontend**
- **Next.js** (React 18) — App directory, server components, and static export for optimal performance.
- **Tailwind CSS** — Utility-first styling with custom glassmorphism and neumorphism effects.
- **GSAP** — For smooth, interactive animations.
- **TypeScript** — Type safety across the codebase.

### **Backend**
- **Express.js** — RESTful API server for authentication, product management, group orders, and more.
- **PostgreSQL** — Reliable, scalable relational database for all persistent data.
- **Prisma ORM** — Type-safe database access and migrations.

### **Other Tools**
- **JWT** — Secure authentication and session management.
- **Docker** — Containerized deployment for both frontend and backend.
- **GitHub Actions** — CI/CD for automated testing and deployment.

---

## 📦 Project Structure

```
/
├── frontend/         # Next.js app (UI, API routes, static export)
├── backend/          # Express.js server (API, business logic)
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
├── database/         # PostgreSQL setup, migrations
├── .github/          # GitHub Actions workflows
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone <repository-url>
cd BulkBite
```

### 2. Start the backend

```sh
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. Start the frontend

```sh
cd ../frontend
npm install
npm run dev
```

### 4. (Optional) Start PostgreSQL with Docker

```sh
docker-compose up -d
```

---

## 🌐 Live Demo

Coming soon!

---

## 🤝 Contributing

We welcome contributions! Please open issues or submit pull requests for new features, bug fixes, or suggestions.

---

## 📄 License

MIT License

---

**BulkBite** — Powering local food businesses through