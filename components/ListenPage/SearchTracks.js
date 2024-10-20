import { useEffect, useMemo, useState, useCallback } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import { IconButton } from "@mui/material";

import { getNameOfTrack, getSecondsFromTimeStamp } from "@/utils/helper_funcs";
import { useSearchStore, useStore } from "@/utils/store.js";
import { SwitchLeft, ToggleOff, ToggleOn } from "@mui/icons-material";

export default function SearchTracks() {
  const searchInput = useSearchStore((state) => state.searchInput);
  const setSearchInput = useSearchStore((state) => state.setSearchInput);
  const [searchType, setSearchType] = useState("Track Name");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 300); // Adjust this delay as needed

    return () => clearTimeout(timer);
  }, [searchInput]);

  function ShowTracks() {
    if (debouncedSearchInput === "") return <></>;
    else if (searchType === "Gurbani") {
      return <DisplayTracksByGurbani searchInput={debouncedSearchInput} />;
    } else if (searchType === "Track Name") {
      return <DisplayTracksByName searchInput={debouncedSearchInput} />;
    } else if (searchType === "First Letter Search") {
      return <DisplayTracksByFirstLetter searchInput={debouncedSearchInput} />;
    }
  }

  return (
    <div className="p-2 flex flex-col">
      <div className="flex ">
        <div className="basis-4/6 flex justify-center ">
          <input
            placeholder={`Search by ${searchType}:`}
            className=" w-full h-[70%] m-1 p-1 rounded-md text-black bg-white"
            value={searchInput}
            onInput={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="basis-2/6 flex ">
          <div className="basis-1/4">
            <IconButton onClick={() => setSearchInput("")}>
              <HighlightOffIcon className="text-white" />
            </IconButton>
          </div>
          <div className="basis-3/4 flex py-2 ">
            <select
              className="text-black p-1 rounded h-5 text-[10px]"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="Gurbani">Gurbani Search</option>
              <option value="Track Name">Track Name Search</option>
              {/* <option value="First Letter Search">First Letter Search</option> */}
            </select>
          </div>
        </div>
      </div>
      <ShowTracks />
    </div>
  );
}

function DisplayTracksByFirstLetter({ searchInput }) {
  const allOpts = useStore((state) => state.allOptsTracks);
  const indexTracks = useStore((state) => state.indexTracks);
  const appendHistory = useStore((state) => state.appendHistory);
  const setTimeToGoTo = useStore((state) => state.setTimeToGoTo);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchInput !== "") {
      const links = [];
      const wordsEntered = searchInput.toLowerCase().split(" ");
      for (const key in indexTracks) {
        const indexes = indexTracks[key];
        for (const i in indexes) {
          const index = indexes[i];
          if (
            wordsEntered.every((word) => {
              return index.description?.toLowerCase().includes(word);
            })
          ) {
            links.push({
              artist: index.artist,
              link: key,
              lineMatched: index.description,
              timestamp: index.timestamp,
            });
            continue;
          }

          if (index.shabadArr === undefined) continue;
          for (const line of index.shabadArr) {
            if (
              wordsEntered.every((word) => line.toLowerCase().includes(word))
            ) {
              links.push({
                artist: index.artist,
                link: key,
                // linkIdx,
                // typeIdx,
                // type,
                lineMatched: line,
                timestamp: index.timestamp,
              });
              continue;
            }
          }
        }
      }
      setResults(links);
    }
  }, [searchInput, allOpts]);

  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <div className="flex flex-row justify-normal">
        <p className="flex-1">{results.length} Results Found</p>
        <IconButton
          className="h-10 w-10 "
          onClick={() => {
            const newRes = [...results.reverse()];
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
              onClick={() => {
                appendHistory(trkObj);
                setTimeToGoTo(getSecondsFromTimeStamp(trkObj.timestamp));
              }}
              className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 "
            >
              <div className="flex w-full text-sm">
                <p className="pl-2 pr-2">{index + 1}.</p>
                <p className="flex-1 text-left w-5/6 truncate break-words">
                  {getNameOfTrack(trkObj.link)}
                </p>
              </div>
              <div className="flex flex-row w-full text-xs">
                {trkObj.lineMatched}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DisplayTracksByGurbani({ searchInput }) {
  const allOpts = useStore((state) => state.allOptsTracks);
  const indexTracks = useStore((state) => state.indexTracks);
  const appendHistory = useStore((state) => state.appendHistory);
  const setTimeToGoTo = useStore((state) => state.setTimeToGoTo);
  const [results, setResults] = useState([]);

  const searchGB = useCallback((searchTerm, allOpts) => {
    const links = [];
    const wordsEntered = searchTerm.toLowerCase().split(" ");
    for (const key in indexTracks) {
      const indexes = indexTracks[key];
      const { typeIdx, linkIdx, type } = getTypeNLink(
        allOpts,
        key,
        indexes[0].artist,
      );
      for (const i in indexes) {
        const index = indexes[i];
        if (
          wordsEntered.every((word) => {
            return index.description?.toLowerCase().includes(word);
          })
        ) {
          links.push({
            lineMatched: index.description,
            timestamp: index.timestamp,

            artist: index.artist,
            link: key,
            linkIdx,
            typeIdx,
            type,
          });
          continue;
        }

        if (index.shabadArr === undefined) continue;
        for (const line of index.shabadArr) {
          if (wordsEntered.every((word) => line.toLowerCase().includes(word))) {
            links.push({
              lineMatched: line,
              timestamp: index.timestamp,

              artist: index.artist,
              link: key,
              linkIdx,
              typeIdx,
              type,
            });
            continue;
          }
        }
      }
    }
    return links;
  }, [indexTracks]);

  useEffect(() => {
    if (searchInput !== "") {
      const results = searchGB(searchInput, allOpts);
      setResults(results);
    } else {
      setResults([]);
    }
  }, [searchInput, allOpts, searchGB]);

  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <div className="flex flex-row justify-normal">
        <p className="flex-1">{results.length} Results Found</p>
        <IconButton
          className="h-10 w-10 "
          onClick={() => {
            const newRes = [...results.reverse()];
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
              onClick={() => {
                appendHistory(trkObj);
                setTimeToGoTo(getSecondsFromTimeStamp(trkObj.timestamp));
              }}
              className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 "
            >
              <div className="flex w-full text-sm">
                <p className="pl-2 pr-2">{index + 1}.</p>
                <p className="flex-1 text-left w-5/6 truncate break-words">
                  {getNameOfTrack(trkObj.link)}
                </p>
              </div>
              <div className="flex flex-row w-full text-xs">
                <div className="basis-3/4 text-xs text-left w-full truncate">
                  {trkObj.lineMatched}
                </div>
                <div className="basis-1/4 text-xs text-right truncate break-words">
                  {trkObj.timestamp}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DisplayTracksByName({ searchInput }) {
  const allOpts = useStore((state) => state.allOptsTracks);
  const appendHistory = useStore((state) => state.appendHistory);
  const [results, setResults] = useState([]);

  const searchTracksByTitle = useCallback((searchTerm, allOpts) => {
    const words = searchTerm.toLowerCase().split(" ");
    const results = [];
    for (const artist in allOpts) {
      for (let typeIdx = 0; typeIdx < allOpts[artist].length; typeIdx++) {
        if (!allOpts[artist][typeIdx].checked) continue;
        const links = allOpts[artist][typeIdx].links;

        for (let linkIdx = 0; linkIdx < links.length; linkIdx++) {
          const link = links[linkIdx].toLowerCase();
          let allWordsFound = true;
          for (const word of words) {
            if (!link.includes(word)) {
              allWordsFound = false;
              break;
            }
          }
          if (allWordsFound) {
            results.push({
              artist,
              typeIdx,
              linkIdx,
              type: allOpts[artist][typeIdx].type,
              link: links[linkIdx], // to get unlowered case
            });
          }
        }
      }
    }
    return results;
  }, []);

  useEffect(() => {
    if (searchInput !== "") {
      const results = searchTracksByTitle(searchInput, allOpts);
      setResults(results);
    } else {
      setResults([]);
    }
  }, [searchInput, allOpts, searchTracksByTitle]);

  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <div className="flex flex-row justify-normal">
        <p className="flex-1">{results.length} Results Found</p>
        <IconButton
          className="h-10 w-10 "
          onClick={() => {
            const newRes = [...results.reverse()];
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

function getTypeNLink(allOpts, link, artist) {
  for (let typeIdx = 0; typeIdx < allOpts[artist].length; typeIdx++) {
    for (
      let linkIdx = 0;
      linkIdx < allOpts[artist][typeIdx].links.length;
      linkIdx++
    ) {
      if (allOpts[artist][typeIdx].links[linkIdx] === link) {
        return { typeIdx, linkIdx, type: allOpts[artist][typeIdx].type };
      }
    }
  }
  // console.log(link.trim(), artist, "FAILEDDD");
  return { typeIdx: -1, linkIdx: -1, type: "" };
}