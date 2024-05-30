"use client";

import axios from "axios";
import NavBar from "@/components/NavBar/index.js";
import { useEffect, useMemo, useState } from "react";
import { getNameOfTrack } from "@/utils/helper_funcs";
import { IconButton } from "@mui/material";

export default function SGGS() {
  const [allTracks, setAllTracks] = useState([]);
  const [currTrkLst, setCurrTrkLst] = useState([]);

  useEffect(() => {
    axios({
      // url: "http://localhost:3000/getIndexedTracks",
      url: "https://getshabads.xyz/getIndexedTracks",
      method: "GET",
    })
      .then((res) => {
        const lst = res.data.reverse();
        console.log(lst);
        setAllTracks(lst);
        setCurrTrkLst(lst);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }, []);

  return (
    <body className="w-full h-full bg-primary-100 text-white">
      <NavBar title="Track Index" />
      <SearchBar setCurrTrkLst={setCurrTrkLst} allTracks={allTracks} />
      <TopButtons setCurrTrkLst={setCurrTrkLst} />
      <p>{currTrkLst.length}: Tracks</p>
      <ShowTracks currTrkLst={currTrkLst} />
    </body>
  );
}

function TopButtons({ setCurrTrkLst }) {
  const [ascend, setAscend] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <div className="flex flex-row gap-2 p-2 justify-center">
      <IconButton
        onClick={() => {
          setCurrTrkLst((prev) => {
            const newLst = prev.reverse();
            return [...newLst];
          });
          setAscend(!ascend);
        }}
      >
        <div className="flex-1 rounded bg-btn text-white text-sm p-1">
          Show {ascend ? "Oldest" : "Newest"}
        </div>
      </IconButton>
      <IconButton
        onClick={() => {
          const detailsElements = document.getElementsByTagName("details");
          for (let i = 0; i < detailsElements.length; i++) {
            const details = detailsElements[i];
            details.open = !details.open;
          }
          setDetailsOpen(!detailsOpen);
        }}
      >
        <div className="flex-1 rounded bg-btn text-white text-sm p-1">
          {detailsOpen ? "Hide" : "Show"} Details
        </div>
      </IconButton>
    </div>
  );
}

function SearchBar({ setCurrTrkLst, allTracks }) {
  const [searchStr, setSearchStr] = useState("");
  return (
    <div className="flex flex-row gap-2 p-3 ">
      <input
        className="flex-1 rounded px-2 text-black"
        type="text"
        placeholder="Search: "
        value={searchStr}
        onChange={(e) => {
          setSearchStr(e.target.value);
        }}
      />
      <IconButton
        onClick={() => {
          return;
          if (searchStr === "") {
            setCurrTrkLst(allTracks);
            return;
          }
          const wordsEntered = searchStr.toLowerCase().split(" ");
          const filterdTracks = allTracks.filter((trk) => {
            if (
              wordsEntered.every((word) => {
                return trk.description.toLowerCase().includes(word);
              })
            ) {
              return true;
            }

            if (
              wordsEntered.every((word) => {
                return trk.shabadArr.some((line) =>
                  line.toLowerCase().includes(word),
                );
              })
            ) {
              console.log(trk.shabadArr[0]);
              return true;
            }
            return false;
          });
          console.log(filterdTracks);
          // setCurrTrkLst(filterdTracks);
        }}
      >
        <div className="flex  ">
          <p className="flex-1 text-xs p-1 h-5 rounded bg-btn text-white">
            Search
          </p>
        </div>
      </IconButton>
    </div>
  );
}

function ShowTracks({ currTrkLst }) {
  return (
    <div className="flex flex-col gap-1 p-10">
      {currTrkLst.map((trkObj, idx) => (
        <BarRow
          key={idx}
          itemNum={currTrkLst.length - idx}
          created={trkObj.created}
          type={trkObj.type}
          artist={trkObj.artist}
          timestamp={trkObj.timestamp}
          shabadID={trkObj.shabadID}
          shabadArr={trkObj.shabadArr}
          description={trkObj.description}
          link={trkObj.link}
        />
      ))}
    </div>
  );
}

function BarRow({
  itemNum,
  created,
  type,
  artist,
  timestamp,
  shabadID,
  shabadArr,
  description,
  link,
}) {
  return (
    <div className="flex-1 w-full border border-gray-200 rounded text-white">
      <div className="flex flex-row">
        <p className="text-left px-1 m-1 rounded border">#{itemNum}</p>
        <p className="flex-1 flex items-center justify-center">{artist}</p>
      </div>
      <p className="flex bg-gray-800">{description}</p>
      <div className="flex flex-col gap-2 p-2">
        <p className="flex-1 text-left">Type: {type}</p>
        <p className="flex-1 text-left">
          Added: {getDateFromUnixTime(created)}
        </p>
        <p className="flex-1 text-left">Time Stamp: {timestamp}</p>
        <IconButton onClick={() => window.open(link, "_blank")}>
          <p className="flex-1 text-sm rounded bg-btn break-all text-white">
            {getNameOfTrack(link)}
          </p>
        </IconButton>
        <details>
          <summary>Shabad ID {shabadID}</summary>
          {shabadArr?.map((shabad, idx) => (
            <p key={idx}>{shabad}</p>
          ))}
          {/* <p>{shabadArr[0]}</p> */}
        </details>
      </div>
    </div>
  );
}

function getDateFromUnixTime(unixTimeStamp) {
  const the_date = new Date(unixTimeStamp * 1000);
  return the_date.toLocaleString();
}
