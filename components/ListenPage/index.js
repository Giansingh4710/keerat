"use client";

import NavBar from "../NavBar/index.js";
import ArtistsOptions from "./ArtistsOptions/index.js";
import TrackPlayback from "./TrackPlayback/index.js";
import SaveTrackModal from "./SaveTrackModal/index.js";
import SearchTracks from "./SearchTracks/index.js";
import IndexTrackBtnAndModal from "./IndexTrackModal/index.js";
import { IconButton } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLinkFromOldUrlDate,
  getNameOfTrack,
  getObjFromUrl,
  getSecondsFromTimeStamp,
  validTrackObj,
} from "@/utils/helper_funcs.js";
import toast, { Toaster } from "react-hot-toast";
import { useSearchStore, useStore } from "@/utils/store.js";

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
      toast.success(`Time: ${timeInS}`, { duration: 5000 });
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
    let timeToSave = audioRef.current.currentTime 
    timeToSave = timeToSave ? timeToSave : 0;
    // toast.success(`Saved Time: ${timeToSave}`);
    localStorage.setItem(`LastTime: ${title}`, audioRef.current.currentTime);
  }
  // here

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
      <div className="flex flex-row justify-center">
        <IndexTrackBtnAndModal audioRef={audioRef} saveTimeFunc={saveTime} />
        <ArtistsOptions />
      </div>
    </body>
  );
}
