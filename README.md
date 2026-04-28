# 🍹 Boozy — Cocktail Recipe App

A full-stack web application for creating and sharing cocktail recipes. Users can submit cocktails, rate them, and browse the collection. Admins manage moderation and publishing.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access + refresh tokens), Google OAuth 2.0
- **File uploads:** Multer
- **Other:** CORS

## Getting Started

### Prerequisites

- Node.js
- MongoDB (local)

### Installation

```bash
git clone https://github.com/er-Bilim/boozy.git
cd boozy
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=8000
MONGO_URL=mongodb://localhost/boozy

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Run

```bash
npm run dev
```

App will be running at `http://localhost:8000`

## Features

- 🔐 JWT authentication with refresh tokens + Google OAuth
- 🍸 Create cocktails with ingredients and recipe
- 📸 Image upload per cocktail
- ⭐ Rate cocktails (1–5 stars, one vote per user, changeable)
- 👤 "My cocktails" page — view all your submissions including unpublished
- 🛡️ Admin panel — publish, unpublish, and delete any cocktail

## Notes

- New cocktails are unpublished by default and go through admin moderation
- API documentation coming soon