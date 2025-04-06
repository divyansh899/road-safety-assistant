// MongoDB connection setup
const { MongoClient } = require('mongodb');

// Connection URI (replace with your actual MongoDB connection string)
const uri = "mongodb://localhost:27017";

// Database and collection names
const dbName = "roadSafetyApp";
const collections = {
  users: "users",
  potholes: "potholes",
  trafficLights: "trafficLights"
};

// MongoDB client
let client = null;
let db = null;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    // Create a new MongoDB client
    client = new MongoClient(uri);
    
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    
    // Get reference to the database
    db = client.db(dbName);
    
    // Return the database instance
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Get database instance (connect if not already connected)
async function getDB() {
  if (!db) {
    db = await connectToMongoDB();
  }
  return db;
}

// Close MongoDB connection
async function closeConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed.");
    client = null;
    db = null;
  }
}

// Export functions and constants
module.exports = {
  connectToMongoDB,
  getDB,
  closeConnection,
  collections
}; 