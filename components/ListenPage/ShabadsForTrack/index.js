import React, { useEffect, useState } from "react";
import { useStore } from "@/utils/store.js";
import { IconButton, Modal } from "@mui/material";
import { getSecondsFromTimeStamp } from "../../../utils/helper_funcs.js";

export default function ShabadsDisplay({ audioRef }) {
  const indexTracks = useStore((state) => state.indexTracks);
  const getCurrentTrack = useStore((state) => state.getCurrentTrack);
  const hstIdx = useStore((state) => state.hstIdx);
  const [indexLst, setIndexLst] = useState([]);

  useEffect(() => {
    const currentTrk = getCurrentTrack();
    // console.log("BOB currentTrk: ", indexTracks[currentTrk.link]);
    setIndexLst(indexTracks[currentTrk.link]);
  }, [hstIdx, indexTracks]);

  return (
    <div className="border-2 border-sky-500 rounded text-white">
      <DisplayShabads indexLst={indexLst} audioRef={audioRef} />
    </div>
  );
}

function DisplayShabads({ indexLst, audioRef }) {
  if (!indexLst) {
    return <></>;
    return <h1>No Shabads For This Track</h1>;
  }
  return (
    <div>
      <h1 className="border-b">Indexed Shabads</h1>
      <div className="overflow-y-auto h-48">
        {indexLst.map((indexData, i) => {
          return (
            <ShabadBox key={i} indexData={indexData} audioRef={audioRef} />
          );
        })}
      </div>
    </div>
  );
}

function ShabadBox({ indexData, audioRef }) {
  const {
    created,
    type,
    artist,
    timestamp,
    shabadID,
    shabadArr,
    description,
    link,
  } = indexData;

  return (
    <div className="flex flex-row justify-normal border-b">
      {/* <p className="flex-1">{created}</p> */}
      {/* <p className="flex-1">{type}</p> */}
      {/* <p className="flex-1">{artist}</p> */}
      <IconButton
        onClick={() => {
          audioRef.current.currentTime = getSecondsFromTimeStamp(timestamp);
        }}
      >
        <p className="flex-1 underline text-white text-sm m-0 p-1">
          {timestamp}
        </p>
      </IconButton>
      <p className="flex-1">{description}</p>
      <ViewFullShabad shabadArray={shabadArr} shabadID={shabadID} />
    </div>
  );
}

function ViewFullShabad({ shabadArray, shabadID }) {
  const [shabadViewModal, setShabadViewModal] = useState(false);
  if (!shabadArray) {
    return <></>;
  }
  return (
    <>
      <IconButton onClick={() => setShabadViewModal(true)}>
        <div className="flex-1 underline text-white text-sm m-0 p-1">
          {/* View Full Shabad: {shabadID} */}
          View Full Shabad
        </div>
      </IconButton>
      <Modal open={shabadViewModal} onClose={() => setShabadViewModal(false)}>
        <div className=" h-[70vh] w-[90vw] p-1 bg-primary-100 text-white p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
          <h1>Shabad ID: {shabadID}</h1>
          <div className="h-5/6 overflow-auto border-2 border-sky-500 rounded">
            <ShabadDetails shabadArray={shabadArray} />
          </div>

          <IconButton onClick={() => setShabadViewModal(false)}>
            <p className="text-sm p-1 bg-red-500 text-white rounded-lg">
              Close
            </p>
          </IconButton>
        </div>
      </Modal>
    </>
  );
}

function ShabadDetails({ shabadArray }) {
  const gurbaniStyle = {
    gurmukhi: {
      fontSize: "1rem",
      padding: "0",
      margin: "0",
    },
    roman: {
      fontSize: "0.5rem",
      padding: "0",
      margin: "0",
    },
    trans: {
      fontSize: "0.7rem",
      padding: "0",
      margin: "0",
    },
  };

  if (!shabadArray) return <></>;
  if (shabadArray.length === 0) return <></>;
  return shabadArray.map((line, ind) => {
    let style;
    if (ind % 3 == 0) {
      style = gurbaniStyle.gurmukhi;
    } else if (ind % 3 == 1) {
      style = gurbaniStyle.roman;
    } else {
      style = gurbaniStyle.trans;
    }
    return (
      <p style={style} key={ind}>
        {line}
      </p>
    );
  });
}
