// from ../.env
// const DEV = process.env.DEV;
// const isDev = DEV === "TRUE";

function getUrls() {
  let isDev = true;

  // if (window.location.href.includes("localhost")) isDev = true;
  // isDev = false;
  const SERVER_URL = isDev ? "http://localhost:3000" : "https://giansingh4710.xyz";

  const GET_INDEXED_TRACKS_URL = SERVER_URL + "/getIndexedTracks";
  const GET_INDEXED_TRACKS_BY_ARTISTS_URL = SERVER_URL + "/getIndexedTracksByArtists?artists=";
  const ADD_INDEX_URL = SERVER_URL + "/addIndex";
  const GET_SHABADS_URL = SERVER_URL + "/getShabads?input=";

  return {
    GET_INDEXED_TRACKS_URL,
    GET_INDEXED_TRACKS_BY_ARTISTS_URL,
    ADD_INDEX_URL,
    GET_SHABADS_URL,
  };
}

export default getUrls;
