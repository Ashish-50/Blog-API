# Blog-API

Blog API backend system with session authentication and redis implementation

# 📰 Blog API Backend (Node.js • Express • MongoDB • Redis • JWT)

## 📍 Overview

This project is a RESTful **Blog API backend** built using **Node.js** and **Express**, with secure **JWT authentication** and **Redis caching** for performance optimization.  
It provides modular endpoints for user authentication, blog post management, and analytics — all designed with scalability and clean architecture in mind.

## 🚀 API Endpoints

### 🧑‍💻 Authentication Routes

| Method | Endpoint             | Description                                       |
| ------ | -------------------- | ------------------------------------------------- |
| `POST` | `/api/auth/register` | Register a new user (validates & hashes password) |
| `POST` | `/api/auth/login`    | Authenticate user and return a signed JWT token   |
| `POST` | `/api/auth/logout`   | Logout user and invalidate session in Redis       |

## 🧠 Features Implemented

• **JWT-Based Authentication** — Secure, stateless authentication for all protected routes.  
• **Redis Session Store** — Fast in-memory caching for session validation and quick lookups.  
• **User Login via Email or Username** — Flexible authentication options for users.  
• **Automatic Session Expiration (TTL)** — Redis automatically removes expired sessions.  
• **Optimized Middleware Layer** — Centralized authentication and validation logic.  
• **Clean MVC Architecture** — Organized structure separating routes, controllers, and services.
