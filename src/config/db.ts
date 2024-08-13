import { MongoClient, Db } from 'mongodb';

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; 

const client = new MongoClient(uri);
const dbName = 'test-db'; 

let db: Db | null = null;

export const connectToDatabase=async(): Promise<void> => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

export const getDatabase = (): Db | null => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};
