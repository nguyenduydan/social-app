# Social App

A modern social networking application built with React + Vite.

## Description

This repository contains the source code for a social networking application that allows users to connect, share content, and interact with each other. The project uses modern web technologies to provide a fast and responsive user experience.

## Technologies

### Frontend
- React.js with Vite for rapid development
- Fast Refresh for seamless development experience
- ESLint for code quality assurance
- Modern React features and hooks
- Responsive UI components
- State management (Redux/Context API)
- React Router for navigation

### Backend
- Node.js with Express.js framework
- MongoDB for database with Mongoose ODM
- JWT for secure authentication
- Socket.io for real-time features
- Express-validator for input validation
- Multer for file uploads
- Bcrypt for password hashing
- Cors for cross-origin resource sharing
- Morgan for HTTP request logging

### DevOps & Tools
- Docker for containerization
- Redis for caching and session management
- Jest for unit and integration testing
- ESLint for code quality
- Prettier for code formatting
- Swagger/OpenAPI for API documentation
- PM2 for process management
- GitHub Actions for CI/CD

## Features

### User Management
- User registration and authentication
- Profile customization
  - Profile pictures
  - Bio and personal information
  - Custom user settings
- Social connections
  - Follow/Unfollow functionality
  - Friend requests
  - Blocking capabilities

### Content Features
- Post creation and sharing
  - Text posts
  - Image uploads
  - Rich media embedding
- Social interactions
  - Likes and reactions
  - Comments with threading
  - Post sharing
- Feed customization
  - Personalized news feed
  - Trending content
  - Content filtering

### Real-time Features
- Live notifications
- Real-time chat
- Active status indicators
- Instant updates for likes and comments

### Security Features
- Secure authentication with JWT
- Data encryption
- Privacy settings
- Content moderation tools
- Rate limiting
- XSS protection
- CSRF protection

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (v6+) or yarn (v1.22+)
- MongoDB (v4.4+)
- Redis (v6+)
- Docker (optional)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nguyenduydan/social-app.git
cd social-app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
# or if using yarn
yarn install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
# or if using yarn
yarn install
```

4. Configure environment variables:
Create a `.env` file in both frontend and backend directories:

Frontend `.env`:
```bash
VITE_API_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3000
VITE_PUBLIC_URL=http://localhost:5173
VITE_MEDIA_URL=http://localhost:3000/media
```

Backend `.env`:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/social-app
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
```

5. Start the development servers:

For frontend:
```bash
cd frontend
npm run dev
# or
yarn dev
```

For backend:
```bash
cd backend
npm run dev
# or
yarn dev
```

## Development

### Frontend Development
- Development server runs on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- ESLint configured for code quality
- TypeScript support available
- Component development with Storybook (planned)

### Backend Development
- API server runs on `http://localhost:3000`
- Auto-restart with nodemon
- API testing with Postman/Insomnia
- Swagger documentation available at `/api-docs`
- Database seeding scripts available

### Code Style
- Follow React best practices
- Use functional components
- Implement proper error handling
- Write meaningful comments
- Follow the established folder structure

### Testing
- Unit tests with Jest
- Integration tests
- End-to-end tests (planned)
- API tests with Supertest
- Accessibility testing

### Performance Considerations
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization
- Database indexing
- Redis caching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Review Process
1. Ensure all tests pass
2. Follow the code style guidelines
3. Update documentation as needed
4. Request review from maintainers

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Duy Dan Nguyen - [@nguyenduydan](https://github.com/nguyenduydan)

Project Link: [https://github.com/nguyenduydan/social-app](https://github.com/nguyenduydan/social-app)

Last Updated: 2025-10-24 21:50:14
