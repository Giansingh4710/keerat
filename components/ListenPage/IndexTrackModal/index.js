"use client";

import ALL_THEMES from "@/utils/themes.js";
import { Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { useStore } from "@/utils/store.js";
import { IconButton } from "@mui/material";
import axios from "axios";
import getUrls from "@/utils/get_urls";

export default function IndexTrackBtnAndModal({ audioRef, saveTimeFunc }) {
  const [modalOpen, setModal] = useState(false);
  const [description, setDescription] = useState("");
  const [formShabadID, setFromShabadID] = useState("");
  const [shabadsReturnedFromSearch, setShabads] = useState([]);
  const [currShabad, setCurrShabad] = useState({});
  const [lineClicked, setLineClicked] = useState("");
  const [theTrackType, setTrackType] = useState("");
  const formData = useRef(null);

  const { ADD_INDEX_URL, GET_SHABADS_URL } = getUrls();

  const history = useStore((state) => state.history);
  const hstIdx = useStore((state) => state.hstIdx);
  const artist = history[hstIdx]?.artist;
  const link = history[hstIdx]?.link;

  const [timestamp, setTimestamp] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });

  useEffect(() => {
    function getTrackType() {
      const trackType = localStorage.getItem("IndexTrack trackType");
      if (trackType === null) {
        return "random";
      }
      return trackType;
    }

    setTrackType(getTrackType());
  }, []);

  function formValidation(e) {
    e.preventDefault();

    const canPostDataToTrackIndex =
      localStorage.getItem("canPostDataToTrackIndex") === "true" ? true : false;
    if (!canPostDataToTrackIndex) {
      const password = prompt("Enter password if you to save data?");
      if (password && password.toLowerCase() === "dgn") {
        localStorage.setItem("canPostDataToTrackIndex", "true");
        alert("Correct password!!");
      } else {
        alert("Wrong password");
      }
      return;
    }

    if (description === "") {
      alert("Description cannot be empty");
      return;
    }

    // saveTimeFunc();
    const theTimeStamp = getTimestampString(timestamp);
    const info = `
        Type: ${theTrackType}

        Description: ${description}
        Shabad ID: ${formShabadID}
        Timestamp: ${theTimeStamp}
        `;

    const confirmed = confirm(
      "Are you sure you want to index this track?" + info,
    );
    if (!confirmed) return;
    axios({
      url: ADD_INDEX_URL,
      method: "POST",
      data: {
        description,
        shabadID: formShabadID,
        timestamp: theTimeStamp,
        trackType: theTrackType, // fix artist and type
        artist,
        link,
      },
    })
      .then((res) => {
        setTimestamp({ hours: "", minutes: "", seconds: "" });

        setShabads([]);
        setCurrShabad({});
        setLineClicked("");
        setFromShabadID("");
        setDescription("");

        alert(res.data.message);
        console.log(res);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    setModal(false);
  }

  function ShowShabads() {
    if (shabadsReturnedFromSearch.length === 0) return <></>;

    function LineIndex() {
      return (
        <IconButton
          onClick={(e) => {
            e.preventDefault();
            console.log(currShabad);
            setDescription(lineClicked);
            setFromShabadID("");
          }}
        >
          <div className="flex flex-col p-0.5 text-xs items-center justify-center rounded-lg bg-blue-600 text-white">
            <div className="w-full flex-1 flex-col text-left">
              <label className="basis-1/2">
                Click to index only this line:
              </label>
            </div>
            <div className="w-full flex-1 flex-col text-left">
              <p className="w-52 truncate">{lineClicked}</p>
            </div>
          </div>
        </IconButton>
      );
    }

    function ViewFullShabad() {
      const [shabadViewModal, setShabadViewModal] = useState(false);
      return (
        <>
          <IconButton onClick={() => setShabadViewModal(true)}>
            <div className="w-full p-0.5 text-xs items-center justify-center rounded-lg bg-blue-600 text-white">
              View Full Shabad: {formShabadID}
            </div>
          </IconButton>
          <Modal
            open={shabadViewModal}
            onClose={() => setShabadViewModal(false)}
          >
            <div className="h-full w-full p-1 bg-primary-100 text-white p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
              <div className="h-5/6 overflow-auto border-2 border-sky-500 rounded">
                <ShabadDetails shabadArray={currShabad.shabadArray} />
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

    return (
      <div className="flex flex-col gap-1">
        <h1>{shabadsReturnedFromSearch.length} Results</h1>
        <div className="overflow-auto h-24 border-2 border-sky-500 rounded">
          {shabadsReturnedFromSearch.map((sbd, ind) => {
            const { shabadID, lineInd, shabadArray } = sbd;
            const line = shabadArray[lineInd];

            return (
              <IconButton
                key={shabadID}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrShabad(sbd);

                  setLineClicked(line);
                  setFromShabadID(shabadID);
                  setDescription(shabadArray[lineInd + 1]);
                }}
              >
                <div className="text-white text-xs bg-blue-600 px-1  rounded-lg">{line}</div>
              </IconButton>
            );
          })}
        </div>
        <div className="flex flex-col w-full text-white  border-2 border-sky-500 rounded">
          <LineIndex />
          <ViewFullShabad />
        </div>
      </div>
    );
  }

  function TrackOptions() {
    const trackTypes = [
      "random",
      "SDO_MGA_1",
      "HeeraRattan",
      "sikhsoul_SDO",
      "ikirtan_SDO",
      "aisakirtan_SDO",
      // "GianiSherS",
    ];

    return (
      <div className="flex justify-evenly h-10">
        <label className="text-sm">Type of Track:</label>
        <select
          className=" bg-blue-600 rounded-lg"
          name="trackType"
          id="trackType"
          value={theTrackType}
          defaultValue={theTrackType}
          onChange={(e) => {
            localStorage.setItem("IndexTrack trackType", e.target.value);
            setTrackType(e.target.value);
          }}
        >
          {trackTypes.map((trackType) => {
            return (
              <option key={trackType} value={trackType}>
                {trackType}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <div>
      <IconButton onClick={() => setModal(true)}>
        <div className="m-1 p-2 text-xs rounded bg-btn">Index Track</div>
      </IconButton>
      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div className="flex items-center h-[90%] overflow-y-auto bg-primary-100 text-white p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
          <form
            ref={formData}
            className="flex flex-col gap-4"
            onSubmit={(event) => formValidation(event)}
            method="post"
            // action="http://45.76.2.28/trackIndex/util/addData.php"
          >
            <div className="flex flex-col items-center justify-center rounded-lg  p-2 bg-blue-600 ">
              <div className="flex-1 flex text-xs w-full text-left ">
                <label>Description:</label>
              </div>
              <div className="flex flex-row gap-1 w-full items-center ">
                <input
                  className="flex-1 rounded-md text-black w-48 h-full"
                  name="description"
                  placeholder="bin ek naam ik chit leen"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <div className="flex-1">
                  <CancelIcon onClick={() => setDescription("")} />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-blue-600 ">
              <div className="flex-1 flex text-xs w-full text-left ">
                <label>Shabad ID:</label>
              </div>
              <div className="flex flex-row gap-1 w-full items-center ">
                <input
                  className="flex-1 rounded-md text-black w-40 h-full"
                  placeholder="ਤਕਮਲ"
                  value={formShabadID}
                  onChange={async (event) => {
                    const newInput = await convertToGurmukhi(
                      event.target.value,
                    );
                    setFromShabadID(newInput);
                  }}
                />
                <IconButton
                  onClick={async () => {
                    if (formShabadID.length < 3) {
                      alert("Input should be at least 3 characters long");
                      return;
                    }

                    const sbds = await getTheShabads(
                      formShabadID,
                      GET_SHABADS_URL,
                    );
                    if (sbds.length === 0) {
                      alert("0 Shabads found");
                    } else if (sbds.length === 1) {
                      const sbd = sbds[0];
                      const lineInd = sbd.lineInd;
                      const shabadArray = sbd.shabadArray;
                      console.log(sbd);
                      setCurrShabad(sbd);

                      setLineClicked(shabadArray[lineInd]);
                      setFromShabadID(sbd.shabadID);
                      setDescription(shabadArray[lineInd + 1]);
                    }
                    setShabads(sbds);
                  }}
                >
                  <div className="text-sm flex-1 h-5 text-white">
                    <SearchIcon />
                  </div>
                </IconButton>
              </div>
            </div>

            <ShowShabads />

            <div className="flex flex-col items-center justify-center rounded-lg p-2 bg-blue-600 ">
              <div className="flex-1 flex text-xs w-full text-left ">
                <label>Timestamp:</label>
              </div>
              <div className="flex-1 flex w-full text-black">
                <div className="w-full flex h-6 ">
                  <input
                    className="flex-1 w-10 rounded-md  "
                    name="hours"
                    type="number"
                    min="0"
                    max="59"
                    inputMode="numeric"
                    placeholder="00"
                    value={timestamp.hours}
                    onChange={(event) =>
                      setTimestamp({ ...timestamp, hours: event.target.value })
                    }
                  />
                  :
                  <input
                    className="flex-1 w-10 rounded-md "
                    name="mins"
                    type="number"
                    min="0"
                    max="59"
                    inputMode="numeric"
                    placeholder="00"
                    value={timestamp.minutes}
                    onChange={(event) =>
                      setTimestamp({
                        ...timestamp,
                        minutes: event.target.value,
                      })
                    }
                  />
                  :
                  <input
                    className="flex-1 w-10 rounded-md "
                    name="secs"
                    type="number"
                    min="0"
                    max="59"
                    inputMode="numeric"
                    placeholder="00"
                    value={timestamp.seconds}
                    onChange={(event) =>
                      setTimestamp({
                        ...timestamp,
                        seconds: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-center h-6">
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      if (audioRef === null) return;
                      const currTime = audioRef.current.currentTime;
                      const hours = Math.floor(currTime / 3600);
                      const minutes = Math.floor((currTime % 3600) / 60);
                      const seconds = Math.floor(currTime % 60);
                      setTimestamp({
                        hours: hours.toString(),
                        minutes: minutes.toString(),
                        seconds: seconds.toString(),
                      });
                    }}
                  >
                    <p className="flex-1 text-xs p-1  bg-gray-200 rounded-md">
                      now
                    </p>
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      setTimestamp({
                        hours: "",
                        minutes: "",
                        seconds: "",
                      })
                    }
                  >
                    <div className="flex-1 flex">
                      <CancelIcon className="flex-1  text-white" />
                    </div>
                  </IconButton>
                </div>
              </div>
            </div>
            <TrackOptions />
            <div className="flex justify-center gap-3">
              <IconButton onClick={() => setModal(false)}>
                <p className="text-sm p-1 bg-red-500 text-white rounded-lg">
                  Close
                </p>
              </IconButton>
              <IconButton type="submit">
                <p className="text-sm  p-1 bg-green-500 text-white rounded-lg">
                  Add
                </p>
              </IconButton>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function getTimestampString(obj) {
  let hours = obj.hours.toString();
  let minutes = obj.minutes.toString();
  let seconds = obj.seconds.toString();
  if (hours === "") hours = "00";
  if (minutes === "") minutes = "00";
  if (seconds === "") seconds = "00";

  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");
  seconds = seconds.padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
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

async function getTheShabads(input, GET_SHABADS_URL) {
  const res = await fetch(GET_SHABADS_URL + input);
  const { results } = await res.json();
  return results;
}

function convertToGurmukhi(input) {
  const mapping = {
    a: "ੳ",
    A: "ਅ",
    s: "ਸ",
    S: "ਸ਼",
    d: "ਦ",
    D: "ਧ",
    f: "ਡ",
    F: "ਢ",
    g: "ਗ",
    G: "ਘ",
    h: "ਹ",
    H: "੍ਹ",
    j: "ਜ",
    J: "ਝ",
    k: "ਕ",
    K: "ਖ",
    l: "ਲ",
    L: "ਲ਼",
    q: "ਤ",
    Q: "ਥ",
    w: "ਾ",
    W: "ਾਂ",
    e: "ੲ",
    E: "ਓ",
    r: "ਰ",
    R: "੍ਰ",
    "®": "੍ਰ",
    t: "ਟ",
    T: "ਠ",
    y: "ੇ",
    Y: "ੈ",
    u: "ੁ",
    ü: "ੁ",
    U: "ੂ",
    "¨": "ੂ",
    i: "ਿ",
    I: "ੀ",
    o: "ੋ",
    O: "ੌ",
    p: "ਪ",
    P: "ਫ",
    z: "ਜ਼",
    Z: "ਗ਼",
    x: "ਣ",
    X: "ਯ",
    c: "ਚ",
    C: "ਛ",
    v: "ਵ",
    V: "ੜ",
    b: "ਬ",
    B: "ਭ",
    n: "ਨ",
    ƒ: "ਨੂੰ",
    N: "ਂ",
    ˆ: "ਂ",
    m: "ਮ",
    M: "ੰ",
    µ: "ੰ",
    "`": "ੱ",
    "~": "ੱ",
    "¤": "ੱ",
    Í: "੍ਵ",
    ç: "੍ਚ",
    "†": "੍ਟ",
    œ: "੍ਤ",
    "˜": "੍ਨ",
    "´": "ੵ",
    Ï: "ੵ",
    æ: "਼",
    Î: "੍ਯ",
    ì: "ਯ",
    í: "੍ਯ",
    // 1: '੧',
    // 2: '੨',
    // 3: '੩',
    // 4: '੪',
    // 5: '੫',
    // 6: '੬',
    // '^': 'ਖ਼',
    // 7: '੭',
    // '&': 'ਫ਼',
    // 8: '੮',
    // 9: '੯',
    // 0: '੦',
    "\\": "ਞ",
    "|": "ਙ",
    "[": "।",
    "]": "॥",
    "<": "ੴ",
    "¡": "ੴ",
    Å: "ੴ",
    Ú: "ਃ",
    Ç: "☬",
    "@": "ੑ",
    "‚": "❁",
    "•": "੶",
    " ": " ",
  };
  const gurmukhi_input = input
    .split("")
    .map((char) => mapping[char] || char)
    .join("");
  return gurmukhi_input;
}
