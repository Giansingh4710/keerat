import * as React from "react";
import { formatTime } from "@/utils/helper_funcs";
import { useStore } from "@/utils/store.js";
import toast from "react-hot-toast";

export default function AudioPlayer({ link, audioRef }) {
  const nextTrack = useStore((state) => state.nextTrack);
  const timeToGoTo = useStore((state) => state.timeToGoTo);
  const setTimeToGoTo = useStore((state) => state.setTimeToGoTo);
  const playbackSpeed = useStore((state) => state.playBackSpeed);
  const setPaused = useStore((state) => state.setPaused);

  const [buffered, setBuffered] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  const handleBufferProgress = (e) => {
    const audio = e.currentTarget;
    const dur = audio.duration;
    setCurrentTime(audio.currentTime);
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i,
          );
          setBuffered(bufferedLength);
          break;
        }
      }
    }
  };

  const audioComponent = React.useMemo(() => {
    return (
      <audio
        ref={audioRef}
        key={link} // to force re-render when link changes
        autoPlay={true}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onTimeUpdate={handleBufferProgress}
        onProgress={handleBufferProgress}
        onEnded={() => nextTrack()}
        onError={() => toast.error("Error loading audio")}
        onLoadedData={() => {
          audioRef.current.currentTime = timeToGoTo;
          audioRef.current.playbackRate = playbackSpeed;
          setTimeToGoTo(0);
          setPaused(audioRef.current.paused); // for initial load. Browser blocks autoplay
          toast.success("Audio Loaded");
        }}
        onSeeking={() => {}}
      >
        <source type="audio/mpeg" src={link} />
      </audio>
    );
  }, [link,audioRef]);

  return (
    <div className="w-full py-4">
      {audioComponent}
      <AudioProgressBar
        buffered={buffered}
        currentTime={currentTime}
        audioRef={audioRef}
      />
    </div>
  );
}

function AudioProgressBar({ buffered, currentTime, audioRef }) {
  if (!audioRef) return null;
  const duration = audioRef?.current?.duration || 0;
  const bufferedWidth = isNaN(buffered / duration)
    ? 0
    : (buffered / duration) * 100;

  const handleChange = (event) => {
    const newValue = event.target.value;
    audioRef.current.currentTime = newValue;
  };

  return (
    <div className="w-full bg-primary-100 pt-2 rounded-lg">
      <div className="flex flex-col w-full justify-between ">
        <div className="flex-1 flex flex-row px-3">
          <span className="flex-1 text-left">{formatTime(currentTime)}</span>
          <span className="flex-1 text-right">{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          className="slider"
          style={{
            width: "100%",
            padding: "0.5em",
            background: `linear-gradient(to right, grey ${bufferedWidth}%, #f0f0f0 ${bufferedWidth}% 100%)`,
            height: "1em",
            borderRadius: "5px",
            marginBottom: "0.5em",
            outline: "none",
            transition: "opacity 0.2s",
            // opacity: 0.7,

            WebkitAppearance: "none",
            WebkitTransition: "0.2s",
          }}
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleChange}
        />
      </div>
      <style jsx>
        {`
          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 10px;
            height: 25px;
            border-radius: 10px;
            background: #ff8100;
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            width: 10px;
            height: 25px;
            border-radius: 10px;
            background: #04aa6d;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}
