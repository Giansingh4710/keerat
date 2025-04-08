'use server';
import {ArtistOpt} from '@/utils/types';
import {MongoClient, Db} from 'mongodb';

const MONGO_URL: string = 'mongodb://localhost:27017';
const DB_NAME: string = 'keerat';

interface TrackGroupDocument {
  group_name: string;
  group_type: string;
  artist_entries: ArtistOpt[];
}

export async function getTracks(group_types: string[]): Promise<ArtistOpt[]> {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db: Db = client.db(DB_NAME);
    const collection = db.collection<TrackGroupDocument>('all_tracks'); // Replace with your collection name

    const matchingGroups = await collection.find({group_name: {$in: group_types}}, {projection: {_id: 0}}).toArray();
    const allTracks: ArtistOpt[] = matchingGroups.flatMap(group => group.artist_entries);
    return allTracks;
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
