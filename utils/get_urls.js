// from ../.env
// const DEV = process.env.DEV;
// const isDev = DEV === "TRUE";

function getUrls() {
  let isDev = false;

  if (window.location.href.includes("localhost")) isDev = true;
  // console.log("isDev: ", isDev);

  const GET_INDEXED_TRACKS_URL = isDev
    ? "http://localhost:3000/getIndexedTracks"
    : "https://getshabads.xyz/getIndexedTracks";

  const ADD_INDEX_URL = isDev
    ? "http://localhost:3000/addIndex"
    : "https://www.getshabads.xyz/addIndex";

  const GET_SHABADS_URL = isDev
    ? "https://www.getshabads.xyz/getShabads?input="
    : "http://localhost:3000/getShabads?input=";

  return { GET_INDEXED_TRACKS_URL, ADD_INDEX_URL, GET_SHABADS_URL };
}

export default getUrls;
