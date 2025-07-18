# Smart Leave Management System

## Overview

The Smart Leave Management System is a comprehensive web-based application designed to streamline and automate employee leave management processes within organizations. Built with modern web technologies, this system provides a user-friendly interface for employees, managers, and administrators to handle leave requests efficiently while maintaining proper approval workflows and compliance.

## 🎯 Business Value

### For Organizations

- **Streamlined Processes**: Automate leave request workflows, reducing manual paperwork and administrative overhead
- **Improved Compliance**: Ensure leave policies are consistently applied across the organization
- **Better Resource Planning**: Real-time visibility into team availability and leave patterns
- **Enhanced Employee Experience**: Self-service portal for leave applications and tracking
- **Audit Trail**: Complete tracking of all leave-related activities for compliance and reporting

### For Employees

- **Easy Leave Applications**: Simple, intuitive interface for submitting leave requests
- **Real-time Status Tracking**: Monitor the status of leave applications in real-time
- **Leave Balance Visibility**: Clear view of available leave balances by type
- **Historical Records**: Access to complete leave history and patterns

### For Managers

- **Team Overview**: Comprehensive view of team members' leave status and balances
- **Efficient Approvals**: Streamlined approval process with all necessary information at hand
- **Resource Planning**: Calendar view of team leave to plan work assignments
- **Performance Insights**: Analytics on team leave patterns and trends

## 🚀 Key Features

### Multi-Role Access Control

- **Employee Portal**: Apply for leave, view balances, track history
- **Manager Dashboard**: Approve requests, manage team, view team calendar
- **Admin Panel**: System configuration, user management, audit logs

### Leave Management

- **Multiple Leave Types**: Casual, Sick, and Earned leave support
- **Smart Date Selection**: Automatic weekend and holiday exclusion
- **Balance Validation**: Real-time checking against available leave balances
- **Overlap Prevention**: Automatic detection of conflicting leave dates

### Advanced Features

- **Working Days Configuration**: Flexible setup for different working week patterns (5/6/4 days)
- **Holiday Calendar**: Configurable holiday management
- **Leave Type Management**: Customizable leave types and policies
- **Audit Logging**: Complete activity tracking for compliance

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Notifications**: Toast notifications for all user actions
- **Intuitive Navigation**: Role-based navigation with clear visual hierarchy
- **Data Visualization**: Charts and graphs for better data understanding

## 🛠 Technical Architecture

### Frontend Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development for better code quality
- **Material-UI (MUI)**: Professional UI components and theming
- **Redux Toolkit**: State management with RTK Query for API calls
- **React Router**: Client-side routing with protected routes
- **Vite**: Fast build tool and development server

### Key Technical Features

- **Type Safety**: Full TypeScript implementation for better development experience
- **State Management**: Centralized state management with Redux Toolkit
- **Protected Routes**: Role-based access control for all application routes
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with Material-UI breakpoints
- **Performance Optimized**: Code splitting, lazy loading, and efficient rendering

### Code Organization

```
src/
├── components/          # React components organized by role
│   ├── admin/          # Admin-specific components
│   ├── employee/       # Employee-specific components
│   ├── manager/        # Manager-specific components
│   ├── common/         # Shared components (Layout, Navbar, etc.)
│   └── leaves/         # Leave-related components
├── pages/              # Page-level components
├── services/           # API service layer
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 📊 System Roles & Permissions

### Employee

- View personal dashboard with leave balances
- Apply for leave with date selection and reason
- Track leave application status
- View leave history and patterns
- Access personal profile information

### Manager

- All employee permissions
- Approve/reject leave requests from team members
- View team leave calendar and availability
- Access team member details and leave history
- Manage team leave patterns and trends

### Administrator

- All manager permissions
- System configuration (working days, holidays, leave types)
- User management (create, update, delete users)
- Audit log access and system monitoring
- Dashboard analytics and reporting

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd smart-leave-management-system

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Deployment

- **Vercel**: easy deployment

## 📄 License

## This project is licensed under the MIT License - see the LICENSE file for details.

**Built with ❤️ using React, TypeScript, and Material-UI**
