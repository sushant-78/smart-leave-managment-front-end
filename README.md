# Smart Leave Management System - Frontend

A modern React-based frontend for the Smart Leave Management System with role-based access control, comprehensive leave management, and admin features.

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Thunk
- **UI Library**: MUI v5 (Material-UI)
- **Routing**: React Router v6 with protected routes
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form with Yup validation
- **Date Handling**: Day.js
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared components (ProtectedRoute, Layout, etc.)
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── leaves/          # Leave management components
│   ├── admin/           # Admin-specific components
│   └── manager/         # Manager-specific components
├── pages/               # Page components
├── store/               # Redux store and slices
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and constants
└── hooks/               # Custom React hooks
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Smart Leave Management
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🔐 Authentication & Authorization

The application implements role-based access control with three user roles:

- **Employee**: Can apply for leaves, view own history and balances
- **Manager**: Employee capabilities + team management and approval
- **Admin**: Full system access including user management and configuration

### Protected Routes

- `/dashboard` - All authenticated users
- `/leaves` - All authenticated users
- `/admin` - Admin only
- `/manager` - Manager and Admin

## 📊 Features Implemented

### ✅ Completed

- [x] Project structure and setup
- [x] Redux store configuration with slices
- [x] Authentication system with JWT
- [x] Protected routes with role-based access
- [x] Login page with form validation
- [x] Basic dashboard with user information
- [x] MUI v5 theme setup
- [x] API service configuration with interceptors

### 🚧 In Progress

- [ ] Leave application form
- [ ] Leave history and balance display
- [ ] Manager approval interface
- [ ] Admin user management
- [ ] System configuration
- [ ] Audit logs viewer

## 🔧 Development Status

**Phase 1: Foundation Setup** ✅ COMPLETED

- Project initialization with Vite + React + TypeScript
- Redux Toolkit setup with store configuration
- MUI v5 theme setup and customization
- React Router setup with protected routes
- Axios configuration with interceptors
- Basic authentication flow (login/logout)
- Role-based route protection
- Error handling and loading states

**Next Phase: Core Features** 🚧 IN PROGRESS

- Leave application form with calendar integration
- Leave history with filtering and pagination
- Leave balance display and tracking
- Employee dashboard with quick actions
- Manager team view and approval interface

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_APP_NAME=Smart Leave Management
```

## 📝 API Integration

The frontend is designed to work with the Smart Leave Management System backend API. Key endpoints:

- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user info
- `GET /leaves` - Fetch user leaves
- `POST /leaves` - Apply for leave
- `GET /leaves/balance` - Get leave balances
- `GET /users` - Admin: fetch all users
- `GET /admin/dashboard` - Admin: dashboard stats
- `GET /audit` - Admin: audit logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Smart Leave Management System assignment.
