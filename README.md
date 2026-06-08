# AgriMart — Enterprise Agri E-Commerce Platform

[![.NET 9](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

A **production-grade, multi-role agricultural marketplace** connecting verified Indian farmers directly with B2B and B2C customers. Built on enterprise-grade Clean Architecture principles.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  Next.js Web (Port 3000) │ Next.js Admin (Port 3001)        │
│             React Native Expo (Mobile)                       │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST + SignalR
┌──────────────────────────▼──────────────────────────────────┐
│               .NET 9 WEB API  (Port 5000)                    │
│  Clean Architecture: Core → Application → Infrastructure     │
│  CQRS (MediatR) │ JWT Auth │ Rate Limiting │ SignalR Hub     │
└──────────┬───────────────────────────┬──────────────────────┘
           │ SQL (EF Core)             │ HTTP (typed client)
┌──────────▼──────────┐   ┌───────────▼──────────────────────┐
│  PostgreSQL (5432)  │   │  Python FastAPI  (Port 8000)      │
│  Redis (6379)       │   │  Crop Recommend │ Pricing │ AI    │
└─────────────────────┘   └──────────────────────────────────┘
```

## 🚀 Quick Start

### Option A — Docker Compose (Full Stack)
```bash
git clone <repo>
cd agri-ecommerce
docker-compose up -d
```
| Service     | URL                         |
|-------------|-----------------------------|
| Web App     | http://localhost:3000       |
| Admin App   | http://localhost:3001       |
| .NET API    | http://localhost:5000       |
| AI Services | http://localhost:8000/docs  |
| PostgreSQL  | localhost:5432              |

### Option B — Local Development

**Prerequisites:** .NET 9 SDK, Node.js 22+, Python 3.11+, PostgreSQL 15+

#### 1. Start Database
```bash
docker-compose up -d postgres redis
```

#### 2. Run Backend
```bash
cd backend
dotnet ef database update --project src/Infrastructure --startup-project src/API
dotnet run --project src/API
```

#### 3. Run AI Services
```bash
cd ai-services
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### 4. Run Frontend Apps
```bash
# Web Marketplace
cd apps/web && npm install && npm run dev      # → http://localhost:3000

# Admin Dashboard
cd apps/admin && npm install && npm run dev    # → http://localhost:3001

# Mobile (iOS/Android)
cd apps/mobile && npx expo start
```

---

## 📁 Project Structure

```
agri-ecommerce/
├── apps/
│   ├── web/                  # Next.js B2C/B2B Marketplace
│   │   ├── src/app/          # App Router pages (cart, checkout, login, register)
│   │   ├── src/components/   # Navbar
│   │   └── src/store/        # Zustand (cartStore, authStore)
│   ├── admin/                # Next.js Admin Dashboard
│   │   ├── src/app/          # Dashboard, Products, Orders, Approvals
│   │   └── src/components/   # AdminSidebar
│   └── mobile/               # React Native Expo (KYC screen)
│
├── backend/
│   └── src/
│       ├── Core/             # Domain Entities, BaseEntity
│       ├── Application/      # CQRS (Commands, Queries), Interfaces, DTOs
│       │   ├── Verifications/
│       │   ├── Orders/
│       │   ├── Deliveries/
│       │   └── Products/
│       ├── Infrastructure/   # EF Core DbContext, AiServiceClient
│       │   └── Persistence/  # ApplicationDbContext + Migrations
│       └── API/              # Controllers, Hubs, Program.cs
│           ├── Controllers/  # Auth, Products, Orders, Verifications, Deliveries, AI
│           └── Hubs/         # DeliveryTrackingHub (SignalR)
│
├── ai-services/              # Python FastAPI
│   ├── routers/              # crop.py, pricing.py, disease.py
│   ├── main.py               # App entry + CORS
│   ├── requirements.txt
│   └── Dockerfile
│
├── packages/
│   └── shared-ui/            # @agri/shared-ui (Button, Card, Tailwind theme)
│
├── docker-compose.yml        # Full stack orchestration
├── DEPLOYMENT.md             # CI/CD & cloud deployment guide
└── turbo.json                # Turborepo pipeline config
```

---

## 👥 User Roles

| Role              | Capabilities |
|-------------------|-------------|
| **Customer**      | Browse products, add to cart, checkout, track delivery |
| **Farmer**        | Submit KYC, list products, manage inventory |
| **Authorizer**    | Review and approve/reject farmer KYC applications |
| **SubAdmin**      | Manage products, pricing, and orders |
| **SuperAdmin**    | Full platform control, user management, analytics |
| **DeliveryProvider** | Update delivery status (triggers real-time SignalR push) |

---

## 🔑 Key API Endpoints

### Authentication
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/api/auth/login`     | Login → JWT |
| POST   | `/api/auth/register`  | Register new customer |

### Products
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| GET    | `/api/products`       | List active products (search, pagination) |
| GET    | `/api/products/{id}`  | Product detail |

### Orders
| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/api/orders/place`   | Place a new order |
| GET    | `/api/orders/my-orders` | Customer's order history |

### Verification (KYC)
| Method | Endpoint                    | Description |
|--------|-----------------------------|-------------|
| POST   | `/api/verification/submit`  | Farmer submits Aadhaar + GPS |
| POST   | `/api/verification/review`  | Admin approves/rejects |
| GET    | `/api/verification/pending` | List pending KYC queue |

### Delivery
| Method | Endpoint                       | Description |
|--------|--------------------------------|-------------|
| POST   | `/api/deliveries/update-status`| Update → SignalR broadcast |
| GET    | `/api/deliveries/{trackingId}` | Get tracking snapshot |

### AI Services (`http://localhost:8000`)
| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| POST   | `/crop/recommend`   | Soil + climate → crop suggestion |
| POST   | `/pricing/suggest`  | Dynamic price optimization |
| POST   | `/disease/detect`   | Image-based disease detection stub |

---

## 🧠 AI-Ready Features

The Python FastAPI AI layer is ready for production ML integration:
- **Crop Recommendation** → Replace rule engine with trained Random Forest / XGBoost on ICAR datasets
- **Dynamic Pricing** → Connect to AGMARKNET live price feeds
- **Disease Detection** → Plug in ResNet-50 fine-tuned on PlantVillage dataset

---

## 🔐 Security

- **JWT Auth** — Short-lived access tokens + role claims
- **Rate Limiting** — 100 req/min per IP (global, .NET middleware)
- **RBAC** — Granular `Products.Create`, `Users.Delete` style permissions
- **CORS** — Configured per environment
- **Soft Deletes** — All entities have `IsDeleted` flag

---

## 📡 Real-Time (SignalR)

Connect via `@microsoft/signalr`:
```js
const connection = new HubConnectionBuilder()
  .withUrl("http://localhost:5000/hubs/delivery")
  .build();

await connection.start();
await connection.invoke("JoinTrackingGroup", deliveryId);
connection.on("ReceiveStatusUpdate", (data) => {
  console.log("Status:", data.status);
});
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 16, TypeScript, Tailwind CSS, Zustand, TanStack Query |
| Admin Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Mobile | React Native, Expo |
| Backend | ASP.NET Core 9, C#, Clean Architecture, CQRS, MediatR |
| Database | PostgreSQL 15, Entity Framework Core 9 |
| Cache | Redis 7 |
| AI Services | Python 3.11, FastAPI 0.104, Pydantic v2 |
| Real-Time | SignalR (ASP.NET Core) |
| Containerization | Docker, Docker Compose |
| Monorepo | Turborepo |
