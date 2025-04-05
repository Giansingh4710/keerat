'use server';
import {ArtistOpt} from '@/utils/types';
import {MongoClient, Db, Collection, Document} from 'mongodb';

const MONGO_URL: string = 'mongodb://localhost:27017';
const DB_NAME: string = 'keeratxyz';

export async function getTracks(collection_name: string): Promise<ArtistOpt[]> {
  const client: MongoClient = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db: Db = client.db(DB_NAME);
    const collection = db.collection<ArtistOpt>(collection_name);

    const tracks: ArtistOpt[] = await collection.find({}, {projection: {_id: 0, __v: 0}}).toArray();
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
