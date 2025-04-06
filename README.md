# Road Safety Assistant

A clean, responsive web application for pothole and traffic light detection to help road users avoid accidents.

## Features

- User authentication (login system)
- Pothole detection and reporting
- Traffic light status monitoring
- MongoDB database integration
- Clean and responsive UI

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation Steps

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Make sure MongoDB is running on your system
   - For local MongoDB: `mongod --dbpath /path/to/data/directory`
   - Or use MongoDB Atlas and update the connection string in `db.js`

4. Initialize the database with sample data:
   ```
   node init-db.js
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open your browser and navigate to `http://localhost:3000`

## MongoDB Integration

This application uses MongoDB to store:
- User accounts
- Pothole data
- Traffic light information

### Database Structure

- **Users Collection**: Stores user credentials and profile information
- **Potholes Collection**: Stores pothole locations, severity, and status
- **Traffic Lights Collection**: Stores traffic light locations and operational status

### API Endpoints

- **POST /api/login**: Authenticate users
- **GET /api/potholes**: Retrieve all pothole data
- **POST /api/potholes**: Report a new pothole

## Test Credentials

Use these credentials to test the login functionality:
- Username: `user1`, Password: `password123`
- Username: `user2`, Password: `password456`

## Customization

- Edit `styles.css` and `home-style.css` to change the appearance
- Modify MongoDB connection settings in `db.js`
- Add new API endpoints in `server.js`

## License

Free to use for personal and commercial projects. 