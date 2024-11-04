import React, {useEffect, useState, useRef, useCallback} from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
import AlbumIcon from '@mui/icons-material/Album';
import PersonIcon from '@mui/icons-material/Person';
import {IconButton} from '@mui/material';
import ResultBar from './ResultBar';

import {getNameOfTrack, getSecondsFromTimeStamp} from '@/utils/helper_funcs';
import {useSearchStore, useStore} from '@/utils/store.js';

const MemoizedResultBar = React.memo(ResultBar);

export default function SearchTracks() {
  const [searchType, setSearchType] = useState('Track Name');
  const setSearchInput = useSearchStore(state => state.setSearchInput);
  const searchInput = useSearchStore(state => state.searchInput);

  const gurbaniWorkerRef = useRef(null);
  const trackNameWorkerRef = useRef(null);
  useEffect(() => {
    gurbaniWorkerRef.current = new Worker(new URL('./searchIndexedTracksWorker.js', import.meta.url));
    trackNameWorkerRef.current = new Worker(new URL('./searchTracksByNameWorker.js', import.meta.url));
    return () => {
      // Cleanup workers when component unmounts
      gurbaniWorkerRef.current?.terminate();
      trackNameWorkerRef.current?.terminate();
    };
  }, []);

  function ShowTracks() {
    if (searchInput === '') return <></>;
    else if (searchType === 'Gurbani') {
      return <DisplayTracksByGurbani searchTerm={searchInput} workerRef={gurbaniWorkerRef} />;
    } else if (searchType === 'Track Name') {
      return <DisplayTracksByName searchTerm={searchInput} workerRef={trackNameWorkerRef} />;
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
            onInput={e => setSearchInput(e.target.value)}
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
              onChange={e => setSearchType(e.target.value)}>
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

function DisplayTracksByName({searchTerm, workerRef}) {
  const allOpts = useStore(state => state.allOptsTracks);
  const appendHistory = useStore(state => state.appendHistory);
  const [results, setResults] = useState([]);

  useEffect(() => {
    workerRef.current.onmessage = e => setResults(e.data);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      workerRef.current.postMessage({searchTerm: searchTerm, allOpts: allOpts}); // will run self.onmessage in worker file
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
            const newRes = [...results.reverse()];
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
            bottomLeftTxt={trkObj.artist}
            bottomRightTxt={trkObj.type}
          />
        ))}
      </div>
    </div>
  );
}

function DisplayTracksByGurbani({searchTerm, workerRef}) {
  const allOpts = useStore(state => state.allOptsTracks);
  const indexTracks = useStore(state => state.indexTracks);
  const appendHistory = useStore(state => state.appendHistory);
  const setTimeToGoTo = useStore(state => state.setTimeToGoTo);
  const [results, setResults] = useState([]);

  useEffect(() => {
    workerRef.current.onmessage = e => setResults(e.data);
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      workerRef.current.postMessage({searchTerm: searchTerm, allOpts, indexTracks});
    } else {
      setResults([]);
    }
  }, [searchTerm, allOpts, indexTracks]);

  const handleTrackClick = useCallback(
    trkObj => {
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
