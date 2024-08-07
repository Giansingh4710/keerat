import { isChecked, trackCount } from "@/utils/helper_funcs";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton } from "@mui/material";
import { useStore } from "@/utils/store.js";
import { ArtistOptBar } from "./artistOptBar";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { Modal } from "@mui/material";

export default function ArtistsOptions() {
  const allOpts = useStore((state) => state.allOptsTracks);
  const setCheckedArtist = useStore((state) => state.setCheckedArtist);
  const title = useStore((state) => state.title);
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

    const checkedTypes = {};
    Object.keys(allOpts).forEach((artist) => {
      const lstOftypes = [];
      allOpts[artist].forEach((linksType) => {
        if (linksType.checked) {
          lstOftypes.push(linksType.type);
        }
      });
      if (lstOftypes.length > 0) checkedTypes[artist] = lstOftypes;
    });

    localStorage.setItem(`Checked: ${title}`, JSON.stringify(checkedTypes));
  }, [allOpts]);
  return (
    <>
      <IconButton onClick={() => setOptsShown("all")}>
        <p className="m-1 p-2 text-xs rounded bg-btn">Open Track Options</p>
      </IconButton>
      <TrackTypesModal />
      <Modal open={optsShown === "all"} onClose={() => setOptsShown("none")}>
        <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className=" m-10 flex-1 bg-primary-200  rounded-lg border border-solid border-white ">
            <div className="flex-1 flex gap-1">
              <p className="flex-1 align-baseline text-lg">
                Total Tracks in Queue: {numOfTracks}
              </p>
              <div className="flex-5">
                <IconButton onClick={() => setOptsShown("none")}>
                  <HighlightOffIcon />
                </IconButton>
              </div>
            </div>

            <div
              ref={optionsDivRef}
              className="bg-secondary-200 h-72 overflow-auto text-white"
            >
              {Object.keys(allOpts).map((artist) => {
                const checked = isChecked(allOpts, artist);
                const artistTracks = allOpts[artist];
                const ratio = getRatio(artistTracks);
                return (
                  <ArtistOptBar
                    key={artist}
                    checked={checked}
                    title={artist}
                    toggleCheckbox={() => {
                      toast.success(
                        `${checked ? "Un" : ""}selected: ${artist}`,
                      );
                      setCheckedArtist(artist, !checked);
                    }}
                    rightText={ratio}
                    onRightTextClick={() => {
                      setOptsShown(artist);
                    }}
                  />
                );
              })}
            </div>

            <div className="flex">
              <IconButton onClick={() => setCheckedForAllArtists(!false)}>
                <div className="flex bg-btn text-black p-1 items-center justify-center gap-1 font-bold text-sm rounded-lg">
                  <MdCheckBox className="" />
                  <p className="flex-1">Select All</p>
                </div>
              </IconButton>
              <IconButton onClick={() => setCheckedForAllArtists(false)}>
                <div className="flex bg-btn text-black p-1 items-center justify-center gap-1 font-bold text-sm rounded-lg">
                  <MdCheckBoxOutlineBlank className="" />
                  <p className="flex-1">Unselect All</p>
                </div>
              </IconButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function TrackTypesModal() {
  const setCheckedType = useStore((state) => state.setCheckedType);
  const setCheckedArtist = useStore((state) => state.setCheckedArtist);
  const optsShown = useStore((state) => state.optsShown);
  const setOptsShown = useStore((state) => state.setOptsShown);
  const allOpts = useStore((state) => state.allOptsTracks);

  if (optsShown === "none" || optsShown === "all") return null;
  const tracksLst = allOpts[optsShown];

  const modalOpen = optsShown !== "none" && optsShown !== "all";
  return (
    <Modal open={modalOpen} onClose={() => setOptsShown("none")}>
      <div className=" w-screen flex items-center overflow-y-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className=" m-10 flex-1 bg-primary-100  rounded-lg border border-solid border-white ">
          <div className=" text-white flex p-2 border-b border-solid border-white  ">
            <p className="flex-1 text-left text-2xl font-bold">{optsShown}</p>
            <IconButton onClick={() => setOptsShown("none")}>
              <div className="text-white flex-1 flex">
                <HighlightOffIcon />
              </div>
            </IconButton>
          </div>
          <div className="relative p-2 flex-auto max-h-48 overflow-auto text-white">
            {tracksLst.map((obj, idx) => {
              const checked = obj.checked;
              const typeName = obj.type;
              const linksLen = obj.links.length;
              const ratio = `${checked ? linksLen : 0}/${linksLen}`;
              const handleClick = () =>
                setCheckedType(optsShown, idx, !checked);
              return (
                <ArtistOptBar
                  key={typeName}
                  checked={checked}
                  title={typeName}
                  toggleCheckbox={handleClick}
                  rightText={ratio}
                  onRightTextClick={handleClick}
                />
              );
            })}
          </div>
          <p className="border-t border-white rounded-b font-semibold flex-1 text-white text-left p-1">
            Tracks Selected: {getRatio(tracksLst)}
          </p>
          <div className="flex items-center justify-end p-2">
            {/*footer*/}
            <button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setCheckedArtist(optsShown, false)}
            >
              Unslect All
            </button>
            <button
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setCheckedArtist(optsShown, true)}
            >
              Select All
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function getRatio(artistTracks) {
  let checkedTracks = 0;
  const checkedTypes = artistTracks.filter((type) => type.checked);
  for (const type of checkedTypes) {
    checkedTracks += type.links.length;
  }
  const total = artistTrackCount(artistTracks);
  return `${checkedTracks}/${total}`;
}
function artistTrackCount(artistTracks) {
  let count = 0;
  for (const type of artistTracks) {
    count += type.links.length;
  }
  return count;
}
