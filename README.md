# Blog REST API

A RESTful API for a blog application built with Node.js, Express, and MongoDB.

## Technologies
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs

## Installation

1. Clone the repository
2. Install dependencies
   npm install
3. Create a .env file and add:
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/blog
   JWT_SECRET=mysecretkey123
4. Run the server
   npm run dev

## API Endpoints

### Posts
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/posts | Get all posts | No |
| GET | /api/posts/:id | Get single post | No |
| POST | /api/posts | Create post | Yes |
| PUT | /api/posts/:id | Update post | Yes |
| DELETE | /api/posts/:id | Delete post | Yes |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register new user |
| POST | /api/users/login | Login & get token |

## Authentication
Protected routes require a JWT token in the Authorization header:
Authorization: your_token_here