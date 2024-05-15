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
  const optsShown = useStore((state) => state.optsShown);
  const setOptsShown = useStore((state) => state.setOptsShown);
  const setCheckedForAllArtists = useStore(
    (state) => state.setCheckedForAllArtists,
  );
  const [modalOpen, setModal] = useState(false);
  const [artist, setArtist] = useState(""); // artist chosen for modal (to get opts for)
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

        <TheModal
          modalOpen={modalOpen}
          setModal={setModal}
          artist={artist}
          allOpts={allOpts}
        />

        <div
          ref={optionsDivRef}
          className="bg-secondary-200 h-40 overflow-auto text-white"
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
                  setCheckedArtist(artist, !checked);
                }}
                rightText={ratio}
                onRightTextClick={() => {
                  setModal(true);
                  setArtist(artist);
                }}
              />
            );
          })}
        </div>

        <div className="flex">
          <button
            // className="max-w-48 p-2 m-1 place-content-center font-bold rounded bg-third"
            className=".button bg-btn"
            onClick={() => setCheckedForAllArtists(false)}
          >
            <MdCheckBoxOutlineBlank className=" text-lg" />
            Unselect All
          </button>
          <button
            className=".button bg-btn"
            onClick={() => setCheckedForAllArtists(true)}
          >
            <MdCheckBox className="text-lg" />
            Select All
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

function TheModal({ modalOpen, setModal, allOpts, artist }) {
  const setCheckedType = useStore((state) => state.setCheckedType);
  const setCheckedArtist = useStore((state) => state.setCheckedArtist);

  if (artist === "") return null;
  const tracksLst = allOpts[artist];
  // const totalCount = artistTrackCount(tracksLst);
  return (
    <Modal open={modalOpen} onClose={() => setModal(false)}>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="max-h-96 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-2 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl  font-semibold">{artist}</h3>
              <div>
                <IconButton onClick={() => setModal(false)}>
                  <HighlightOffIcon />
                </IconButton>
              </div>
            </div>
            <div className="relative p-2 flex-auto max-h-48 overflow-auto">
              {tracksLst.map((obj, idx) => {
                const checked = obj.checked;
                const typeName = obj.type;
                const linksLen = obj.links.length;
                const ratio = `${checked ? linksLen : 0}/${linksLen}`;
                const handleClick = () => setCheckedType(artist, idx, !checked);
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
            <h1>{getRatio(tracksLst)}</h1>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              {/*footer*/}
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setCheckedArtist(artist, false)}
              >
                Unslect All
              </button>
              <button
                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => setCheckedArtist(artist, true)}
              >
                Select All
              </button>
            </div>
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
