# AI Capsule - Cloud-Deployed AI Prompt Manager

A full-stack web application for saving and managing useful AI prompts, deployed on Render. Users sign in via GitHub OAuth, and the Express backend issues its own application JWT stored in a Secure, HttpOnly cookie named `token`. All CRUD operations are protected and user-scoped.

## 1. Public Deployment URL & Platform

*   **Deployed URL:** https://ai-capsule-sbbw.onrender.com
*   **Cloud Platform:** Render (Web Service, Free Tier)
*   **Runtime:** Node.js

## 2. Installation & Run Instructions

### Prerequisites
*   Node.js (v18+)
*   Git

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Yiting6419/ai-capsule.git
   cd ai-capsule

2.Install backend dependencies:
bash
npm install

3.Install frontend dependencies and build:
cd client
npm install
npm run build
cd ..

4.Create a .env file in the root directory with the following keys (values not shown):
PORT=3001
NODE_ENV=development
JWT_SECRET=my_super_secret_key_abc123
GITHUB_CLIENT_ID=Ov23liQ4HhKeSu3BeqoU
GITHUB_CLIENT_SECRET=5f96d341d142d1766768e7c6248fce30d8d159a6
GITHUB_CALLBACK_URL=http://localhost:3001/auth/github/callback

5.Start the server:
node server.js

3. Mandatory API Routes
All /api/capsules routes are protected by JWT authentication middleware. The Express backend serves the React frontend, so the frontend uses fetch with credentials: 'include' to communicate.
GET /api/health (Public) - Returns {"status":"ok"}
GET /api/capsules (Protected) - Read own records
POST /api/capsules (Protected) - Create own record
PUT /api/capsules/:id (Protected) - Update own record
DELETE /api/capsules/:id (Protected) - Delete own record
GET /auth/github (Public) - Initiates GitHub OAuth
GET /auth/github/callback (Public) - GitHub OAuth callback, issues JWT

5. Environment Variables
The following environment variable names are used (values are not shown for security):
PORT
NODE_ENV
JWT_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
GITHUB_CALLBACK_URL