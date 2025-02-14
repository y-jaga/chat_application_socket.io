# chat_application_socket.io

This is a real-time chat application built using Node.js, Express, Socket.IO, and MongoDB. It allows users to send and receive messages instantly.

## Features

- User authentication (Register/Login)
- Real-time messaging using WebSockets
- Secure password storage with bcrypt
- JWT-based authentication
- Fetching message history
- Fetching all users except the current user

## Technologies Used

- **Backend**: Node.js, Express.js, Socket.IO, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Frontend**: (To be developed separately)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   npm install

3. Create a .env file in the root directory and add the following:
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. Start the server:
   npm start
   The server will run on http://localhost:5001.

## API Endpoints

## Authentication Routes

1. Register a new user
   POST /auth/register

   Request Body:
   {
   "username": "John",
   "password": "JohnTest"
   }

2. Login user:
    POST /auth/login

   Request Body:
    {
    "username": "John",
    "password": "JohnTest"
    }

## Message Routes

1. Get chat messages between two users
    GET /messages?sender=John&receiver=Alice

## User Routes

1. Get all users except the current user
    GET /users?currentUser=John

## Socket.IO Events

1. send_message: Sent by the client to send a message.
2. recive_message: Received by clients when a new message is broadcast.
3. connection: Triggered when a user connects.
4. disconnect: Triggered when a user disconnects.