# 🍯 Honey Market

Welcome to Honey Market – a modern, user-friendly e-commerce platform dedicated to the sale and promotion of honey products. Whether you are a customer looking for high-quality honey or a producer aiming to reach a wider audience, Honey Market offers a seamless and secure online experience for all.

---

## 🛒 Overview

Honey Market was developed as a freelance project between September 2023 – January 2024, with the aim of bridging the gap between honey producers and consumers. The platform enables smooth browsing, secure checkout, and efficient order management—all in one place.

---

## 🚀 Key Features

### 1. 🧂 Product Categories and Listings
- Clean and organized display of honey product categories.
- Each listing includes an image, detailed description, and price.
- Easy navigation for users to explore specific types of honey.

### 2. 🛒 Shopping Cart
- Add/remove products from the cart with live price updates.
- Apply promotional discount codes at checkout.
- Real-time total calculation for improved UX.

### 3. 📦 Order Management
- View and track orders in a dedicated My Orders page.
- See product details, order status, and payment confirmation.

### 4. 🗣 Customer Support and Communication
- Built-in Contact Us page for inquiries and support.
- Easy communication channel between users and admin.
- Ensures customer satisfaction and trust.

### 5. 🛠 Admin Dashboard
- Robust backend dashboard for full control over the system:
  - Manage product categories and individual listings.
  - View, process, and update orders.
  - Create and manage discount codes.
  - Monitor payment notifications.
  - Handle user management and permissions.

---

## 🧑‍💻 Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (via Mongoose)
- Authentication: JWT-based
- Authorization: Role-based with middleware
- File Uploads: Multer
- Security: Helmet, express-rate-limit, CORS, dotenv
- Logging: Winston
---

## ⚙️ Environment Variables

Create a .env file in the root folder and include:

- PORT         # Port number for the server

- NODE_ENV     # Set to 'development' or 'production'

- JWT_SECRET   # Secret key for user token generation

- JWT_SECRET_REF  # Secret key for refresh tokens

- APP_EMAIL_ADDRESS # Email used to send verification and support emails


- APP_EMAIL_PASSWORD  # Password or App-specific password for the email service


- CLIENT_DOMAIN      # Frontend URL

- SERVER_DOMAIN      # Backend URL


## Run
npm run start
