"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabase = exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new mongodb_1.MongoClient(uri);
const dbName = 'test-db';
let db = null;
const connectToDatabase = async () => {
    try {
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};
exports.connectToDatabase = connectToDatabase;
const getDatabase = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDatabase = getDatabase;
