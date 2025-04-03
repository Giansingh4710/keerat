'use client';

import axios from 'axios';
import NavBar from '@/components/NavBar';
import {Suspense, useEffect, useMemo, useRef, useState} from 'react';
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
import {Track} from '@/utils/types';

interface TopButtonsProps {
  setCurrTrkLst: React.Dispatch<React.SetStateAction<Track[]>>;
}

interface SearchBarProps {
  setCurrTrkLst: React.Dispatch<React.SetStateAction<Track[]>>;
  allTracks: Track[];
}

interface SelectInputsProps {
  setCurrTrkLst: React.Dispatch<React.SetStateAction<Track[]>>;
  allTracks: Track[];
  allTypes: string[];
  allArtists: string[];
}

interface BarRowProps {
  trkObj: Track;
  setCurrTrk: React.Dispatch<React.SetStateAction<Track | null>>;
}

interface TrackPlayerProps {
  currTrk: Track | null;
  closePlayer: () => void;
}

export default function SGGS(): JSX.Element {
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [allArtists, setAllKeertanis] = useState<string[]>([]);
  const [allTypes, setAllTypes] = useState<string[]>([]);

  const [currTrkLst, setCurrTrkLst] = useState<Track[]>([]);
  const [currTrk, setCurrTrk] = useState<Track | null>(null);

  useEffect(() => {
    const {GET_INDEXED_TRACKS_URL} = getUrls();
    console.log({GET_INDEXED_TRACKS_URL});
    axios({
      url: GET_INDEXED_TRACKS_URL,
      method: 'GET',
    })
      .then(res => {
        const lst = res.data.reverse();
        setAllTracks(lst);
        setCurrTrkLst(lst);

        const types = ['All'];
        const keertanis = ['All'];
        lst.forEach((trk: Track) => {
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
      <TrackPlayer currTrk={currTrk} closePlayer={() => setCurrTrk(null)} />
      <Suspense fallback={<p>Loading...</p>}>
        <p>{currTrkLst.length}: Tracks</p>
        <div className="flex flex-col gap-1 p-10">
          {currTrkLst.map((trkObj, idx) => (
            <BarRow trkObj={trkObj} key={idx} setCurrTrk={setCurrTrk} />
          ))}
        </div>
      </Suspense>
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

function BarRow({trkObj, setCurrTrk}: BarRowProps): JSX.Element {
  return (
    <details className="flex flex-col rounded-md w-full border-b border-gray-200 hover:bg-blue-100 text-xl p-2">
      <summary className="flex w-full text-sm">
        <p className="pl-2 pr-2">{trkObj.artist}</p>
        <p className="flex-1 text-left w-5/6 truncate break-words">{getNameOfTrack(trkObj.link)}</p>
      </summary>
      <div className="flex flex-row w-full text-xs">
        <div className="basis-3/4 text-xs text-left w-full">{trkObj.description}</div>
        <div className="basis-1/4 text-xs text-right truncate break-words">{trkObj.type}</div>
      </div>
      <div className="flex flex-row w-full text-xs">
        <div className="basis-3/4 text-xs text-left w-full">{trkObj.shabadArr?.join('\n')}</div>
        <div className="basis-1/4 text-xs text-right truncate break-words">
          {getDateFromUnixTime(parseInt(trkObj.timestamp || '0'))}
        </div>
      </div>
      <div className="flex flex-row w-full text-xs">
        <div className="basis-3/4 text-xs text-left w-full">
          <button
            onClick={() => {
              setCurrTrk(trkObj);
            }}
            className="text-blue-500 hover:text-blue-700">
            Play
          </button>
        </div>
        <div className="basis-1/4 text-xs text-right truncate break-words">
          <button
            onClick={() => {
              const link = getLinkToKeerat(trkObj.link, getSecondsFromTimeStamp(trkObj.timestamp || '0'));
              if (link) {
                copyLocalLink(link, getSecondsFromTimeStamp(trkObj.timestamp || '0'));
                toast.success('Link copied to clipboard!');
              }
            }}
            className="text-blue-500 hover:text-blue-700">
            Copy Link
          </button>
        </div>
      </div>
    </details>
  );
}

function TrackPlayer({currTrk, closePlayer}: TrackPlayerProps): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const setTimeToGoTo = useStore(state => state.setTimeToGoTo);
  if (!currTrk) return <></>;

  const timestampInSecs = getSecondsFromTimeStamp(currTrk.timestamp || '0');
  setTimeToGoTo(timestampInSecs);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-200 p-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex-1">
            <p className="text-sm">{currTrk.artist}</p>
            <p className="text-sm">{getNameOfTrack(currTrk.link)}</p>
          </div>
          <IconButton onClick={closePlayer}>
            <CancelIcon className="text-white" />
          </IconButton>
        </div>
        <AudioPlayer link={currTrk.link} audioRef={audioRef} />
      </div>
    </div>
  );
}

function getDateFromUnixTime(unixTimeStamp: number): string {
  const date = new Date(unixTimeStamp * 1000);
  return date.toLocaleDateString();
}

function copyLocalLink(link: string, timestampInSecs: number): void {
  navigator.clipboard.writeText(link);
}
