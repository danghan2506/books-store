# 📚 Online Book Store

A modern, full-stack E-commerce platform for buying and managing books. This project features a robust React (TypeScript) frontend powered by Vite, Redux Toolkit, and TailwindCSS, coupled with a secure Node.js/Express backend integrated with MongoDB, Clerk Authentication, and PayPal payments.

---

## 🚀 Architecture & Tech Stack

### Frontend
- **Framework & Tooling**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (RTK Query for data fetching & caching)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) + [Radix UI primitives / Shadcn](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Clerk React SDK](https://clerk.com/)

### Backend
- **Framework**: [Express.js](https://expressjs.com/) (Node.js runtime)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: Stateful JWT flow (**Access Token** & **Refresh Token** in secure HTTP-only cookies) + [Clerk Node SDK](https://clerk.com/)
- **Media Uploads**: [Cloudinary](https://cloudinary.com/)
- **Payments**: [PayPal Checkout SDK](https://developer.paypal.com/)
- **Mail Service**: [Nodemailer](https://nodemailer.com/)

---

## ✨ Key Features

### For Customers
- **Authentication**: Seamless sign-in/sign-up using Google (via Clerk) or classic Email & Password with OTP Verification.
- **Product Browsing**: Filter books by category, search by keyword, view top sales, new arrivals, and book details.
- **Interactive Reviews**: Write reviews and rate books (1 to 5 stars).
- **Shopping Cart**: Manage items, quantities, and check out.
- **Order Management & Payment**: Secure payment integration via PayPal.

### For Admins
- **Dashboard**: Interactive sales metrics, statistics, and charts (using ApexCharts / Chart.js).
- **Book Catalog Management**: Create, read, update, and delete (CRUD) books, upload images to Cloudinary, and generate SEO-friendly slugs.
- **Order & User Administration**: Track and update order statuses, view registered user accounts.

---

## 📂 Project Structure

```
books-store/
├── backend/
│   ├── config/             # DB & Clerk configurations
│   ├── constants/          # Shared constants (validation messages, etc.)
│   ├── controllers/        # Business logic for Auth, Books, Orders, Users
│   ├── middlewares/        # Authentication, DB connection, & error handlers
│   ├── models/             # Mongoose schemas (Book, Order, User)
│   ├── routes/             # Express API routes
│   ├── utils/              # Helper utilities (token generation, mailer, cloudinary)
│   └── index.js            # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components & Sidebar
│   │   ├── hooks/          # Custom react hooks (e.g. file uploading)
│   │   ├── pages/          # Page layouts (Home, Books, Admin Dashboard, Auth)
│   │   ├── redux/          # Redux Store, RTK Query API Slices
│   │   └── main.tsx        # React entry point
│   ├── index.html          # HTML template
│   └── vite.config.ts      # Vite bundler configurations
└── package.json            # Main workspace package.json
```

---

## 🔧 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB** Atlas database instance

### 2. Environment Configurations

#### Backend (`backend/.env`)
Create a file named `.env` in the `backend/` directory and configure the following variables:
```env
PORT=5000
DATABASE_URI=your_mongodb_atlas_database_uri
JWT_SECRET_KEY=your_access_token_secret
JWT_REFRESH_SECRET_KEY=your_refresh_token_secret
NODE_ENV=development
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

#### Frontend (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3. Installation
From the root directory, install all dependencies for the workspaces:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

## 🏃 Available Scripts

From the project root directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs both the frontend & backend concurrently in development mode. |
| `npm run backend` | Starts only the Node.js/Express server (with auto-restart via nodemon). |
| `npm run frontend` | Starts only the Vite development server for the React frontend. |
| `npm run build` | Compiles the frontend for production using TypeScript and Vite. |

---

