import { Modal } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useStore, useSavedTracksStore } from "@/utils/store";

import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import DeleteIcon from "@mui/icons-material/Delete";
import { getNameOfTrack, validTrackObj } from "@/utils/helper_funcs";
import toast from "react-hot-toast";

function DisplayTracks() {
  const showTracks = useSavedTracksStore((state) => state.showTracks);
  const savedTracks = useSavedTracksStore((state) => state.savedTracks);
  const appendHistory = useStore((state) => state.appendHistory);
  const deleteFromSavedTracks = useSavedTracksStore(
    (state) => state.deleteFromSavedTracks,
  );

  if (!showTracks) return <></>;

  return (
    <div className="w-full border border-gray-200 rounded-lg text-white">
      <p>{savedTracks.length}: Saved Tracks</p>
      <div className=" overflow-x-clip overflow-y-auto h-48">
        {savedTracks.map((trkObj, index) => {
          return (
            <div className="flex w-full border-b border-gray-200">
              <button
                key={index}
                onClick={() => appendHistory(trkObj)}
                className="flex-1 rounded-md hover:bg-blue-100 text-xl p-2"
              >
                <div className="flex-1 flex ">
                  <span className="pl-2 pr-2">{index + 1}.</span>
                  <span className="flex-1 text-left">
                    {getNameOfTrack(trkObj.link)}
                  </span>
                </div>
              </button>
              <div className="flex-3 text-right pr-2">
                <DeleteIcon
                  onClick={() => {
                    deleteFromSavedTracks(index);
                    toast.success("Removed from Saved Tracks");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SaveTrackModal() {
  const title = useStore((state) => state.title);
  const getCurrentTrack = useStore((state) => state.getCurrentTrack);
  const setSavedTracks = useSavedTracksStore((state) => state.setSavedTracks);
  const note = useSavedTracksStore((state) => state.note);
  const setNote = useSavedTracksStore((state) => state.setNote);
  const modalOpen = useSavedTracksStore((state) => state.modalOpened);
  const setModal = useSavedTracksStore((state) => state.setModalOpened);
  const setShowing = useSavedTracksStore((state) => state.setShowing);
  const showTracks = useSavedTracksStore((state) => state.showTracks);
  const setLocalStorageKey = useSavedTracksStore(
    (state) => state.setLocalStorageKey,
  );
  const appendSavedTrack = useSavedTracksStore(
    (state) => state.appendSavedTrack,
  );

  useMemo(() => {
    const localStorageKey = `SavedTracks: ${title}`;
    setLocalStorageKey(localStorageKey);

    const localSavedTracks = JSON.parse(localStorage.getItem(localStorageKey));
    if (localSavedTracks instanceof Array) {
      setSavedTracks(localSavedTracks);
    }else if(localStorage instanceof Object){ // old data
      // setSavedTracks(Object.values(localSavedTracks));
    }
  }, []);

  return (
    <div>
      <div className="pb-4 flex justify-evenly">
        <button
          className="bg-secondary-100 p-1 rounded flex items-center"
          onClick={() => setShowing(!showTracks)}
        >
          <FormatListNumberedIcon className="text-xs flex-1" />
          <p className="text-xs flex-2">
            {showTracks ? "Hide" : "Show"} Saved Tracks
          </p>
        </button>
        <button
          className="bg-secondary-100 p-2 rounded flex items-center"
          onClick={() => setModal(true)}
        >
          <BookmarkAddedIcon className="text-xs flex-1" />
          <p className="text-xs flex-2">Save Current Track</p>
        </button>
      </div>

      <DisplayTracks />

      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-black shadow-lg p-4 rounded-lg bg-primary-100 w-full p">
          <div className="flex">
            <p className="flex-1 text-white">
              Enter a note if you would like (Optional):
            </p>
            <button
              className="flex-2 text-white"
              onClick={() => setModal(false)}
            >
              &times;
            </button>
          </div>
          <div>
            <textarea
              placeholder="ex: Amazing Bani at 10:00"
              className="w-full h-20 rounded-lg p-2 text-black"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              className="bg-secondary-100 p-2 rounded"
              onClick={() => {
                const trkObj = getCurrentTrack();
                if (validTrackObj(trkObj)) {
                  trkObj.note = note;
                  appendSavedTrack(trkObj);
                  setModal(false);
                  setNote("");
                } else {
                  toast.error("Track is invalid");
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
