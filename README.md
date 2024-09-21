# Multi-User Task Management API

## Overview
This API provides a task management system with support for multiple user roles (Admin, Manager, User). Users can manage tasks, assign roles, and collaborate on projects effectively.

## Features
- **User Authentication**: Secure login and registration using JWT.
- **Role Management**: Different access levels for Admin, Manager, and User roles.
- **Task Management**: Create, assign, and manage tasks with various statuses and priorities.
- **Team Management**: Manage teams and assign users to specific teams.
- **Input Validation**: Robust validation for all incoming requests.

## Technologies Used
- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (or any preferred database)
- Bcrypt.js (for password hashing)
- JSON Web Token (JWT) for authentication
- Express Validator (for request validation)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (or any compatible database)
- Git (optional, for cloning the repository)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>

2. **Install dependencies**

```bash
  npm install

```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

`DB_NAME`

`DB_USER`

`DB_PASSWORD`

`DB_HOST`

`DB_PORT`



**Run the server**

```bash
 npm start

```
The server will start on http://localhost:3000# Task Management API Documentation

## API Endpoints

### 1. Authentication & User Management

- **Register User**
  - **Method**: `POST`
  - **Route**: `/auth/register`
  - **Request Body**:
    ```json
    {
      "username": "johndoe",
      "email": "johndoe@example.com",
      "password": "password",
      "role": "User"
    }
    ```
  - **Response**: Created user details (Admin only can assign roles).

- **Login User**
  - **Method**: `POST`
  - **Route**: `/auth/login`
  - **Request Body**:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password"
    }
    ```
  - **Response**: JWT token.

- **Get All Users**
  - **Method**: `GET`
  - **Route**: `/users`
  - **Authorization**: Admin only.
  - **Response**: List of all users.

- **Assign Team to User**
  - **Method**: `POST`
  - **Route**: `/teams/:teamId/assign`
  - **Request Body**:
    ```json
    {
      "userId": 2
    }
    ```
  - **Authorization**: Manager or Admin.
  - **Response**: Confirmation of user assignment.

- **Update User Role**
  - **Method**: `PATCH`
  - **Route**: `/users/:id/role`
  - **Request Body**:
    ```json
    {
      "role": "Admin" // or "Manager", "User"
    }
    ```
  - **Authorization**: Admin only.
  - **Response**: Confirmation of user role update, including updated user details.

### 2. Task Management

- **Create Task**
  - **Method**: `POST`
  - **Route**: `/tasks`
  - **Request Body**:
    ```json
    {
      "title": "New Task",
      "description": "Task details",
      "priority": "High",
      "dueDate": "2024-12-31",
      "assignedTo": 3
    }
    ```
  - **Authorization**: Manager/Admin only.
  - **Response**: Created task details.

- **Get All Tasks**
  - **Method**: `GET`
  - **Route**: `/tasks`
  - **Authorization**: Admin/Manager/User.
  - **Response**: 
    - Admin/Manager: List of all tasks.
    - User: List of tasks assigned to the logged-in user.

- **Update Task Status**
  - **Method**: `PATCH`
  - **Route**: `/tasks/:id/status`
  - **Request Body**:
    ```json
    {
      "status": "Completed"
    }
    ```
  - **Authorization**: The assigned user only.
  - **Response**: Updated task status.

- **Delete Task**
  - **Method**: `DELETE`
  - **Route**: `/tasks/:id`
  - **Authorization**: Admin/Manager (task creator or assigned).
  - **Response**: Confirmation of task deletion.

---

### Notes
- An admin user is created automatically the first time the server runs, if it does not already exist. The default admin email is `ajaypatidar@gmail.com` with the password `12345678`.

## Testing the API 

You can use Postman or any API testing tool to test the endpoints.

