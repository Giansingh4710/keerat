"use client";

import NavBar from "../NavBar/index.js";
import ArtistsOptions from "./ArtistsOptions/index.js";
import TrackPlayback from "./TrackPlayback/index.js";
import SearchTracks from "./SearchTracks/index.js";
import IndexTrackBtnAndModal from "./IndexTrackModal/index.js";
import ShabadsForTrack from "./ShabadsForTrack/index.js";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLinkFromOldUrlDate,
  getNameOfTrack,
  getObjFromUrl,
  getSecondsFromTimeStamp,
  validTrackObj,
  secondsToHMS,
} from "@/utils/helper_funcs.js";
import toast, { Toaster } from "react-hot-toast";
import { useSearchStore, useStore } from "@/utils/store.js";
import getUrls from "@/utils/get_urls";
import axios from "axios";
import { Modal } from "@mui/material";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PersonIcon from "@mui/icons-material/Person";
import AlbumIcon from "@mui/icons-material/Album";
import Tooltip from "@mui/material/Tooltip";
import { Info } from "@mui/icons-material";

export default function ListenPage({ title, allTheOpts, changesOpts }) {
  const prevTrack = useStore((state) => state.prevTrack);
  const nextTrack = useStore((state) => state.nextTrack);
  const setShuffle = useStore((state) => state.setShuffle);
  const setHistory = useStore((state) => state.setHistory);
  const setCheckedType = useStore((state) => state.setCheckedType);
  const setCheckedForAllArtists = useStore(
    (state) => state.setCheckedForAllArtists,
  );
  const history = useStore((state) => state.history);
  const hstIdx = useStore((state) => state.hstIdx);
  const setTracks = useStore((state) => state.setTracks);
  const setSearchInput = useSearchStore((state) => state.setSearchInput);
  const setTitle = useStore((state) => state.setTitle);

  const setTimeToGoTo = useStore((state) => state.setTimeToGoTo);
  const setIndexTracks = useStore((state) => state.setIndexTracks);
  const skipTime = useStore((state) => state.skipTime);
  const audioRef = useRef(null);

  useMemo(() => {
    setTitle(title);
    setTracks(allTheOpts);
  }, []);

  useEffect(() => {
    const currTrackData = history[hstIdx];
    if (validTrackObj(currTrackData)) {
      localStorage.setItem(
        `LastPlayed: ${title}`,
        JSON.stringify(currTrackData),
      );
      saveTime();
      navigatorStuff();
    }
  }, [hstIdx]);

  useEffect(() => {
    function urlStuff() {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.size === 0) return false;

      const timeInS = getSecondsFromTimeStamp(urlParams.get("time"));
      toast.success(`Starting From: ${secondsToHMS(timeInS)}`, {
        duration: 5000,
      });
      setTimeToGoTo(timeInS);

      const urlSearch = urlParams.get("search");
      if (urlSearch) {
        setSearchInput(urlSearch);
        // toast.success("Search from URL");
        return true;
      }
      const theUrl = urlParams.get("url");
      const trkObj = getObjFromUrl(theUrl, allTheOpts);
      if (validTrackObj(trkObj)) {
        toast.success("Track Playing from URL", { duration: 3000 });
        setHistory([trkObj]);
        return true;
      } else {
        // for old links that have 'artist','trackIndex'
        const artist = urlParams.get("artist");
        const trackIndex = urlParams.get("trackIndex");
        const url = getLinkFromOldUrlDate(artist, trackIndex, allTheOpts);
        const trkObj = getObjFromUrl(url, allTheOpts);
        if (validTrackObj(trkObj)) {
          toast("Old copied link", { duration: 3000 });
          setHistory([trkObj]);
          return true;
        }
      }
      // toast.error(`${theUrl}: Not from this page`, { duration: 10000 })
      return false;
    }

    function getLastPlayedTrackLocalStorage() {
      try {
        const strData = localStorage.getItem(`LastPlayed: ${title}`); // localStorage.getItem('LastPlayed: Welcome to Rimmy Radio')
        const trkObj = JSON.parse(strData);
        if (!validTrackObj(trkObj)) {
          throw new Error("Invalid track object from local storage");
        }
        setHistory([trkObj]);
        const localStorageTime = localStorage.getItem(`LastTime: ${title}`);
        const timeInS = getSecondsFromTimeStamp(localStorageTime);
        setTimeToGoTo(timeInS);
        // toast.success("Found Track From History", { duration: 3000 });
        return true;
      } catch (e) {
        // toast.error(e.message, { duration: 1000 });
        console.log(e.message);
        return false;
      }
    }

    function getLocalStorage() {
      if (localStorage.getItem("shuffle") === "true") setShuffle(true);

      let checkedTracks = localStorage.getItem(`Checked: ${title}`);
      if (checkedTracks) {
        // toast.success("Got Checked Tracks From Storage", { duration: 1000 });
        checkedTracks = JSON.parse(checkedTracks);
        setCheckedForAllArtists(false);

        Object.keys(allTheOpts).forEach((artist) => {
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
        // toast.success("No URL or History, so Playing Next Track", { duration: 5000, });
        nextTrack();
      }
    }
  }, []);

  useEffect(() => {
    const { GET_INDEXED_TRACKS_BY_ARTISTS_URL } = getUrls();
    const artists = JSON.stringify(Object.keys(allTheOpts));
    axios({
      url: GET_INDEXED_TRACKS_BY_ARTISTS_URL + artists,
      method: "GET",
    })
      .then((res) => {
        setIndexTracks(res.data);
      })
      .catch((err) => {
        alert(err.response.data.message);
        console.log("URL: " + GET_INDEXED_TRACKS_BY_ARTISTS_URL);
      });
  }, []);

  //to get rid of next.js Hydration error
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);
  if (!showChild) return <body />;

  function navigatorStuff() {
    if (!("mediaSession" in navigator)) {
      toast.error("Media Session API not supported", { duration: 5000 });
      return;
    }

    navigator.mediaSession.setActionHandler("play", () =>
      audioRef.current.play(),
    );
    navigator.mediaSession.setActionHandler("pause", () =>
      audioRef.current.pause(),
    );

    navigator.mediaSession.setActionHandler("seekforward", () => {
      audioRef.current.currentTime += skipTime;
    });
    navigator.mediaSession.setActionHandler(
      "seekbackward",
      () => (audioRef.current.currentTime += skipTime * -1),
    );
    navigator.mediaSession.setActionHandler("previoustrack", prevTrack);
    navigator.mediaSession.setActionHandler("nexttrack", nextTrack);

    navigator.mediaSession.setActionHandler("seekto", function (event) {
      audioRef.current.currentTime = event.seekTime;
    });

    let album = history[hstIdx].type;
    album = album === "main" || album === "other" ? title : album;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: getNameOfTrack(history[hstIdx].link),
      artist: history[hstIdx].artist,
      album: album,
      artwork: [
        { src: "/logos/ios/1024.png", sizes: "1024x1024", type: "image/png" },
      ],
    });
  }

  function saveTime() {
    let timeToSave = audioRef.current.currentTime;
    timeToSave = timeToSave ? timeToSave : 0;
    // toast.success(`Saved Time: ${timeToSave}`);
    localStorage.setItem(`LastTime: ${title}`, audioRef.current.currentTime);
  }

  return (
    <body className="w-full h-full bg-primary-100">
      <Toaster position="top-left" reverseOrder={true} />
      <NavBar title={title} />
      <SearchTracks />
      <TrackPlayback audioRef={audioRef} />
      {/*
      <SaveTrackModal />
        <ChangeColorsModal />
      */}
      <ShabadsForTrack audioRef={audioRef} />
      <div className="flex flex-row justify-center flex-wrap">
        <IndexTrackBtnAndModal audioRef={audioRef} saveTimeFunc={saveTime} />
        <ArtistsOptions />
        <ViewHistory />
        <ViewTracksInQueue />
        {/* <IconButton onClick={saveTime}> */}
        {/*   <div className="m-1 p-2 text-xs rounded bg-btn">Save Time</div> */}
        {/* </IconButton> */}
      </div>
    </body>
  );
}

function ViewHistory() {
  const history = useStore((state) => state.history);
  const setHstIdx = useStore((state) => state.setHstIdx);
  const [modalOpen, setModal] = useState(false);

  function TheLst() {
    const lst = [];
    for (let i = history.length - 1; i > -1; i--) {
      const link = history[i].link;
      lst.push(
        <button
          className="text-left border-b border-solid border-white break-all"
          key={i}
          onClick={() => {
            setModal(false);
            setHstIdx(i);
          }}
        >
          {getNameOfTrack(link)}
        </button>,
      );
    }
    return lst;
  }

  return (
    <>
      <IconButton onClick={() => setModal(true)}>
        <div className="m-1 p-2 text-xs rounded bg-btn">View History</div>
      </IconButton>
      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
            <div className=" text-white flex p-2 border-b border-solid border-white  ">
              <p className="flex-1 text-left text-2xl font-bold">History: {history.length} Tracks</p>
              <div>
                <IconButton onClick={() => setModal(false)}>
                  <div className="text-white flex-1 flex">
                    <HighlightOffIcon />
                  </div>
                </IconButton>
              </div>
            </div>
            <div className="flex flex-col p-2 flex-auto max-h-48 overflow-auto text-white">
              <TheLst />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ViewTracksInQueue() {
  const tracksInQueue = useStore((state) => state.tracksInQueue);
  const appendHistory = useStore((state) => state.appendHistory);
  const [modalOpen, setModal] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(tracksInQueue);
  }, [tracksInQueue]);

  function TheLst() {
    return results.map((trkObj, index) => {
      return (
        <button
          key={index}
          onClick={() => appendHistory(trkObj)}
          className="flex flex-col w-full rounded-md w-full border-b border-gray-200 hover:bg-blue-100  text-xl p-2 "
        >
          <div className="flex  text-sm">
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
    });
  }

  return (
    <>
      <IconButton onClick={() => setModal(true)}>
        <div className="m-1 p-2 text-xs rounded bg-btn">All Tracks</div>
      </IconButton>
      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-[80%] m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
            <div className=" text-white flex border-b border-solid border-white  ">
              <div className="flex-1 flex flex-row gap-2 justify-center p-1 ">
                <Tooltip title="These are all the tracks from the Checked Options. Tracks that aren't checked won't be here. You can check and uncheck the type of tracks in Track Options">
                  <Info className="text-xs" />
                </Tooltip>
                <p className="">{results.length} Results Found</p>
              </div>
              <div className="">
                <IconButton
                  className="h-10 w-10 "
                  onClick={() => {
                    const newRes = [...results.reverse()];
                    console.log(newRes[0]);
                    setResults(newRes);
                  }}
                >
                  <FlipCameraAndroidIcon className="text-white" />
                </IconButton>
                <IconButton onClick={() => setModal(false)}>
                  <div className="text-white flex-1 flex">
                    <HighlightOffIcon />
                  </div>
                </IconButton>
              </div>
            </div>
            <div className="flex flex-col p-2 flex-auto max-h-48 overflow-auto text-white">
              <TheLst />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
