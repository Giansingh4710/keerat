import { isChecked, trackCount } from "@/utils/helper_funcs";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton } from "@mui/material";
import { useStore } from "@/utils/store.js";
import { ArtistOptBar } from "./artistOptBar";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function ArtistsOptions() {
  const allOpts = useStore((state) => state.allOptsTracks);
  const setCheckedArtist = useStore((state) => state.setCheckedArtist);
  const optsShown = useStore((state) => state.optsShown);
  const setOptsShown = useStore((state) => state.setOptsShown);
  const setCheckedForAllArtists = useStore(
    (state) => state.setCheckedForAllArtists,
  );
  const numOfTracks = trackCount(allOpts);

  const optionsDivRef = useRef(null);
  const scrollTo = useRef(0);

  useEffect(() => {
    if (scrollTo.current !== 0 && optionsDivRef.current) {
      optionsDivRef.current.scrollTop = scrollTo.current;
    }

    toast.success(`Total Tracks in Queue: ${numOfTracks}`, {
      duration: 1000,
    });
  }, [allOpts]);

  function TheButon({ text, onClick }) {
    return (
      <div className="">
        <button
          onClick={onClick}
          className="bg-btn max-w-48 p-2 m-1 place-content-center font-bold rounded"
        >
          <p className="text-black text-xs">{text}</p>
        </button>
      </div>
    );
  }

  return (
    <>
      <TheButon
        text={`${optsShown ? "Close" : "Open"} Track Options`}
        onClick={() => setOptsShown(!optsShown)}
      />
      <div
        className={`${optsShown ? "" : "hidden"} bg-primary-200 mx-2 rounded-lg`}
      >
        <div className="flex-1 flex gap-1">
          <p className="flex-1 align-baseline text-lg">
            Total Tracks in Queue: {numOfTracks}
          </p>
          <div className="flex-5">
            <IconButton onClick={() => setOptsShown(false)}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </div>

        <div
          ref={optionsDivRef}
          className="bg-secondary-200 h-40 overflow-auto text-white"
        >
          {Object.keys(allOpts).map((artist) => {
            const checked = isChecked(allOpts, artist);
            return (
              <ArtistOptBar
                key={artist}
                artist={artist}
                checked={checked}
                onClick={() => {
                  setCheckedArtist(artist, !checked);
                }}
              />
            );
          })}
        </div>

        <div className="flex">
          <button
            className=".button bg-btn"
            onClick={() => setCheckedForAllArtists(true)}
          >
            <MdCheckBox className="text-lg" />
            Select All
          </button>
          <button
            // className="max-w-48 p-2 m-1 place-content-center font-bold rounded bg-third"
            className=".button bg-btn"
            onClick={() => setCheckedForAllArtists(false)}
          >
            <MdCheckBoxOutlineBlank className=" text-lg" />
            Unselect All
          </button>
        </div>
        <style jsx>{`
          button {
            margin: 0.5em;
            font-weight: bold;
            padding: 0.5rem;
            border-radius: 5px;
            color: black;
            display: flex;
            align-items: center;
            gap: 0.5em;
          }
        `}</style>
      </div>
    </>
  );
}
