import React from "react";
import ALL_THEMES from "@/utils/themes";
import { Typography } from "@mui/material";
import { formatTime, getNameOfTrack } from "@/utils/helper_funcs";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import AudioPlayer from "./AudioPlayer";
import Image from "next/image";
import { useStore } from "@/utils/store.js";
import toast from "react-hot-toast";

export default function TrackPlayback({audioRef}) {
  const nextTrack = useStore((state) => state.nextTrack);
  const prevTrack = useStore((state) => state.prevTrack);
  const shuffle = useStore((state) => state.shuffle);
  const setShuffle = useStore((state) => state.setShuffle);
  const hstIdx = useStore((state) => state.hstIdx);
  const history = useStore((state) => state.history);
  const skipTime = useStore((state) => state.skipTime);
  const setSkipTime = useStore((state) => state.setSkipTime);
  const setPlayBackSpeed = useStore((state) => state.setPlayBackSpeed);
  // const { artist, link, typeIdx, linkIdx, type } = history[hstIdx]
  const artist = history[hstIdx]?.artist;
  const link = history[hstIdx]?.link;
  const type = history[hstIdx]?.type;

  function copyLink() {
    const url = new URL(window.location.href.split("?")[0].split("#")[0]);
    if (audioRef === null) {
      toast.error("No Audio to Copy Link");
      return;
    }
    url.searchParams.append("time", parseInt(audioRef.current.currentTime));
    url.searchParams.append("url", link);
    navigator.clipboard.writeText(url.href);
    toast.success(
      `Link with timestamp: ${formatTime(audioRef.current?.currentTime)} Copied`,
    );
  }

  return (
    <div className="flex flex-col align-top m-2 rounded-lg bg-primary-200 text-white">
      <div className="flex-4 p-2">
        <div className="flex pt-2">
          <AudiotrackIcon
            onClick={async () => {
              if (navigator.clipboard === undefined || link === undefined) {
                return;
              }
              await navigator.clipboard.writeText(link.replaceAll(" ", "%20"));
              toast.success("Copied Raw Link to Clipboard!");
            }}
          />
          <a className="underline w-full break-words text-left" target="_blank" href={link}>
            <Typography
              className="pl-2 text-sm opacity-70 "
            >
              {link && getNameOfTrack(link)}
            </Typography>
          </a>
        </div>
        <div className="flex pt-2">
          <PersonIcon
            onClick={() => {
              toast.success(`Dhan ${artist}!!!`);
            }}
          />
          <Typography className="pl-3 text-sm opacity-70 font-medium tracking-tight">
            {artist}
          </Typography>
        </div>
        <div className="flex pt-2">
          <AlbumIcon onClick={() => toast.success(`${type} is best!!!`)} />
          <Typography className="pl-3 text-sm opacity-70 font-medium tracking-tight">
            {type}
          </Typography>
        </div>
      </div>

      <div className="flex flex-col flex-2 mx-1 rounded-lg bg-primary-100">
        <div className="flex-1 flex gap-4 m-2 p-1 border-b border-gray-200">
          <div className="flex-1 flex flex-col">
            <label htmlFor="pickPlaybackSpeed"></label>
            <div className="mb-0">
              <label className="text-white text-sm ">Playback Speed:</label>
            </div>
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
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
              <option value="2.5">2.5x</option>
              <option value="3">3x</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="mb-0">
              <label className="text-white text-sm ">Skip Interval:</label>
            </div>
            <select
              id="pickSkipInterval"
              className="text-black text-sm rounded text-center"
              onChange={(e) => {
                setSkipTime(parseInt(e.target.value));
              }}
              defaultValue={skipTime}
            >
              <option value="5">5 Seconds</option>
              <option value="10">10 Seconds</option>
              <option value="30">30 Seconds</option>
              <option value="60">60 Seconds</option>
            </select>
          </div>
        </div>

        <div className="flex-1 flex gap-4 py-1">
          <div className="flex-1 flex flex-col rounded-lg">
            <label className="flex-1">Toggle Shuffle</label>
            <div className="flex-1 flex">
              <button
                onClick={() => {
                  setShuffle(!shuffle);
                  localStorage.setItem("shuffle", !shuffle);
                  toast.success(
                    "Shuffle " + (!shuffle ? "Enabled" : "Disabled"),
                  );
                }}
                className="flex-1 flex bg-btn rounded mx-16 h-6 w-12"
              >
                <img
                  src={
                    shuffle
                      ? "/playbackImgs/shuffle.svg"
                      : "/playbackImgs/inorder.svg"
                  }
                  className="w-full h-full"
                />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col rounded-lg">
            <label className="flex-1">Copy Link</label>
            <div className="flex-1 flex">
              <button
                onClick={copyLink}
                className="flex-1 flex bg-btn rounded mx-16 h-6 w-12"
              >
                <img src={"/playbackImgs/copy.svg"} className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AudioPlayer link={link} audioRef={audioRef}/>

      <div className="w-full flex">
        <button onClick={prevTrack} className="h-16 p-2 flex-1">
          <img src={"/playbackImgs/left.svg"} className="w-full h-full" />
        </button>
        <button
          className="h-16 p-2 flex-1"
          onClick={() => {
            if (audioRef === null) return;
            audioRef.current.currentTime -= skipTime;
          }}
        >
          <img src={"/playbackImgs/skip-back.svg"} className="w-full h-full" />
        </button>

        <PlayPauseBtn audioRef={audioRef}/>

        <button
          className="h-16 p-2 flex-1"
          onClick={() => {
            if (audioRef === null) return;
            audioRef.current.currentTime += skipTime;
          }}
        >
          <img
            src={"/playbackImgs/skip-forward.svg"}
            className="w-full h-full"
          />
        </button>
        <button onClick={nextTrack} className="h-16 p-2 flex-1">
          <img src={"/playbackImgs/right.svg"} className="w-full h-full" />
        </button>
      </div>
    </div>
  );
}

function PlayPauseBtn({audioRef}) {
  const paused = useStore((state) => state.paused);
  function togglePlayPause() {
    if (audioRef === null) return;
    // || audioRef... is for initial load. Browser blocks autoplay
    if (paused || audioRef.current?.paused) {
      audioRef.current?.play(); // setPaused is done on the audio tag
    } else {
      audioRef.current?.pause();
    }
  }

  const imgSrc = "/playbackImgs/" + (paused ? "play" : "pause") + ".svg";
  return (
    <button className="flex-1 h-16 p-2" onClick={togglePlayPause}>
      <Image
        src={imgSrc}
        className="w-full h-full"
        alt="playPauseBtn"
        width={100} // width and height are for the Image component
        height={100} // get overridden by the style prop
      />
    </button>
  );
}
