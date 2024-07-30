import { useEffect, useMemo, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";

import { getNameOfTrack, searchTracks } from "@/utils/helper_funcs";
import { useSearchStore, useStore } from "@/utils/store.js";

export default function SearchTracks() {
  const searchInput = useSearchStore((state) => state.searchInput);
  const setSearchInput = useSearchStore((state) => state.setSearchInput);

  return (
    <div className=" py-5 flex flex-col">
      <div className="flex  align-middle">
        <input
          placeholder="Search for Track:"
          className="flex-1 ml-4 h-10 rounded-md text-black p-2 bg-white align-middle"
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        <IconButton
          className="flex-1 flex items-center justify-center"
          onClick={() => setSearchInput("")}
        >
          <HighlightOffIcon className="text-white" />
        </IconButton>
      </div>
      <DisplayTracks searchInput={searchInput} />
    </div>
  );
}

function DisplayTracks({ searchInput }) {
  const allOpts = useStore((state) => state.allOptsTracks);
  const appendHistory = useStore((state) => state.appendHistory);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchInput !== "") {
      searchTracksAsync(searchInput, allOpts).then((results) => {
        setResults(results); // the async func makes input function lag less
      });
    }
  }, [searchInput, allOpts]);

  if (searchInput === "") return <></>;
  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <div className="flex flex-row justify-normal">
        <p className="flex-1">{results.length} Results Found</p>
        <IconButton
          className="h-10 w-10 "
          onClick={() => {
            const newRes = [...results.reverse()]
            console.log(newRes[0]);
            setResults(newRes);
          }}
        >
          <FlipCameraAndroidIcon className="text-white" />
        </IconButton>
      </div>
      <div className="overflow-y-auto h-48">
        {results.map((trkObj, index) => {
          return (
            <button
              key={index}
              onClick={() => appendHistory(trkObj)}
              className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 "
            >
              <div className="flex w-full text-sm">
                <p className="pl-2 pr-2">{index + 1}.</p>
                <p className="flex-1 text-left w-5/6 truncate break-words">
                  {getNameOfTrack(trkObj.link)}
                </p>
              </div>
              <div className="flex flex-row w-full text-xs">
                <div className="basis-3/4 text-xs text-left w-full">
                  <PersonIcon className="p-1" />
                  {trkObj.artist}
                </div>
                <div className="basis-1/4 text-xs text-right truncate break-words">
                  <AlbumIcon className="p-1" />
                  {trkObj.type}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

async function searchTracksAsync(input, allOpts) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = searchTracks(input, allOpts);
      resolve(results);
    }, 300); // The bigger the number, the less laggy the input function but the slower the results
  });
}
