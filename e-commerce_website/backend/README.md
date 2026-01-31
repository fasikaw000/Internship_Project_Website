# E-commerce Backend

## Overview
This is the backend of a full-stack e-commerce website.  
It handles **users, admin, products, orders, comments, and file uploads** using Node.js, Express, and MongoDB Atlas.



## Setup Instructions

1. **Install dependencies**

npm install

2. **Create .env file in the backend/ folder with the following:**

PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
ADMIN_FULLNAME=Admin Name
ADMIN_ACCOUNT_NUMBER=1234567890
Replace your_mongodb_atlas_uri and your_jwt_secret with your actual credentials.

3. **Run backend in development mode:**

npm run dev

4.**Run backend in production mode:**

npm start


5. **Folder Structure:**


backend/
├── package.json         # Project dependencies & scripts
├── server.js            # Main entry point, sets up server & routes
├── .env                 # Environment variables (not committed)
├── .gitignore           # Ignore node_modules, uploads, .env
├── README.md            # This file
├── nodemon.json         # Config for automatic reload with nodemon
└── src/
    ├── config/          # MongoDB connection and other configs
    ├── controllers/     # Business logic for routes
    ├── routes/          # API endpoints
    ├── middleware/      # Auth, admin checks, file uploads
    ├── utils/           # Error handler & utility functions
    ├── services/        # Email or notification services
    └── uploads/         # Uploaded files (receipts)



6. **Features:**

User registration and login with JWT authentication

Admin login and management of products, orders, and comments

CRUD operations for products

Order system with mass order support and receipt uploads

Customer comments and admin replies

Environment configuration using .env

Nodemon setup for development

7. **Notes:**

Make sure MongoDB Atlas is properly configured

All uploaded files are stored in src/uploads/receipts/

Use npm install to generate node_modules/

Use .gitignore to avoid committing sensitive or large files