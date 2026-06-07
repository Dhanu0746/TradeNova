# TradeNova Backend

## Overview
This backend scaffold is built with Node.js, Express, MongoDB, Redis, and Socket.IO. It provides:

- user authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/profile`)
- JWT-protected endpoints
- Redis caching for market data
- Socket.IO for live market subscriptions
- an AI advisor placeholder endpoint at `/api/advisor/signal`

## Setup

1. Install dependencies:
   ```bash
   cd TradeNova/server
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` values for MongoDB, Redis, and stock API.

4. Start the server:
   ```bash
   npm run dev
   ```

## Notes

- `stock.service.js` currently uses a placeholder API URL. Replace with a real market data provider.
- `advisor.routes.js` returns a static recommendation stub. Integrate an AI service or decision engine for real guidance.
- Redis is used for caching and can later support session storage, pub/sub, and rate limiting.
