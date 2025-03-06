// API configuration
export const API_BASE_URL = 'http://localhost:3000/v1';

// Ticket status options
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// Ticket priority options
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_WITH_ROLE: '/signup-with-role',
  DASHBOARD: '/dashboard',
  USER_DASHBOARD: '/user-dashboard',
  ADMIN_DASHBOARD: '/admin-dashboard',
  TICKET_DETAILS: '/tickets/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '*'
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10
}; 