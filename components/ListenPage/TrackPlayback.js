import React, { useEffect, useState } from "react";
import { Typography, IconButton } from "@mui/material";
import { formatTime, getNameOfTrack } from "@/utils/helper_funcs";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import { useModalStore, useStore } from "@/utils/store.js";
import toast from "react-hot-toast";
import AudioPlayer from "@/components/AudioPlayer";
import { PlayPauseBtn, PlayBackButtons } from "@/components/commonComps";

export default function TrackPlayback({ audioRef }) {
  const {
    nextTrack,
    prevTrack,
    shuffle,
    setShuffle,
    hstIdx,
    history,
    skipTime,
    setSkipTime,
    setPlayBackSpeed,
  } = useStore();
  const { setShowArtists, setArtistToShowTypesFor, setTypeToShowLinksFor } =
    useModalStore();

  const artist = history[hstIdx]?.artist;
  const link = history[hstIdx]?.link;
  const type = history[hstIdx]?.type;

  const copyLink = () => {
    if (!audioRef) return toast.error("No Audio to Copy Link");
    const url = new URL(window.location.href.split("?")[0].split("#")[0]);
    url.searchParams.append("time", Math.floor(audioRef.current.currentTime));
    url.searchParams.append("url", link);
    navigator.clipboard.writeText(url.href);
    toast.success(`Link copied: ${formatTime(audioRef.current.currentTime)}`);
  };

  return (
    <div className="flex flex-col align-top m-2 rounded-lg bg-primary-200 text-white">
      <div className="p-1">
        <div className="flex  items-center">
          <IconButton
            onClick={async () => {
              if (navigator.clipboard === undefined || link === undefined) {
                return;
              }
              await navigator.clipboard.writeText(link.replaceAll(" ", "%20"));
              toast.success("Copied Raw Link to Clipboard!");
            }}
          >
            <AudiotrackIcon />
          </IconButton>
          <Typography
            className="shadow-xl pl-1 text-sm opacity-70 break-all"
            onClick={() => {
              setTypeToShowLinksFor({ artist, type });
            }}
          >
            {getNameOfTrack(link)}
          </Typography>
        </div>
        <div className="flex items-center">
          <IconButton onClick={() => toast.success(`Dhan ${artist}!!!`)}>
            <PersonIcon />
          </IconButton>
          <Typography
            className="shadow-xl pl-1 text-sm text-left opacity-70 font-medium tracking-tight"
            onClick={() => setShowArtists(true)}
          >
            {artist}
          </Typography>
        </div>
        <div className="flex  items-center">
          <IconButton onClick={() => toast.success(`${type} is best!!!`)}>
            <AlbumIcon />
          </IconButton>
          <Typography
            className="shadow-xl pl-1 text-sm opacity-70 font-medium tracking-tight"
            onClick={() => setArtistToShowTypesFor(artist)}
          >
            {type}
          </Typography>
        </div>
      </div>

      <div className="flex gap-1 mx-1 rounded-lg bg-primary-100">
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <label className="text-white text-sm ">
              Shuffle: {shuffle ? "On" : "Off"}
            </label>
          </div>
          <div className="flex-1">
            <IconButton
              onClick={() => {
                setShuffle(!shuffle);
                localStorage.setItem("shuffle", !shuffle);
                toast.success("Shuffle " + (!shuffle ? "Enabled" : "Disabled"));
              }}
            >
              <div className="bg-btn rounded mx-1 h-6 w-12 flex-1">
                <img
                  src={
                    shuffle
                      ? "/playbackImgs/shuffle.svg"
                      : "/playbackImgs/inorder.svg"
                  }
                  className="w-full h-full"
                />
              </div>
            </IconButton>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 ">
          <div className="basis-1/2">
            <p className="text-white text-xs">Playback Speed:</p>
          </div>
          <div className="basis-1/2">
            <select
              id="pickPlaybackSpeed"
              className="text-black text-sm rounded text-center"
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                try {
                  audioRef.current.playbackRate = num;
                  setPlayBackSpeed(num);
                } catch (e) {
                  toast.error("Can't change playback speed.");
                }
              }}
              defaultValue="1"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
              <option value="2.5">2.5x</option>
              <option value="3">3x</option>
            </select>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 ">
          <div className="basis-1/2">
            <p className="text-white text-xs">Skip Interval:</p>
          </div>
          <div className="basis-1/2 ">
            <select
              id="pickSkipInterval"
              className="text-black text-sm rounded -top"
              onChange={(e) => {
                setSkipTime(parseInt(e.target.value));
              }}
              defaultValue={skipTime}
            >
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
            </select>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <label className="text-white text-sm ">Copy Link</label>
          </div>
          <div className="flex-1">
            <IconButton onClick={copyLink}>
              <div className="flex bg-btn rounded mx-1 h-6 w-12">
                <img src={"/playbackImgs/copy.svg"} className="w-full h-full" />
              </div>
            </IconButton>
          </div>
        </div>
      </div>

      <div className="mx-2">
        <AudioPlayer link={link} audioRef={audioRef} />
      </div>

      <div className="w-full flex justify-evenly  ">
        <PlayBackButtons
          imgSrc={"/playbackImgs/left.svg"}
          onClick={prevTrack}
        />
        <PlayBackButtons
          onClick={() => {
            if (audioRef === null) return;
            audioRef.current.currentTime -= skipTime;
          }}
          imgSrc={"/playbackImgs/skip-back.svg"}
        />

        <PlayPauseBtn audioRef={audioRef} />

        <PlayBackButtons
          onClick={() => {
            if (audioRef === null) return;
            audioRef.current.currentTime += skipTime;
          }}
          imgSrc={"/playbackImgs/skip-forward.svg"}
        />

        <PlayBackButtons
          onClick={nextTrack}
          imgSrc={"/playbackImgs/right.svg"}
        />
      </div>
    </div>
  );
}
