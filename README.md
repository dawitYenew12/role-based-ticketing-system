# Role-Based Ticketing Microservices

A simple ticketing system built with a microservices architecture and role-based access control. This system allows organizations to manage support tickets efficiently.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
  - [Docker Compose](#docker-compose)
  - [Render Deployment](#render-deployment)
- [Contributing](#contributing)
- [License](#license)

## 🏗️ Architecture Overview

This application follows a microservices architecture with the following components:

1. **API Gateway** (Port 3000)
   - Entry point for all client requests
   - Handles routing to appropriate services
   - Manages authentication and authorization
   - Implements caching with Redis

2. **Auth Service** (Port 3001)
   - Manages user authentication
   - Handles JWT token generation and validation
   - Implements role-based access control

3. **User Service** (Port 3002)
   - Manages user profiles and accounts
   - Handles user registration and profile updates
   - Stores user data in MongoDB

4. **Ticket Service** (Port 3003)
   - Manages ticket creation, updates, and queries
   - Implements ticket assignment and status tracking
   - Uses Redis for caching frequently accessed tickets

The services communicate asynchronously via RabbitMQ message broker, ensuring loose coupling and high availability.

## ✨ Features

- **Role-Based Access Control**: Different permissions for admins, agents, and customers
- **Ticket Management**: Create, update, assign, and track support tickets
- **User Management**: Register, authenticate, and manage user profiles
- **Asynchronous Communication**: Services communicate via message broker
- **Caching**: Improved performance with Redis caching
- **Scalable Architecture**: Each service can be scaled independently
- **Containerized**: Easy deployment with Docker

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Message Broker**: RabbitMQ
- **Containerization**: Docker, Docker Compose
- **Deployment**: Render (Cloud Platform)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/roleBased-ticketing-microservices.git
   cd roleBased-ticketing-microservices
   ```

2. **Start all services using Docker Compose**:
   ```bash
   docker-compose up
   ```

3. **Access the API Gateway**:
   - The API Gateway will be available at http://localhost:3000
   - RabbitMQ Management UI: http://localhost:15672 (guest/guest)
   - MongoDB will be running on port 27017
   - Redis will be running on port 6379

4. **Development without Docker** (optional):
   
   To run each service individually for development:
   
   ```bash
   # Install dependencies for each service
   cd api-gateway && npm install
   cd ../auth-service && npm install
   cd ../user-service && npm install
   cd ../ticket-service && npm install
   
   # Run each service in a separate terminal
   # Make sure MongoDB, Redis, and RabbitMQ are running locally
   cd api-gateway && npm run dev
   cd auth-service && npm run dev
   cd user-service && npm run dev
   cd ticket-service && npm run dev
   ```

### Environment Variables

Each service requires specific environment variables. Sample `.env` files are provided in each service directory. For production, make sure to set secure values.

Key environment variables include:

- `NODE_ENV`: Environment (development/production)
- `PORT`: Port number for the service
- `DB_URI`: MongoDB connection string
- `RABBITMQ_URL`: RabbitMQ connection string
- `REDIS_URL`: Redis connection string (for API Gateway and Ticket Service)
- `JWT_SECRET`: Secret for JWT token generation (Auth Service)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
