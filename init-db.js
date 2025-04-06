// Script to initialize MongoDB with sample data
const { connectToMongoDB, closeConnection, collections } = require('./db');

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Connect to MongoDB
    const db = await connectToMongoDB();
    
    // Sample user data
    const sampleUsers = [
      { username: 'user1', password: 'password123', name: 'Test User', email: 'user1@example.com' },
      { username: 'user2', password: 'password456', name: 'Demo User', email: 'user2@example.com' }
    ];
    
    // Sample pothole data
    const samplePotholes = [
      {
        latitude: 40.7128,
        longitude: -74.0060,
        severity: 'high',
        description: 'Large pothole near Times Square',
        reportedAt: new Date(),
        status: 'reported'
      },
      {
        latitude: 40.7306,
        longitude: -73.9352,
        severity: 'medium',
        description: 'Medium sized pothole on Main Street',
        reportedAt: new Date(),
        status: 'reported'
      },
      {
        latitude: 40.6782,
        longitude: -73.9442,
        severity: 'low',
        description: 'Small pothole near the park',
        reportedAt: new Date(),
        status: 'fixed'
      }
    ];
    
    // Sample traffic light data
    const sampleTrafficLights = [
      {
        latitude: 40.7142,
        longitude: -74.0119,
        status: 'working',
        lastChecked: new Date()
      },
      {
        latitude: 40.7411,
        longitude: -73.9897,
        status: 'maintenance',
        lastChecked: new Date()
      }
    ];
    
    // Drop existing collections if they exist
    console.log('Dropping existing collections...');
    try {
      await db.collection(collections.users).drop();
      await db.collection(collections.potholes).drop();
      await db.collection(collections.trafficLights).drop();
    } catch (err) {
      // Collection might not exist yet, which is fine
      console.log('Collections may not exist yet, continuing...');
    }
    
    // Insert sample data
    console.log('Inserting sample users...');
    await db.collection(collections.users).insertMany(sampleUsers);
    
    console.log('Inserting sample potholes...');
    await db.collection(collections.potholes).insertMany(samplePotholes);
    
    console.log('Inserting sample traffic lights...');
    await db.collection(collections.trafficLights).insertMany(sampleTrafficLights);
    
    console.log('Database initialization complete!');
    console.log(`
      Created ${sampleUsers.length} users
      Created ${samplePotholes.length} potholes
      Created ${sampleTrafficLights.length} traffic lights
    `);
    
    // Close the connection
    await closeConnection();
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase(); 