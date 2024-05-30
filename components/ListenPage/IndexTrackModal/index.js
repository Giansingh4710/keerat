"use client";

import ALL_THEMES from "@/utils/themes.js";
import { Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import { useStore } from "@/utils/store.js";
import { IconButton } from "@mui/material";
import axios from "axios";

export default function IndexTrackBtnAndModal({ audioRef, saveTimeFunc }) {
  const [modalOpen, setModal] = useState(false);
  const [description, setDescription] = useState("");
  const [shabadId, setShabadId] = useState("");
  const [shabads, setShabads] = useState([]);
  const [currShabad, setCurrShabad] = useState({});
  const [lineClicked, setLineClicked] = useState("");
  const [theTrackType, setTrackType] = useState("");
  const formData = useRef(null);

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
      alert("You are not allowed to post data to the track index");
      const password = prompt("Enter password if you to save data?");
      if (password.toLowerCase() === "dgn") {
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
    axios({
      // url:"http://localhost:3001/addIndex",
      url: "https://www.getshabads.xyz/addIndex",
      method: "POST",
      data: {
        description,
        shabadId,
        timestamp: theTimeStamp,
        trackType: theTrackType, // fix artist and type
        artist,
        link,
      },
    })
      .then((res) => {
        alert(res.data.message);
        console.log(res);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    setModal(false);
  }

  function ShowShabads() {
    if (shabads.length === 0) return <></>;
    function SbdDetails() {
      return (
        <div>
          <button
            className="bg-blue-600 p-1 m-1 rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              console.log(currShabad);
              setDescription(lineClicked);
              setShabadId("");
            }}
          >
            {lineClicked}
          </button>
          <details>
            <summary>{shabadId}</summary>
            <ShabadDetails shabadArray={currShabad.shabadArray} />
          </details>
        </div>
      );
    }

    return (
      <div className="text-white h-20 overflow-auto">
        <SbdDetails />
        <h1>{shabads.length} Results</h1>
        {shabads.map((sbd, ind) => {
          const { shabadId, lineInd, shabadArray } = sbd;
          const line = shabadArray[lineInd];

          return (
            <button
              className="bg-blue-600 p-1 m-1 rounded-lg"
              key={shabadId}
              onClick={(e) => {
                e.preventDefault();
                setCurrShabad(sbd);

                setLineClicked(line);
                setShabadId(shabadId);
                setDescription(shabadArray[lineInd + 1]);
              }}
            >
              {line}
            </button>
          );
        })}
      </div>
    );
  }

  function TrackOptions() {
    const trackTypes = [
      "random",
      "SDO_MGA_1",
      "HeeraRattan",
      "ikirtan_SDO",
      "GianiSherS",
    ];

    return (
      <div>
        <label>Type of Track:</label>
        <select
          className="m-1 p-1 bg-blue-600 rounded-lg"
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
        <div className="bg-primary-100 text-white p-8 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4">
          <form
            ref={formData}
            className="flex flex-col gap-4"
            onSubmit={(event) => formValidation(event)}
            method="post"
            // action="http://45.76.2.28/trackIndex/util/addData.php"
          >
            <div className="flex flex-col items-center justify-center rounded-lg mb-2 p-2 bg-blue-600 ">
              <div className="flex-1 flex text-xs w-full text-left ">
                <label> Description: </label>
              </div>
              <div className="flex flex-row gap-1">
                <input
                  className="flex-1 rounded-md text-black"
                  name="description"
                  placeholder="bin ek naam ik chit leen"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <CancelIcon
                  className="flex-1"
                  onClick={() => setDescription("")}
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg mb-2 p-2 bg-blue-600 ">
              <div className="flex-1 flex text-xs w-full text-left ">
                <label>Shabad ID:</label>
              </div>
              <div className="flex flex-row gap-1">
                <input
                  className="flex-1 rounded-md text-black"
                  name="shabadId"
                  placeholder="ਤਕਮਲ"
                  value={shabadId}
                  onChange={async (event) => {
                    const newInput = await convertToGurmukhi(
                      event.target.value,
                    );
                    setShabadId(newInput);
                  }}
                />
                <SearchIcon
                  className="flex-1"
                  onClick={async () => {
                    const sbds = await getTheShabads(shabadId);
                    if (sbds.length === 0) {
                      alert("0 Shabads found");
                    } else if (sbds.length === 1) {
                      const sbd = sbds[0];
                      const lineInd = sbd.lineInd;
                      const shabadArray = sbd.shabadArray;
                      console.log(sbd);
                      setCurrShabad(sbd);

                      setLineClicked(shabadArray[lineInd]);
                      setShabadId(sbd.shabadId);
                      setDescription(shabadArray[lineInd + 1]);
                    }
                    setShabads(sbds);
                  }}
                />
              </div>
            </div>

            <ShowShabads />

            <div className="flex flex-col items-center justify-center rounded-lg mb-2 p-2 bg-blue-600 ">
              <div className="flex-1 flex text-xs w-full text-left ">
                <label>Timestamp:</label>
              </div>
              <div className="flex-1 flex w-full text-black">
                <div className="flex-1 flex">
                  <input
                    className="flex-1 w-10 rounded-md "
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
                <div>
                  <button
                    className="ml-2 p-2 bg-gray-200 rounded-md"
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
                    now
                  </button>
                  <CancelIcon
                    className="ml-2"
                    onClick={() =>
                      setTimestamp({
                        hours: "",
                        minutes: "",
                        seconds: "",
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <TrackOptions />
            <div className="flex justify-center gap-3">
              <button
                className="mt-2 p-2 bg-red-500 text-white rounded-lg"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                type="submit"
                className="mt-2 p-2 bg-green-500 text-white rounded-lg"
              >
                Add
              </button>
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

async function getTheShabads(input) {
  if (input.length < 3) {
    alert("Input should be at least 3 characters long");
    return [];
  }
  const res = await fetch(
    "https://www.getshabads.xyz/getShabads?input=" + input,
    // "http://localhost:3001/getShabads?input=" + input,
  );
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
