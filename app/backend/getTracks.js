'use server';

import {MongoClient} from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'keeratxyz';

export async function getTracks(collection_name){
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection(collection_name);

    const tracks = await collection.find({}).toArray();
    console.log('Fetched tracks:', tracks);
    return tracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
