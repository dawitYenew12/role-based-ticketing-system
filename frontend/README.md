# Ticketing System Frontend

A modern React application for a role-based ticketing system.

## Architecture

This project follows a modular architecture with the following structure:

```
frontend/
├── public/                  # Static files
│   ├── index.html           # Main HTML file
│   └── assets/              # Static assets
│
├── src/                     # Source code
│   ├── components/          # Reusable UI components (class-based)
│   │   └── ...              # Other components
│   │
│   ├── pages/               # Page-level components (class-based)
│   │   ├── AdminDashboard/  # Admin dashboard
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── index.js
│   │   ├── UserDashboard/   # User dashboard
│   │   │   ├── UserDashboard.jsx
│   │   │   └── index.js
│   │   ├── Home/            # Home page
│   │   │   ├── Dashboard.jsx
│   │   │   └── index.js
│   │   └── Auth/            # Authentication pages
│   │       ├── Login/
│   │       ├── Signup/
│   │       ├── SignupWithRole/
│   │       └── index.js
│   │
│   ├── context/             # React Context API files
│   │   ├── NavigationContext.js
│   │   └── ...
│   │
│   ├── layouts/             # Layout components (class-based)
│   │   ├── MainLayout.jsx
│   │   └── index.js
│   │
│   ├── utils/               # Utility functions and helpers
│   │   ├── withNavigation.js
│   │   ├── validation.js
│   │   └── ...
│   │
│   ├── services/            # API services
│   │   ├── authService.js
│   │   ├── ticketService.js
│   │   └── index.js
│   │
│   ├── config/              # Configuration files
│   │   ├── constants.js
│   │   ├── queryClient.js
│   │   └── ...
│   │
│   ├── assets/              # Global assets
│   │
│   ├── App.jsx              # Main App component
│   └── main.jsx             # Entry point
```

## Features

- Authentication (Login, Signup, Role-based Signup)
- User Dashboard for creating and viewing tickets
- Admin Dashboard for managing tickets and users
- Role-based access control

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
```

## Technologies Used

- React 19
- React Router 7
- TanStack Query (React Query)
- Tailwind CSS
- Vite
- Axios
- JWT Authentication
- Ant Design
