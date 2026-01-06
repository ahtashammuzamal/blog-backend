# Blog Backend

Backend practice project for a simple blog platform built with Node.js, Express, and MongoDB. The goal is to learn how to structure an Express API with authentication, author/admin roles, and CRUD endpoints for blog posts.

## Features
- **Authentication**: Sign up, login, logout, and JWT-based session handling.
- **Role-based access**: Author and admin roles, with admin-only endpoints for managing authors.
- **Blog CRUD**: Create, read, update, and delete blog posts with MongoDB persistence.
- **Validation & security**: Password hashing, request validation helpers, and protected routes.
- **Image Upload**: Image upload functionality using Cloudinary and Multer.
- **Health check**: `/health` endpoint for quick server status confirmation.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JSON Web Tokens (JWT)
- **File Uploads**: Cloudinary, Multer
- **Utilities**: bcryptjs, dotenv, validator
- **Dev tooling**: nodemon

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (bundled with Node.js)
- MongoDB instance (local or hosted)

### 1. Clone the repository
```bash
git clone https://github.com/ahtashammuzamal/blog-backend.git
cd blog-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root using the example below:
```bash
cp .env.example .env # optional helper once you create the example file
```

#### Example `.env`
```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-db
JSON_SECRET_KEY=replace-with-a-secure-random-string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
> Never commit real secrets. Keep `.env` files out of Git using the provided `.gitignore`.

### 4. Run the development server
```bash
npm run dev
```
The API will start on `http://localhost:5000` (or the port you set in `PORT`).

### 5. Run in production mode (optional)
```bash
npm start
```

## Available Scripts
- **`npm run dev`**: Start the server with nodemon for auto-reloads.
- **`npm start`**: Start the server with Node.js (production-style run).
- **`npm run seed`**: Seed the database with initial admin data.

## Project Status
This codebase is intentionally simple and exists for **learning and portfolio practice**. Feel free to extend it with tests, improved validation, documentation, or deployment scripts as you progress.

## GitHub Ready Checklist
- `.gitignore` excludes `node_modules`, logs, build folders, IDE artifacts, and environment files.
- Sample `.env` variables documented above.
- Ready for `git init`, initial commit, and pushing to GitHub once you create your own repository.

Happy coding!
