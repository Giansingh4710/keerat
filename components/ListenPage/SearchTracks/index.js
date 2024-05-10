import { useMemo } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { getNameOfTrack, searchTracks } from "@/utils/helper_funcs";
import { useSearchStore, useStore } from "@/utils/store.js";

export default function SearchTracks() {
  const searchInput = useSearchStore((state) => state.searchInput);
  const setSearchInput = useSearchStore((state) => state.setSearchInput);

  const showTracks = useMemo(() => <DisplayTracks />, [searchInput]);

  return (
    <div className="pt-10 ">
      <div className="pb-2 flex align-middle">
        <input
          placeholder="Search for Track:"
          className="flex-1 ml-4 h-10 rounded-md text-black p-2 bg-white align-middle"
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        <HighlightOffIcon
          className="text-white m-2"
          onClick={() => setSearchInput("")}
        />
      </div>
      {showTracks}
    </div>
  );
}

function DisplayTracks() {
  const allOpts = useStore((state) => state.allOptsTracks);
  const appendHistory = useStore((state) => state.appendHistory);
  const searchInput = useSearchStore((state) => state.searchInput);
  if (searchInput === "") return <></>;
  const results = searchTracks(searchInput, allOpts);
  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <p>{results.length} Results Found</p>
      <div className="overflow-auto h-48">
        {results.map((trkObj, index) => {
          return (
            <button
              key={index}
              onClick={() => appendHistory(trkObj)}
              className="flex flex-row rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 "
            >
              <span className="pl-2 pr-2">{index + 1}.</span>
              <span className="flex-1 text-left truncate hover:text-clip">
                {getNameOfTrack(trkObj.link)}
              </span>
              <div className="flex-2 flex flex-col truncate hover:text-clip">
                <span className="flex-1 text-xs text-left  ">
                  {trkObj.artist}
                </span>
                <span className="flex-1 text-xs text-left  ">
                  {trkObj.type}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
