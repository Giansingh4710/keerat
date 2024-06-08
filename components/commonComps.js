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

export const Button = ({
  onClick,
  children,
  color = "none",
  size = "md",
  additionalClasses = "",
}) => {
  const colorClasses = {
    red: "bg-red-300 hover:bg-red-400 active:bg-red-500 border-red-500",
    blue: "bg-blue-300 hover:bg-blue-400 active:bg-blue-500 border-blue-500",
    green:
      "bg-green-300 hover:bg-green-400 active:bg-green-500 border-green-500",
    regular: "bg-gray-300 hover:bg-gray-400 active:bg-gray-500 border-gray-500",
    none: "",
    // Add more colors as needed
  };

  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4 text-md",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <button
      className={`flex items-center font-semibold border rounded shadow focus:outline-none focus:shadow-outline transition duration-150 ease-in-out active:shadow-inner ${colorClasses[color]} ${sizeClasses[size]} ${additionalClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
