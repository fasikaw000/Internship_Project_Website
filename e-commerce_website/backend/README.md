# MICHUGEBEYA E-commerce Backend

## Overview
This is the backend of the **MICHUGEBEYA** e-commerce platform. It handles users, products, orders, and automated email notifications.

## Setup Instructions for a New Device

### 1. Clone & Install
Clone the repository and run `npm install` in **both** the `frontend` and `backend` folders.

### 2. Environment Variables (.env)
You must manually create `.env` files because they are ignored by GitHub for security.

**In the `backend/` folder:**
```env
PORT=5001
MONGO_URI=your_mongodb_cloud_link
JWT_SECRET=any_secret_string
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_google_app_password
ADMIN_EMAIL=your_inbox@gmail.com
```

**In the `frontend/` folder:**
```env
VITE_API_URL=http://localhost:5001/api
```

### 3. Run the Project
- **Backend**: Open a terminal in `backend/` and run `npm run dev`
- **Frontend**: Open a terminal in `frontend/` and run `npm run dev`

---

## 🚀 Portability & Deployment Notes

> [!IMPORTANT]
> **What happens when you clone this on a new computer?**
> - **Logo**: The **MICHUGEBEYA** logo is built with SVG code, so it will always appear perfectly on any device without needing external files.
> - **Product Images**: Uploaded images (product photos/receipts) are stored on your local machine. These will **not** appear on the new device automatically. You will need to log in as Admin on the new device and re-upload your products.
> - **Database**: 
>   - If you use **MongoDB Atlas** (Cloud), all your products and orders will "follow" you to any device.
>   - If you use a **Local MongoDB**, the database will be empty on the new device.
> - **Auto-Folders**: The backend will automatically create the `uploads/` folders if they are missing.