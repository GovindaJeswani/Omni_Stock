
# 🧠 **OmniStock – Smart Inventory & Order Management System**

### AI-Powered | Real-Time | Full-Stack | PostgreSQL | React + Node.js

---

## 📌 **Overview**

**OmniStock** is a modern, full-stack Inventory Management System that integrates:

* 📦 Inventory Management
* 🧾 Order Processing & Concurrency Control
* 🤖 AI-Powered Demand Forecasting
* 💹 Sales Analytics & Visualization
* 📊 Low-Stock Auto Alerts
* 🏭 Supplier Management
* ⚡ Modern UI with React + Tailwind + ShadCN

Uses a **PostgreSQL** backend with optimized seeding scripts and **Unsplash API** for high-quality product images.

---

# 🏗 **System Architecture**

```
                        ┌──────────────────────────────────────────────┐
                        │                 FRONTEND                     │
                        │            React + Vite + ShadCN             │
                        │  Pages: Dashboard, Inventory, Orders, AI     │
                        └──────────────────────────────────────────────┘
                                      │         ▲
                        REST API      │         │ JSON Responses
                                      ▼         │
          ┌──────────────────────────────────────────────────────────────┐
          │                           BACKEND                            │
          │                    Node.js + Express API                      │
          │  Services: Inventory, Orders, Suppliers, Forecast AI         │
          │  Integrations: Unsplash API, ML Engine                        │
          └──────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌──────────────────────────────────────────┐
                    │               POSTGRES DB                │
                    │ Tables: products, inventory, orders,     │
                    │         suppliers, order_items           │
                    └──────────────────────────────────────────┘
```

---

# ⚙️ **Technologies Used**

### **Frontend**

* React (Vite)
* TailwindCSS
* ShadCN/UI
* Recharts
* React Query
* Axios

### **Backend**

* Node.js + Express
* PostgreSQL (pg library)
* Cron jobs
* AI/ML forecaster (TensorFlow.js or custom model)

### **Infrastructure**

* Unsplash API for product images
* Environment variables (.env)
* GitHub version control

---

# 📁 **Project Structure**

```
omnistock/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── db/
│   │   ├── ml/
│   │   └── utils/
│   ├── prisma/ or migrations/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api/
│   └── index.html
│
└── database/
    ├── mega_seed.sql
    ├── unsplash_seed.sql
    └── add_low_stock_items.sql
```

---

# 🔧 **How to Run the Project**

## 1️⃣ Clone the Repository

```sh
git clone https://github.com/yourname/omnistock.git
cd omnistock
```

---

# 🗄 Database Setup (PostgreSQL)

### **Create DB**

```sql
CREATE DATABASE omnistock;
```

### **Run migrations**

```sh
psql -U postgres -d omnistock -f database/mega_seed.sql
```

### **Seed low stock products**

```sh
psql -U postgres -d omnistock -f database/add_low_stock_items.sql
```

---

# 🔑 **Environment Variables**

Create `backend/.env`:

```
DATABASE_URL=postgres://postgres:password@localhost:5432/omnistock

UNSPLASH_ACCESS_KEY=your_key_here

PORT=4000
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:4000
```

---

# ▶️ **Start Backend**

```sh
cd backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:4000
```

---

# 💻 **Start Frontend**

```sh
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🤖 **AI / ML Features Included**

### 1️⃣ **Demand Forecasting Model**

* Based on order history
* Uses moving average + ML regression
* Output: Next 30 days demand

### 2️⃣ **Stockout Prediction**

* Predict which product will reach **zero stock** soon

### 3️⃣ **Smart Low-Stock Alerts**

* AI prioritizes alerts based on:
  ✔ Order frequency
  ✔ Supplier lead time
  ✔ Price level
  ✔ Category demand

### 4️⃣ **Auto-Generate Inventory Insights**

Example:

> “Electronics demand increased 12% this month. You should restock TechDevice Pro.”

---

# 📊 **Frontend Pages & Features**

### ⭐ Dashboard

* KPIs (Revenue, Orders, Low Stock)
* Recharts revenue graph
* AI insights widget

### ⭐ Inventory Page

* Product list
* Filters (price, category, stock)
* Stock update modal
* AI-driven forecast badge

### ⭐ Orders Page

* Create new order
* Concurrency-safe stock locking
* Order history

### ⭐ AI Forecast Page

* Chart: next 30-day predictions
* Export CSV button

### ⭐ Supplier Page

* CRUD
* Supplier ranking based on reliability score

---

# 🔗 API Endpoints

```
GET    /api/products
POST   /api/products
PATCH  /api/products/:id

GET    /api/inventory
PATCH  /api/inventory/update

POST   /api/orders
GET    /api/orders

GET    /api/forecast
```

---

# 🧪 Testing

```sh
npm run test
```

---

# 📸 Screenshots 

```
📁 frontend/public/screenshots/
- frontend\public\screenshots\dashboard.png
- frontend\public\screenshots\ai_forecast.png
- frontend\public\screenshots\store.png
- frontend\public\screenshots\inventory.png
```

(Make sure to upload your screenshots to GitHub)

---

# 🚀 Deployment Notes

* Frontend → Vercel
* Backend → Render / Railway
* PostgreSQL → Supabase / NeonDB
* Add environment variables in production

---

# 🙌 Credits

Developed by: **Govinda**

---
