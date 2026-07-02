# Symptom Checker Platform

Production-oriented full-stack template for a healthcare-style product, built with React (Vite), Node.js (Express), and MongoDB.

## What this template gives you

- Company-style project structure (`frontend` + `backend`) with clear service boundaries
- One-command local startup from repository root
- Environment-first configuration with explicit required backend variables
- Basic runtime hardening (Helmet, CORS, request rate limiting, sanitization, graceful shutdown)
- Clear onboarding docs for local development and deployment handoff

## Tech stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS, Zustand
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, Helmet, CORS, Morgan

## Quick start

### 1) Install dependencies

From repository root:

```bash
npm install
```

Install app dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2) Configure environment

Create local env files from templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Required backend variables:

- `MONGO_URI`
- `JWT_SECRET`

### 3) Run locally

Start frontend + backend together:

```bash
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health endpoint: `http://localhost:5000/api/health`

## Root scripts

- `npm run dev` - run backend and frontend in parallel
- `npm run dev:backend` - run backend only
- `npm run dev:frontend` - run frontend only
- `npm run build` - build frontend
- `npm run lint` - lint frontend
- `npm run test` - run backend tests

## Deployment checklist

- Set all production environment variables in hosting platform
- Restrict `CORS_ORIGIN` to the deployed frontend domain
- Use managed MongoDB with backups enabled
- Rotate JWT and refresh secrets periodically
- Enable centralized logs and uptime monitoring

## Recommended next hardening steps

- Add backend linting and formatting pipeline
- Add unit and integration tests for critical APIs
- Add CI workflow (lint + test + build on pull requests)
- Add OpenAPI/Swagger contract for API consumers
