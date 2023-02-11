
const tracksPlayed = [];
let currentTrackPointer = -1;

function playNextTrack() {
  document.getElementById("playNext").innerHTML = "Play Random Track &rarr;";
  if (tracksPlayed.length - 1 == currentTrackPointer) {
    playRandTrack();
    return;
  }
  currentTrackPointer += 1;
  playTrack(tracksPlayed[currentTrackPointer]);
}

function playPreviousTrack() {
  if (currentTrackPointer < 1) {
    return;
  }
  currentTrackPointer -= 1;
  playTrack(tracksPlayed[currentTrackPointer]);
}

function playRandTrack() {
  const randNum = Math.floor(Math.random() * TRACK_LINKS.length);
  tracksPlayed.push(randNum);
  currentTrackPointer += 1;
  playTrack(randNum);
}

function playTrack(trkInd) {
  const h4 = document.getElementById("trackMsg");
  h4.innerText = "";
  const playerDiv = document.getElementById("trackPlaying");
  const theNameOfTrack = TRACK_NAMES[trkInd];
  console.log(theNameOfTrack)
  const theLinkOfTrack = TRACK_LINKS[trkInd];
  playerDiv.innerHTML = `
    <h3>
        <a 
          href=${theLinkOfTrack.replaceAll(" ", "%20")} 
          target="_blank"
          rel="noopener noreferrer"
        >
            ${theNameOfTrack}
        </a>
    </h3>
    <audio onended="playNextTrack()" onerror="playNextTrack()"  type="audio/mpeg" controls autoPlay={true} src='${theLinkOfTrack}' ></audio>`
}

const theAudioPlayer = document.getElementsByTagName('audio')[0]
navigator.mediaSession.setActionHandler('previoustrack', () => playPreviousTrack())
navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack())
navigator.mediaSession.setActionHandler('play', () => {
  const theAudioPlayer = document.getElementsByTagName('audio')[0]
  theAudioPlayer.play()
})
navigator.mediaSession.setActionHandler('pause', () => {
  const theAudioPlayer = document.getElementsByTagName('audio')[0]
  theAudioPlayer.pause()
})


function saveTrack() {
  const note = document.getElementById("noteForSavedTrack");
  putTrackInLocalStorage(tracksPlayed[currentTrackPointer], note.value);
  note.value = "";
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function deleteSavedTrack(trkInd) {
  const keertani = document.getElementById("MainTitle").innerText;
  let savedTracks = localStorage.getItem(keertani);
  savedTracks = JSON.parse(savedTracks);
  delete savedTracks[trkInd];
  localStorage.setItem(keertani, JSON.stringify(savedTracks));
  toggleSavedTracks();
  toggleSavedTracks();
}

function putTrackInLocalStorage(trackInd, note) {
  const keertani = document.getElementById("MainTitle").innerText;
  let savedTracks = localStorage.getItem(keertani);
  if (!savedTracks) {
    savedTracks = {};
  } else {
    savedTracks = JSON.parse(savedTracks);
  }
  savedTracks[trackInd] = note;
  localStorage.setItem(keertani, JSON.stringify(savedTracks));
}

function searchForShabad(e) {
  const searchVal = e;
  const ol = document.getElementById("searchResults");

  const trackNamesWithNums = TRACK_NAMES.map((elem, ind) => {
    const withNum = ind + 1 + ") " + elem.toLowerCase();
    return withNum;
  });

  const allTracksWithWord = trackNamesWithNums.filter((title) =>
    title.includes(searchVal.toLowerCase())
  );

  ol.innerHTML = "";
  if (searchVal === "") return;
  for (let track of allTracksWithWord) {
    const theNameOfTrack = track;
    const theTrackInd = parseInt(track.split(") ")[0]) - 1;
    li = document.createElement("li");
    li.innerHTML = `<button onclick="playTrack(${theTrackInd},true)">${theNameOfTrack}</button>`;
    ol.appendChild(li);
  }
}

/*
function toggleSavedTracks() {
  const ol = document.getElementById("savedShabads");
  if (ol.innerHTML !== "") {
    ol.innerHTML = "";
    return;
  }

  const keertani = document.getElementById("MainTitle").innerText;
  let savedTracks = localStorage.getItem(keertani);
  savedTracks = JSON.parse(savedTracks);

  function transferOldSaved() {
    const oldTitle =
      "All keertanis (SDO Ji,Bhai HPS Ji,Giani Amolak Singh Ji, Bhai Jeevan Singh Ji)";
    console.log("checked if need to tranfer");
    if (!localStorage[oldTitle]) return;
    console.log("transfering....");

    let _savedTracks = localStorage.getItem(oldTitle);
    _savedTracks = JSON.parse(_savedTracks);

    for (const theTrackInd in _savedTracks) {
      const trkMsg = _savedTracks[theTrackInd].replace("\n", " ");
      putTrackInLocalStorage(theTrackInd, trkMsg);
    }
    delete localStorage[oldTitle];
  }

  transferOldSaved();
  for (const theTrackInd in savedTracks) {
    const theNameOfTrack = TRACK_NAMES[theTrackInd];
    const trkMsg = savedTracks[theTrackInd].replace("\n", " ");
    li = document.createElement("li");
    li.innerHTML = `
        <button onclick="playTrack(${theTrackInd},true,'${trkMsg}')" > ${theNameOfTrack}</button>
        <button onclick="deleteSavedTrack(${theTrackInd})" >DELETE</button>
        <p>${trkMsg}</p>
        `;
    ol.appendChild(li);
    console.log(theNameOfTrack, ": ", trkMsg);
  }
}
*/
