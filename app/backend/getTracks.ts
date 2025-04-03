import {NextResponse} from 'next/server';
import axios from 'axios';

interface Track {
  id: string;
  title: string;
  artist: string;
  link: string;
  description?: string;
  timestamp?: string;
  shabadID?: string;
  shabadArr?: string[];
  type?: string;
  created?: number;
}

export async function GET(): Promise<NextResponse> {
  try {
    const response = await axios.get('https://api.github.com/repos/gians/keerat/contents/app/backend/tracks.json');
    const content = response.data.content;
    const decodedContent = Buffer.from(content, 'base64').toString('utf-8');
    const tracks: Track[] = JSON.parse(decodedContent);
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({error: 'Failed to fetch tracks'}, {status: 500});
  }
}
