'use client';

import axios from 'axios';
import NavBar from '@/components/NavBar';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {getNameOfTrack} from '@/utils/helper_funcs';
import {IconButton} from '@mui/material';
import getUrls from '@/utils/get_urls';
import AudioPlayer from '@/components/AudioPlayer';
import {getSecondsFromTimeStamp} from '@/utils/helper_funcs';
import {useStore} from '@/utils/store';
import {PlayPauseBtn, PlayBackButtons} from '@/components/commonComps';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import toast, {Toaster} from 'react-hot-toast';
import {getLinkToKeerat} from './copyFunc';
import {IndexedTrack} from '@/utils/types';

interface TopButtonsProps {
  setCurrTrkLst: React.Dispatch<React.SetStateAction<IndexedTrack[]>>;
}

interface SearchBarProps {
  setCurrTrkLst: React.Dispatch<React.SetStateAction<IndexedTrack[]>>;
  allTracks: IndexedTrack[];
}

interface SelectInputsProps {
  setCurrTrkLst: React.Dispatch<React.SetStateAction<IndexedTrack[]>>;
  allTracks: IndexedTrack[];
  allTypes: string[];
  allArtists: string[];
}

export default function SGGS(): JSX.Element {
  const [allTracks, setAllTracks] = useState<IndexedTrack[]>([]);
  const [allArtists, setAllKeertanis] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);

  const [currTrkLst, setCurrTrkLst] = useState<IndexedTrack[]>([]);
  const [currTrk, setCurrTrk] = useState<IndexedTrack | null>(null);

  useEffect(() => {
    const {GET_INDEXED_TRACKS_URL} = getUrls();
    axios({
      url: GET_INDEXED_TRACKS_URL,
      method: 'GET',
    })
      .then((res) => {
        const lst: IndexedTrack[] = res.data.reverse();
        setAllTracks(lst);
        setCurrTrkLst(lst);

        const types = ['All'];
        const keertanis = ['All'];
        lst.forEach((trk: IndexedTrack) => {
          if (!types.includes(trk.type)) {
            types.push(trk.type);
          }
          if (!keertanis.includes(trk.artist)) {
            keertanis.push(trk.artist);
          }
        });
        setAllTypes(types);
        setAllKeertanis(keertanis);
      })
      .catch(err => {
        console.log(err.response);
      });
  }, []);

  return (
    <body className="w-full h-full bg-primary-100 text-white">
      <Toaster position="top-left" reverseOrder={true} />
      <NavBar title="Track Index" />
      <SearchBar setCurrTrkLst={setCurrTrkLst} allTracks={allTracks} />

      <SelectInputs setCurrTrkLst={setCurrTrkLst} allTracks={allTracks} allTypes={allTypes} allArtists={allArtists} />
      <TopButtons setCurrTrkLst={setCurrTrkLst} />
      {currTrk && <TrackPlayer currTrk={currTrk} closePlayer={() => setCurrTrk(null)} />}

      <div>
        {currTrkLst.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>{currTrkLst.length}: Tracks</p>
            <div className="flex flex-col gap-1 p-10">
              {currTrkLst.map((trkObj, idx) => (
                <BarRow trkObj={trkObj} key={idx} setCurrTrk={setCurrTrk} />
              ))}
            </div>
          </>
        )}
      </div>
    </body>
  );
}

function TopButtons({setCurrTrkLst}: TopButtonsProps): JSX.Element {
  const [ascend, setAscend] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <div className="flex flex-row gap-2 p-2 justify-center">
      <IconButton
        onClick={() => {
          setCurrTrkLst(prev => {
            const newLst = prev.reverse();
            return [...newLst];
          });
          setAscend(!ascend);
        }}>
        <div className="flex-1 rounded bg-btn text-white text-sm p-1">Show {ascend ? 'Oldest' : 'Newest'}</div>
      </IconButton>
      <IconButton
        onClick={() => {
          const detailsElements = document.getElementsByTagName('details');
          for (let i = 0; i < detailsElements.length; i++) {
            const details = detailsElements[i];
            details.open = !details.open;
          }
          setDetailsOpen(!detailsOpen);
        }}>
        <div className="flex-1 rounded bg-btn text-white text-sm p-1">{detailsOpen ? 'Hide' : 'Show'} Details</div>
      </IconButton>
    </div>
  );
}

function SearchBar({setCurrTrkLst, allTracks}: SearchBarProps): JSX.Element {
  const [searchStr, setSearchStr] = useState('');
  return (
    <div className="flex flex-row gap-2 p-3 items-center ">
      <input
        className="flex-1 rounded px-2 text-black"
        type="text"
        placeholder="Search: "
        value={searchStr}
        onChange={e => setSearchStr(e.target.value)}
      />
      <IconButton
        onClick={() => {
          if (searchStr === '') {
            setCurrTrkLst(allTracks);
            return;
          }
          const wordsEntered = searchStr.toLowerCase().split(' ');
          const filterdTracks = allTracks.filter(trk => {
            if (
              wordsEntered.every(word => {
                return trk.description?.toLowerCase().includes(word);
              })
            ) {
              return true;
            }

            const fullShabad = trk.shabadArr?.join('\n').toLowerCase() || '';
            if (
              wordsEntered.every(word => {
                if (trk.shabadArr === undefined) {
                  return false;
                }
                return fullShabad.includes(word);
              })
            ) {
              return true;
            }
            return false;
          });
          setCurrTrkLst(filterdTracks);
        }}>
        <div className="flex">
          <p className="flex-1 text-xs p-1 h-7 rounded bg-btn text-white">
            <SearchIcon />
          </p>
        </div>
      </IconButton>
      <IconButton
        onClick={() => {
          setSearchStr('');
          setCurrTrkLst(allTracks);
        }}>
        <div className="flex">
          <p className="flex-1 text-xs p-1 h-7 rounded bg-btn text-white">
            <CancelIcon />
          </p>
        </div>
      </IconButton>
    </div>
  );
}

function SelectInputs({setCurrTrkLst, allTracks, allTypes, allArtists}: SelectInputsProps): JSX.Element {
  const [currType, setCurrType] = useState('All');
  const [currArtist, setCurrArtist] = useState('All');
  return (
    <div>
      <div className="flex flex-row items-center p-1 gap-5">
        <label>Filter by Artist:</label>
        <select
          className="text-black p-1 rounded"
          value={currArtist}
          onChange={e => {
            const artist = e.target.value;

            let filteredTracks = allTracks;
            if (artist !== 'All') {
              filteredTracks = filteredTracks.filter(trk => {
                return trk.artist === artist;
              });
            }
            if (currType !== 'All') {
              filteredTracks = filteredTracks.filter(trk => {
                return trk.type === currType;
              });
            }
            setCurrArtist(artist);
            setCurrTrkLst(filteredTracks);
          }}>
          {allArtists.map(keertani => {
            return (
              <option key={keertani} value={keertani}>
                {keertani}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex flex-row items-center p-1 gap-5">
        <label>Filter by Type:</label>
        <select
          className="text-black p-1 rounded"
          value={currType}
          onChange={e => {
            const type = e.target.value;

            let filteredTracks = allTracks;
            if (type !== 'All') {
              filteredTracks = filteredTracks.filter(trk => {
                return trk.type === type;
              });
            }

            if (currArtist !== 'All') {
              filteredTracks = filteredTracks.filter(trk => {
                return trk.artist === currArtist;
              });
            }
            setCurrType(type);
            setCurrTrkLst(filteredTracks);
          }}>
          {allTypes.map(type => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

function BarRow({
  trkObj,
  setCurrTrk,
}: {
  trkObj: IndexedTrack;
  setCurrTrk: React.Dispatch<React.SetStateAction<IndexedTrack | null>>;
}): JSX.Element {
  return (
    <div className="flex-1 w-full border border-gray-200 rounded text-white">
      <div className="flex flex-row">
        <p className="text-left px-1 m-1 rounded border">#{trkObj.ID}</p>
        <p className="flex-1 flex items-center justify-center">{trkObj.artist}</p>
      </div>
      <p className="flex bg-gray-800">{trkObj.description}</p>
      <div className="flex flex-col gap-2 p-2">
        <p className="flex-1 text-left">Type: {trkObj.type}</p>
        <p className="flex-1 text-left">Added: {getDateFromUnixTime(trkObj.created)}</p>
        <p className="flex-1 text-left">Time Stamp: {trkObj.timestamp}</p>

        <IconButton onClick={() => copyLocalLink(trkObj.link, getSecondsFromTimeStamp(trkObj.timestamp || '0'))}>
          <p className="flex-1 text-sm rounded bg-btn break-all text-white">Copy Link</p>
        </IconButton>
        <IconButton
          onClick={() => {
            setCurrTrk(trkObj);
          }}>
          <p className="flex-1 text-sm rounded bg-btn break-all text-white">{getNameOfTrack(trkObj.link)}</p>
        </IconButton>
        <details>
          <summary>Shabad ID {trkObj.shabadID}</summary>
          {trkObj.shabadArr?.map((shabad, idx) => <p key={idx}>{shabad}</p>)}
        </details>
      </div>
    </div>
  );
}

function TrackPlayer({currTrk, closePlayer}: {currTrk: IndexedTrack; closePlayer: () => void}): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  // const setTimeToGoTo = useStore(state => state.setTimeToGoTo);
  const timestampInSecs = getSecondsFromTimeStamp(currTrk.timestamp || '0');

  useEffect(() => {
    // setTimeToGoTo(timestampInSecs);
  }, []);

  return (
    <div className="flex-1 w-full bg-primary-200 rounded">
      <div className="flex flex-row gap-3 h-10">
        <p className="w-15 text-left px-1 m-1 rounded border">#{currTrk.ID}</p>
        <p className="w-80 flex items-center justify-center">{currTrk.artist}</p>
        <p className="w-10 flex items-center justify-center">
          <IconButton onClick={closePlayer}>
            <CancelIcon />
          </IconButton>
        </p>
      </div>
      <div className="flex flex-col m-1 p-1 bg-secondary-200 rounded">
        <p className="w-full text-left">Description:</p>
        <p className="w-full text-left max-h-20 overflow-auto">{currTrk.description}</p>
      </div>
      <div className="flex flex-col m-1 p-1 bg-secondary-200 rounded">
        <a className="w-full text-left underline" href={currTrk.link} target="_blank">
          Track: {getNameOfTrack(currTrk.link)}
        </a>
        <p className="w-full text-left">Type: {currTrk.type}</p>
        <div className="w-full text-left flex">
          <p>Time Stamp:</p>
          <IconButton
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = timestampInSecs;
              }
            }}>
            <p className="text-xs bg-btn rounded">{currTrk.timestamp}</p>
          </IconButton>
        </div>
        <p className="w-full text-left">Added: {getDateFromUnixTime(currTrk.created)}</p>
        <details className="w-full text-left">
          <summary>Shabad ID: {currTrk.shabadID}</summary>
          <div className="border rounded max-h-24 overflow-auto">
            {currTrk.shabadArr?.map((shabad, idx) => <p key={idx}>{shabad}</p>)}
          </div>
        </details>

        <div className="w-full text-left flex">
          <IconButton onClick={() => copyLocalLink(currTrk.link, timestampInSecs)}>
            <p className="text-xs bg-btn rounded p-1">Copy Link</p>
          </IconButton>
        </div>
      </div>
      <div>
        <AudioPlayer link={currTrk.link} audioRef={audioRef} />
        <div className="flex justify-center">
          <PlayBackButtons
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime -= 10;
              }
            }}
            imgSrc={'/playbackImgs/skip-back.svg'}
          />
          <PlayPauseBtn audioRef={audioRef} />
          <PlayBackButtons
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime += 10;
              }
            }}
            imgSrc={'/playbackImgs/skip-forward.svg'}
          />
        </div>
      </div>
    </div>
  );
}

function getDateFromUnixTime(unixTimeStamp: string): string {
  const unixTime = Number(unixTimeStamp);
  if (isNaN(unixTime)) {
    return 'N/A';
  }
  const date = new Date(unixTime * 1000);
  return date.toLocaleString();
}

function copyLocalLink(link: string, timestampInSecs: number): void {
  const localLink = getLinkToKeerat(link, timestampInSecs);
  if (!localLink) {
    toast.error('Link not found!!!');
    return;
  }
  navigator.clipboard.writeText(localLink);
  toast.success('Link copied to clipboard');
}
