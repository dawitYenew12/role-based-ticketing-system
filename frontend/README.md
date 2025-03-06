# Ticketing System Frontend

A modern React application for a role-based ticketing system.

## Architecture

This project follows a senior-level architecture with the following structure:

```
src/
├── assets/            # Static assets like images, fonts, etc.
├── components/        # Reusable UI components
│   ├── common/        # Shared components (Button, Input, etc.)
│   ├── admin/         # Admin-specific components
│   ├── user/          # User-specific components
│   └── auth/          # Authentication-related components
├── config/            # Configuration files and constants
├── context/           # React Context API for global state management
├── hooks/             # Custom React hooks
├── layouts/           # Page layout components
├── pages/             # Page components organized by feature
│   ├── admin/         # Admin pages
│   ├── auth/          # Authentication pages
│   └── user/          # User pages
├── services/          # API services and data fetching
├── types/             # TypeScript type definitions
└── utils/             # Utility functions and helpers
```

## State Management

The application uses React Context API for global state management with the following contexts:

- **AuthContext**: Manages authentication state, user info, and auth-related actions
- **UIContext**: Manages UI state like theme, notifications, and loading states
- **TicketContext**: Manages ticket-related state and actions

## Features

- Role-based authentication (Admin and User roles)
- Ticket management (create, update, delete, assign)
- Responsive UI with theme support
- Form validation
- Error handling
- Loading states

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
