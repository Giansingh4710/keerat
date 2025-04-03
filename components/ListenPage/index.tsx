'use client';

import NavBar from '@/components/NavBar';
import TrackPlayback from './TrackPlayback';
import SearchTracks from './Searching/SearchTracks';
import ShabadsForTrack from './ShabadsForTrack';
import IndexTrackBtnAndModal from './Modals/IndexTrackModal/index';
import {useEffect, useMemo, useRef, useState} from 'react';
import {
  getLinkFromOldUrlDate,
  getNameOfTrack,
  getObjFromUrl,
  getSecondsFromTimeStamp,
  validTrackObj,
  secondsToHMS,
} from '@/utils/helper_funcs';
import toast, {Toaster} from 'react-hot-toast';
import {useModalStore, useSearchStore, useStore} from '@/utils/store';
import getUrls from '@/utils/get_urls';
import axios from 'axios';
import {
  ViewHistoryModal,
  ViewTracksInQueueModal,
  ListOfArtistsModal,
  ListOfTypesModal,
  ListOfTracksByType,
} from './Modals/smallModals';
import {IconButton, Modal} from '@mui/material';

interface ListenPageProps {
  title: string;
  allTheOpts: Record<string, any[]>;
}

interface BottomBtnProps {
  setter: (value: boolean) => void;
  text: string;
}

interface TrackData {
  type: string;
  artist: string;
  link: string;
  [key: string]: any;
}

export default function ListenPage({title, allTheOpts}: ListenPageProps): JSX.Element {
  const prevTrack = useStore((state: any) => state.prevTrack);
  const nextTrack = useStore((state: any) => state.nextTrack);
  const setShuffle = useStore((state: any) => state.setShuffle);
  const setHistory = useStore((state: any) => state.setHistory);
  const setCheckedType = useStore((state: any) => state.setCheckedType);
  const setCheckedForAllArtists = useStore((state: any) => state.setCheckedForAllArtists);
  const history = useStore((state: any) => state.history);
  const hstIdx = useStore((state: any) => state.hstIdx);
  const setTracks = useStore((state: any) => state.setTracks);
  const setSearchInput = useSearchStore((state: any) => state.setSearchInput);
  const setTitle = useStore((state: any) => state.setTitle);

  const setTimeToGoTo = useStore((state: any) => state.setTimeToGoTo);
  const setIndexTracks = useStore((state: any) => state.setIndexTracks);
  const skipTime = useStore((state: any) => state.skipTime);
  const audioRef = useRef<HTMLAudioElement>(null);

  const setShowArtists = useModalStore((state: any) => state.setShowArtists);
  const setViewHistory = useModalStore((state: any) => state.setViewHistory);
  const setViewAllTracks = useModalStore((state: any) => state.setViewAllTracks);

  useMemo(() => {
    setTitle(title);
    setTracks(allTheOpts);
  }, []);

  useEffect(() => {
    const currTrackData = history[hstIdx];
    if (validTrackObj(currTrackData)) {
      localStorage.setItem(`LastPlayed: ${title}`, JSON.stringify(currTrackData));
      saveTime();
      navigatorStuff();
    }
  }, [hstIdx]);

  useEffect(() => {
    function urlStuff(): boolean {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.size === 0) return false;

      const timeParam = urlParams.get('time');
      if (timeParam) {
        const timeInS = getSecondsFromTimeStamp(timeParam);
        toast.success(`Starting From: ${secondsToHMS(timeInS)}`, {
          duration: 5000,
        });
        setTimeToGoTo(timeInS);
      }

      const urlSearch = urlParams.get('search');
      if (urlSearch) {
        setSearchInput(urlSearch);
        return true;
      }
      const theUrl = urlParams.get('url');
      if (theUrl) {
        const trkObj = getObjFromUrl(theUrl, allTheOpts);
        if (validTrackObj(trkObj)) {
          toast.success('Track Playing from URL', {duration: 3000});
          setHistory([trkObj]);

          setTimeout(() => {
            window.history.replaceState(null, '', window.location.pathname);
          }, 0);

          return true;
        }
      } else {
        const artist = urlParams.get('artist');
        const trackIndex = urlParams.get('trackIndex');
        if (artist && trackIndex) {
          const url = getLinkFromOldUrlDate(artist, parseInt(trackIndex, 10), allTheOpts);
          const trkObj = getObjFromUrl(url, allTheOpts);
          if (validTrackObj(trkObj)) {
            toast('Old copied link', {duration: 3000});
            setHistory([trkObj]);
            return true;
          }
        }
      }
      return false;
    }

    function getLastPlayedTrackLocalStorage(): boolean {
      try {
        const strData = localStorage.getItem(`LastPlayed: ${title}`);
        if (!strData) return false;
        const trkObj = JSON.parse(strData);
        if (!validTrackObj(trkObj)) {
          throw new Error('Invalid track object from local storage');
        }
        setHistory([trkObj]);
        const localStorageTime = localStorage.getItem(`LastTime: ${title}`);
        if (localStorageTime) {
          const timeInS = getSecondsFromTimeStamp(localStorageTime);
          setTimeToGoTo(timeInS);
        }
        return true;
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
        }
        return false;
      }
    }

    function getLocalStorage(): void {
      if (localStorage.getItem('shuffle') === 'true') setShuffle(true);

      const checkedTracksStr = localStorage.getItem(`Checked: ${title}`);
      if (checkedTracksStr) {
        const checkedTracks = JSON.parse(checkedTracksStr);
        setCheckedForAllArtists(false);

        Object.keys(allTheOpts).forEach(artist => {
          const validTypes = checkedTracks[artist];
          if (!validTypes) return;
          allTheOpts[artist].forEach((linksType, idx) => {
            if (validTypes.includes(linksType.type)) {
              setCheckedType(artist, idx, true);
            }
          });
        });
      }
    }

    getLocalStorage();
    if (!urlStuff()) {
      if (!getLastPlayedTrackLocalStorage()) {
        nextTrack();
      }
    }
  }, []);

  useEffect(() => {
    const {GET_INDEXED_TRACKS_BY_ARTISTS_URL} = getUrls();
    const artists = JSON.stringify(Object.keys(allTheOpts));
    const encodedArtists = encodeURIComponent(artists);
    const link = `${GET_INDEXED_TRACKS_BY_ARTISTS_URL}${encodedArtists}`;
    axios({
      url: link,
      method: 'GET',
    })
      .then(res => {
        setIndexTracks(res.data);
      })
      .catch(err => {
        console.log('URL: ' + link);
        console.log(err.response);
      });
  }, []);

  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) return <body />;

  function navigatorStuff(): void {
    if (!('mediaSession' in navigator)) {
      toast.error('Media Session API not supported', {duration: 5000});
      return;
    }

    if (!audioRef.current) return;

    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());

    navigator.mediaSession.setActionHandler('seekforward', () => {
      if (audioRef.current) audioRef.current.currentTime += skipTime;
    });
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      if (audioRef.current) audioRef.current.currentTime += skipTime * -1;
    });
    navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack);

    navigator.mediaSession.setActionHandler('seekto', function (event) {
      if (audioRef.current && event.seekTime) {
        audioRef.current.currentTime = event.seekTime;
      }
    });

    let album = history[hstIdx].type;
    album = album === 'main' || album === 'other' ? title : album;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: getNameOfTrack(history[hstIdx].link),
      artist: history[hstIdx].artist,
      album: album,
      artwork: [{src: '/logos/ios/1024.png', sizes: '1024x1024', type: 'image/png'}],
    });
  }

  function saveTime(): void {
    if (!audioRef.current) return;
    const currentTime = audioRef.current.currentTime;
    const timeToSave = typeof currentTime === 'number' ? currentTime : 0;
    localStorage.setItem(`LastTime: ${title}`, timeToSave.toString());
  }

  return (
    <body className="w-full h-full bg-primary-100">
      <Toaster position="top-left" reverseOrder={true} />
      <NavBar title={title} />
      <SearchTracks />
      <TrackPlayback audioRef={audioRef} />
      <div className="flex flex-row justify-center flex-wrap">
        <IndexTrackBtnAndModal audioRef={audioRef} saveTimeFunc={saveTime} />
        <BottomBtn setter={setShowArtists} text="Open Artist Options" />
        <BottomBtn setter={setViewHistory} text="View History" />
      </div>
      <ShabadsForTrack audioRef={audioRef} />

      <div id="all_modals">
        <ViewHistoryModal />
        <ViewTracksInQueueModal />
        <ListOfArtistsModal />
        <ListOfTypesModal />
        <ListOfTracksByType />
      </div>
    </body>
  );
}

function BottomBtn({setter, text}: BottomBtnProps): JSX.Element {
  return (
    <IconButton onClick={() => setter(true)}>
      <div className="m-1 p-2 text-xs rounded bg-btn">{text}</div>
    </IconButton>
  );
}
