# ToDoApp

ToDoApp is a project management website where users can create, manage, and organize their tasks effectively.

## Features

- User authentication with custom email/password and Google OAuth.
- CRUD operations for managing todo projects.
- Responsive design for optimal user experience across devices.
- Notifications for updates and changes.
- User account management (change name, password, delete account).

## Technologies Used

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB
- Integration: Google Oauth. 
- Deployment: AWS EC2, NGINX

To set up the project locally, follow these steps:

1. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Build the frontend:
     ```bash
     npm run build
     ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

# Database Design

For the database, MongoDB is used along with Mongoose for schema modeling. Two main models are used:

1. **Todo Model**: Represents a todo item with fields such as title, description, and completion status.
2. **User Model**: Represents a user with fields like first name, last name, email, and password.

# Frontend Development

The frontend is built using React and styled with Tailwind CSS. Components are organized to manage user authentication, todo management, and user account settings.

# Backend Development

The backend is developed with Node.js and Express.js. RESTful APIs are created for user authentication (signup, login, logout) and todo CRUD operations (POST, PUT, GET, DELETE). Middleware is implemented for JWT authentication and error handling.

# CI/CD Integration

Continuous Integration (CI) is achieved using GitHub Actions for automated testing and deployment. Workflows are configured to run tests on every push and deploy to a staging environment.

# Deployment

The application is deployed on AWS EC2 instances. NGINX is used as a reverse proxy to route incoming HTTP requests to the Node.js server. Deployment scripts are set up to automate the deployment process, ensuring efficient and secure hosting.

## Author

[Md Ashraful Islam](link-to-profile)

## License

This project is licensed under the [MIT License](link-to-license).
