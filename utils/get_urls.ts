interface Urls {
  GET_INDEXED_TRACKS_URL: string;
  GET_INDEXED_TRACKS_BY_ARTISTS_URL: string;
  ADD_INDEX_URL: string;
  GET_SHABADS_URL: string;
}

function getUrls(): Urls {
  let isDev = false;

  // if (typeof window !== 'undefined' && window.location.href.includes('localhost')) isDev = true;
  const SERVER_URL = isDev ? 'http://localhost:3000' : 'https://getshabads.xyz';

  const GET_INDEXED_TRACKS_URL = SERVER_URL + '/getIndexedTracks';
  const GET_INDEXED_TRACKS_BY_ARTISTS_URL = SERVER_URL + '/getIndexedTracksByArtists?artists=';
  const ADD_INDEX_URL = SERVER_URL + '/addIndex';
  const GET_SHABADS_URL = SERVER_URL + '/getShabads?input=';

  return {
    GET_INDEXED_TRACKS_URL,
    GET_INDEXED_TRACKS_BY_ARTISTS_URL,
    ADD_INDEX_URL,
    GET_SHABADS_URL,
  };
}

export default getUrls;
