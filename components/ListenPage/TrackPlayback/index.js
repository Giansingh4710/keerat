import React from "react";
import ALL_THEMES from "@/utils/themes";
import { Typography, IconButton } from "@mui/material";
import { formatTime, getNameOfTrack } from "@/utils/helper_funcs";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import AlbumIcon from "@mui/icons-material/Album";
import PersonIcon from "@mui/icons-material/Person";
import { useStore } from "@/utils/store.js";
import toast from "react-hot-toast";
import AudioPlayer from "@/components/AudioPlayer";
import { PlayPauseBtn, PlayBackButtons } from "@/components/commonComps";

export default function TrackPlayback({ audioRef }) {
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
          <a
            className="underline w-5/6 break-words text-left"
            target="_blank"
            href={link}
          >
            <Typography className="pl-2 text-sm opacity-70 ">
              {link && getNameOfTrack(link)}
            </Typography>
          </a>
        </div>
        <div className="flex pt-2 items-center">
          <IconButton onClick={() => toast.success(`Dhan ${artist}!!!`)}>
            <PersonIcon />
          </IconButton>
          <Typography className="pl-3 text-sm text-left opacity-70 font-medium tracking-tight">
            {artist}
          </Typography>
        </div>
        <div className="flex pt-2 items-center">
          <IconButton onClick={() => toast.success(`${type} is best!!!`)}>
            <AlbumIcon />
          </IconButton>
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
            <label className="flex-1">Shuffle: {shuffle ? "On" : "Off"}</label>
            <IconButton
              onClick={() => {
                setShuffle(!shuffle);
                localStorage.setItem("shuffle", !shuffle);
                toast.success("Shuffle " + (!shuffle ? "Enabled" : "Disabled"));
              }}
            >
              <div className="flex-1 flex bg-btn rounded mx-16 h-6 w-12">
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

          <div className="flex-1 flex flex-col rounded-lg">
            <label className="flex-1">Copy Link</label>
            <IconButton onClick={copyLink}>
              <div className="flex-1 flex bg-btn rounded mx-16 h-6 w-12">
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
