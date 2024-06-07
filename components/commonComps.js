import { useStore } from "@/utils/store.js";
import { IconButton } from "@mui/material";

export function PlayPauseBtn({ audioRef }) {
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
  return <PlayBackButtons imgSrc={imgSrc} onClick={togglePlayPause} />;
}

export function PlayBackButtons({ onClick, imgSrc }) {
  return (
    <IconButton onClick={onClick}>
      <div className="h-10 w-10 flex-1">
        <img src={imgSrc} className="w-full h-full" />
      </div>
    </IconButton>
  );
}
