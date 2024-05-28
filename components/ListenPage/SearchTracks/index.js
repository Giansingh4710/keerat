import { useEffect, useMemo, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";

import { getNameOfTrack, searchTracks } from "@/utils/helper_funcs";
import { useSearchStore, useStore } from "@/utils/store.js";

export default function SearchTracks() {
  const searchInput = useSearchStore((state) => state.searchInput);
  const setSearchInput = useSearchStore((state) => state.setSearchInput);

  return (
    <div className="pt-10 flex flex-col">
      <div className="pb-2 flex  align-middle">
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
      <p>{results.length} Results Found</p>
      <div className="overflow-auto h-48">
        {results.map((trkObj, index) => {
          return (
            <button
              key={index}
              onClick={() => appendHistory(trkObj)}
              className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 "
            >
              <div>
                <span className="pl-2 pr-2">{index + 1}.</span>
                <span className="flex-1 text-left w-full break-words">
                  {getNameOfTrack(trkObj.link)}
                </span>
              </div>
              <div className="flex-2 flex flex-row w-full text-xs">
                <div className="flex-1 text-xs text-left  ">
                  <PersonIcon className="p-1" />
                  {trkObj.artist}
                </div>
                <div className="flex-1 text-xs text-right  ">
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
