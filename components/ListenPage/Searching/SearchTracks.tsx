import React, {useEffect, useState, useCallback} from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import {IconButton} from '@mui/material';
import ResultBar from './ResultBar';

import {getNameOfTrack, getSecondsFromTimeStamp} from '@/utils/helper_funcs';
import {useSearchStore, useStore} from '@/utils/store';
import {ArtistOpt, Track} from '@/utils/types';

const MemoizedResultBar = React.memo(ResultBar);

interface GurbaniTrackResult extends Track {
  lineMatched: string;
  timestamp?: string;
}

export default function SearchTracks(): JSX.Element {
  const [searchType, setSearchType] = useState<'Track Name' | 'Gurbani'>('Track Name');
  const setSearchInput = useSearchStore(state => state.setSearchInput);
  const searchInput = useSearchStore(state => state.searchInput);

  function ShowTracks(): JSX.Element {
    if (searchInput === '') return <></>;
    else if (searchType === 'Gurbani') {
      return <DisplayTracksByGurbani searchTerm={searchInput} />;
    } else if (searchType === 'Track Name') {
      return <DisplayTracksByName searchTerm={searchInput} />;
    }
    return <></>;
  }

  return (
    <div className="p-2 flex flex-col">
      <div className="flex ">
        <div className="basis-4/6 flex justify-center ">
          <input
            placeholder={`Search by ${searchType}:`}
            className=" w-full h-[70%] m-1 p-1 rounded-md text-black bg-white"
            value={searchInput}
            onInput={(e: React.FormEvent<HTMLInputElement>) => setSearchInput((e.target as HTMLInputElement).value)}
          />
        </div>
        <div className="basis-2/6 flex ">
          <div className="basis-1/4">
            <IconButton onClick={() => setSearchInput('')}>
              <HighlightOffIcon className="text-white" />
            </IconButton>
          </div>
          <div className="basis-3/4 flex py-2 ">
            <select
              className="text-black p-1 rounded h-5 text-[10px]"
              value={searchType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSearchType(e.target.value as 'Track Name' | 'Gurbani')
              }>
              <option value="Gurbani">Gurbani Search</option>
              <option value="Track Name">Track Name Search</option>
            </select>
          </div>
        </div>
      </div>
      <ShowTracks />
    </div>
  );
}

function DisplayTracksByName({searchTerm}: {searchTerm: string}): JSX.Element {
  const allOpts = useStore(state => state.allOptsTracks);
  const appendHistory = useStore(state => state.appendHistory);
  const [results, setResults] = useState<Track[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const words = searchTerm.toLowerCase().split(' ');
      const searchResults: Track[] = [];

      for (const artist of allOpts) {
        for (let typeIdx = 0; typeIdx < artist.track_groups.length; typeIdx++) {
          const track_group = artist.track_groups[typeIdx];
          if (!track_group.checked) continue;
          const links = track_group.links;

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
              searchResults.push({
                artist_name: artist.artist_name,
                typeIdx,
                linkIdx,
                type: track_group.type,
                link: links[linkIdx], // to get unlowered case
              });
            }
          }
        }
      }
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchTerm, allOpts]);

  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <div className="flex flex-row justify-normal">
        <p className="flex-1">{results.length} Results Found</p>
        <IconButton
          className="h-10 w-10 "
          onClick={() => {
            const newRes = [...results].reverse();
            setResults(newRes);
          }}>
          <FlipCameraAndroidIcon className="text-white" />
        </IconButton>
      </div>
      <div className="overflow-y-auto h-48">
        {results.map((trkObj, index) => (
          <MemoizedResultBar
            key={index}
            onClick={() => appendHistory(trkObj)}
            liNum={index + 1}
            title={getNameOfTrack(trkObj.link)}
            bottomLeftTxt={trkObj.artist_name}
            bottomRightTxt={trkObj.type}
          />
        ))}
      </div>
    </div>
  );
}

function DisplayTracksByGurbani({searchTerm}: {searchTerm: string}): JSX.Element {
  const allOpts = useStore(state => state.allOptsTracks);
  const indexTracks = useStore(state => state.indexTracks);
  const appendHistory = useStore(state => state.appendHistory);
  const setTimeToGoTo = useStore(state => state.setTimeToGoTo);
  const [results, setResults] = useState<GurbaniTrackResult[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const wordsEntered = searchTerm.toLowerCase().split(' ');
      const searchResults: GurbaniTrackResult[] = [];

      for (const key in indexTracks) {
        const indexes = indexTracks[key];
        const {typeIdx, linkIdx, type} = getTypeNLink(allOpts, key, indexes[0].artist);

        for (const i in indexes) {
          const index = indexes[i];

          if (
            wordsEntered.every(word => {
              return index.description?.toLowerCase().includes(word);
            })
          ) {
            searchResults.push({
              lineMatched: index.description || '',
              timestamp: index.timestamp,
              artist_name: index.artist,
              link: key,
              linkIdx,
              typeIdx,
              type,
            });
            continue;
          }

          if (index.shabadArr === undefined) continue;
          for (const line of index.shabadArr) {
            if (wordsEntered.every(word => line.toLowerCase().includes(word))) {
              searchResults.push({
                lineMatched: line,
                timestamp: index.timestamp,
                artist_name: index.artist,
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
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchTerm, allOpts, indexTracks]);

  const handleTrackClick = useCallback(
    (trkObj: GurbaniTrackResult) => {
      appendHistory(trkObj);
      setTimeToGoTo(getSecondsFromTimeStamp(trkObj.timestamp));
    },
    [appendHistory, setTimeToGoTo],
  );

  const handleReverseResults = useCallback(() => {
    setResults(prev => [...prev].reverse());
  }, []);

  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <div className="flex flex-row justify-normal">
        <p className="flex-1">{`${results.length} Results Found`}</p>
        <IconButton className="h-10 w-10" onClick={handleReverseResults}>
          <FlipCameraAndroidIcon className="text-white" />
        </IconButton>
      </div>
      <div className="overflow-y-auto h-48">
        {results.slice(0, 100).map((trkObj, index) => (
          <MemoizedResultBar
            key={`${trkObj.link}-${index}`}
            onClick={() => handleTrackClick(trkObj)}
            liNum={index + 1}
            title={getNameOfTrack(trkObj.link)}
            bottomLeftTxt={trkObj.lineMatched}
            bottomRightTxt={trkObj.timestamp}
          />
        ))}
      </div>
    </div>
  );
}

function getTypeNLink(
  allOpts: ArtistOpt[],
  link: string,
  artist: string,
): {typeIdx: number; linkIdx: number; type: string} {
  const artistIdx = allOpts.findIndex(a => a.artist_name === artist);
  if (artistIdx === -1) return {typeIdx: -1, linkIdx: -1, type: ''};
  for (let typeIdx = 0; typeIdx < allOpts[artistIdx].track_groups.length; typeIdx++) {
    for (let linkIdx = 0; linkIdx < allOpts[artistIdx].track_groups[typeIdx].links.length; linkIdx++) {
      if (allOpts[artistIdx].track_groups[typeIdx].links[linkIdx] === link) {
        return {typeIdx, linkIdx, type: allOpts[artistIdx].track_groups[typeIdx].type};
      }
    }
  }
  return {typeIdx: -1, linkIdx: -1, type: ''};
}
