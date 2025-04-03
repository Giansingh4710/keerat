'use server';
import { MongoClient, Db, Collection, Document } from 'mongodb';

const MONGO_URL: string = 'mongodb://localhost:27017';
const DB_NAME: string = 'keeratxyz';

interface Track extends Document {
  // Define your Track interface properties here based on your document structure
  // Example:
  // _id: ObjectId;
  // title: string;
  // artist: string;
  // createdAt: Date;
  // etc...
}

export async function getTracks(collection_name: string): Promise<Track[]> {
  const client: MongoClient = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db: Db = client.db(DB_NAME);
    const collection: Collection<Track> = db.collection<Track>(collection_name);

    const tracks: Track[] = await collection.find({}).toArray();
    // console.log(`Fetched ${tracks.length} tracks from collection ${collection_name}`);
    console.log(tracks);
    return tracks;
  } catch (error: unknown) {
    console.error('Error fetching tracks:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch tracks: ${error.message}`);
    }
    throw new Error('Failed to fetch tracks due to unknown error');
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
