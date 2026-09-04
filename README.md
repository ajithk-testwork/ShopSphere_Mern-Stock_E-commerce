# 🛒 ShopSphere — Full-Stack E-Commerce Platform

ShopSphere is a modern full-stack e-commerce platform built with the MERN stack.  
The application is designed to simulate a real-world online shopping system with secure authentication, product management, cloud image storage, cart management, order processing, Stripe payments, and transactional email notifications.

The project focuses on clean REST API architecture, secure authentication, role-based access control, reliable order management, and a responsive user experience.

---

## 🚀 Key Features

### 🔐 Authentication & Security

- User registration and login
- Admin authentication
- Password hashing with bcrypt
- JWT-based authentication
- Access Token + Refresh Token architecture
- HTTP-only refresh token cookies
- Protected API routes
- Role-based authorization
- User/Admin access separation
- Forgot password functionality
- Email-based OTP verification
- Secure password reset
- Password change notification email
- Login notification email
- Logout functionality

---

## 🛍️ E-Commerce Features

### 👤 Customer Features

- User account creation
- Secure login
- Browse products
- View product details
- Search products
- Filter products by category
- Add products to cart
- Update cart quantities
- Remove products from cart
- View cart
- Create orders from cart
- Store shipping information
- View personal order history
- Track order status
- View purchased product details
- View product images, prices, and quantities in orders

### 📦 Order Management

The application supports the complete order lifecycle:

```text
Cart
  ↓
Order Created
  ↓
Processing
  ↓
Shipped
  ↓
Delivered