# E-commerce CRM System

A comprehensive Customer Relationship Management (CRM) system designed for E-commerce businesses, featuring AI-powered lead generation, call management, and customer interaction tracking.

## 🌟 Features

- **AI-Powered Lead Generation**: Automatically generate and qualify leads using AI
- **Call Management**: Track and manage customer calls with detailed logs
- **WhatsApp Integration**: Manage customer conversations seamlessly
- **Follow-up Scheduling**: Never miss important customer follow-ups
- **User Authentication**: Secure user management with JWT
- **Responsive Dashboard**: Clean, modern UI for all devices

## 🚀 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- date-fns (for date manipulation)
- Axios (for API calls)

### Backend
- Node.js with Express
- MongoDB (with Mongoose ODM)
- JWT for authentication
- Google Generative AI integration

## 📂 Project Structure

```
E-commerce-CRM/
├── crm-backend/          # Backend server
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── middleware/       # Authentication middleware
├── crm-frontend/         # Admin dashboard
├── crm-storefront/       # Customer-facing frontend
└── README.md             # This file
```

## 🛠️ Setup & Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd crm-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd crm-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication

The application uses JWT for authentication. Include the token in the `Authorization` header for protected routes:

```
Authorization: Bearer your_jwt_token
```

## 📞 Call Logging

The system tracks all customer calls with:
- Call duration
- Call status (In Progress, Completed, Missed, etc.)
- Call direction (Inbound/Outbound)
- Call recording and transcription
- Detailed call history

## 🤖 AI Features

- **Lead Generation**: Automatically generate and qualify leads
- **Call Analysis**: Get insights from customer calls
- **Smart Follow-ups**: AI-powered follow-up recommendations

## 📝 License

This project is licensed under the MIT License.


