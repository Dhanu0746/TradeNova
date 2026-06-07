# TradeNova 📈

TradeNova is a full-stack stock trading platform inspired by modern brokerage applications. It enables users to track stock prices, manage portfolios, execute simulated trades, and receive AI-powered market insights through a responsive web interface.

## 🚀 Features

* Secure JWT Authentication
* Real-Time Stock Updates
* Portfolio Management
* Buy & Sell Stock Simulation
* Watchlist Management
* AI-Powered Market Insights
* Redis-Based Market Data Caching
* RabbitMQ-Based Trade Processing
* Responsive User Interface

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Real-Time & Performance

* Socket.IO
* Redis (Upstash)

### Messaging

* RabbitMQ (CloudAMQP)

### AI Integration

* Groq API

## 🏗️ Architecture

```text
User
  ↓
React Frontend
  ↓
Express Backend
  ├── MongoDB Atlas
  ├── Redis Cache
  ├── RabbitMQ Queue
  └── Groq AI API
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Dhanu0746/TradeNova.git
cd TradeNova
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file in the backend directory and configure:

```env
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=24h
STOCK_API_KEY=
GROQ_API_KEY=
REDIS_URL=
RABBITMQ_URL=
PORT=4000
```
## 🌐 Deployment

Frontend: https://trade-nova-rggxov9zq-dhanushree-c-s-s-projects.vercel.app/

Backend: https://tradenova-yjut.onrender.com

## 💡 Key Highlights

* Built a scalable full-stack stock trading platform using React, Node.js, Express, and MongoDB.
* Integrated Redis caching to reduce API calls and improve performance.
* Implemented RabbitMQ-based asynchronous trade processing.
* Added AI-powered stock insights using Groq API.
* Designed responsive and modern UI for an improved user experience.

## 🔮 Future Enhancements

* Advanced stock analytics
* Technical indicators and charts
* Paper trading competitions
* Social trading features
* Mobile application support

## 👨‍💻 Author

Dhanushree C S 

GitHub: https://github.com/Dhanu0746
