const tracksPlayed = [];
let currentTrackPointer = -1;
const MAIN_TITLE = document.getElementById("MainTitle").innerText;

playTrackFromLastTime()
navigatorStuff()
activateModal();

function playNextTrack() {
  if (tracksPlayed.length === 0) {
    playRandTrack();
    return;
  }

  let newTrackInd;

  if (tracksPlayed.length - 1 === currentTrackPointer) {
    newTrackInd = tracksPlayed[currentTrackPointer] + 1;
    newTrackInd = newTrackInd > TRACK_LINKS.length - 1 ? 0 : newTrackInd;
    tracksPlayed.push(newTrackInd);
    currentTrackPointer += 1
  } else {
    currentTrackPointer += 1;
    newTrackInd = tracksPlayed[currentTrackPointer];
  }
  playTrack(TRACK_LINKS[newTrackInd]);
}

function playPreviousTrack() {
  let newTrackInd;
  if (currentTrackPointer === 0) {
    newTrackInd = tracksPlayed[currentTrackPointer] - 1;
    newTrackInd = newTrackInd === -1 ? TRACK_LINKS.length - 1 : newTrackInd;
    tracksPlayed.unshift(newTrackInd);
  } else {
    currentTrackPointer -= 1;
    newTrackInd = tracksPlayed[currentTrackPointer]
  }

  playTrack(TRACK_LINKS[newTrackInd]);
}

function playRandTrack() {
  const randNum = Math.floor(Math.random() * TRACK_LINKS.length);
  tracksPlayed.push(randNum);
  currentTrackPointer = tracksPlayed.length - 1;
  playTrack(TRACK_LINKS[randNum]);
}

function playTrack(theLinkOfTrack) {
  console.log(tracksPlayed, currentTrackPointer, theLinkOfTrack)
  const theNameOfTrack = getNameOfTrack(theLinkOfTrack);
  const aTag = document.getElementById("trackNameAtag");
  const audioTag = document.getElementsByTagName("audio")[0];

  aTag.innerText = theNameOfTrack;
  aTag.href = theLinkOfTrack;
  audioTag.src = theLinkOfTrack

  document.getElementById("trackPlaying").style.display = "block"

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: theNameOfTrack,
      artist: MAIN_TITLE,
      album: 'Vaheguru Jio'
    })
  }
  /* localStorage.setItem("LastPlayed: " + MAIN_TITLE, theLinkOfTrack) */
  localStorage.setItem(`LastPlayed: ${MAIN_TITLE}`, theLinkOfTrack)
}

function saveTrack() {
  const note = document.getElementById("noteForSavedTrack");
  putTrackInLocalStorage(TRACK_LINKS[tracksPlayed[currentTrackPointer]], note.value);
  note.value = "";
  let modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function deleteSavedTrack(link) {
  let savedTracks = localStorage.getItem(MAIN_TITLE);
  savedTracks = JSON.parse(savedTracks);
  delete savedTracks[link];
  localStorage.setItem(MAIN_TITLE, JSON.stringify(savedTracks));
  toggleSavedTracks();
  toggleSavedTracks();
}

function putTrackInLocalStorage(trackInd, note) {
  let savedTracks = localStorage.getItem(MAIN_TITLE);
  if (!savedTracks) {
    savedTracks = {};
  } else {
    savedTracks = JSON.parse(savedTracks);
  }
  savedTracks[trackInd] = note;
  localStorage.setItem(MAIN_TITLE, JSON.stringify(savedTracks));
}

function toggleSavedTracks() {
  const ol = document.getElementById("savedShabads");
  if (ol.innerHTML !== "") {
    ol.innerHTML = "";
    return;
  }

  let savedTracks = localStorage.getItem(MAIN_TITLE);
  savedTracks = JSON.parse(savedTracks);
  /* console.log(savedTracks) */

  for (const link in savedTracks) {
    const theNameOfTrack = getNameOfTrack(link)
    const trkMsg = savedTracks[link].replaceAll("\n", " ");
    li = document.createElement("li");
    li.innerHTML = `${trkMsg}<button onclick="playTrack('${link}')" > ${theNameOfTrack}</button><button onclick="deleteSavedTrack('${link}')" >DELETE</button>`;
    ol.appendChild(li);
    /* console.log(theNameOfTrack, ": ", trkMsg); */
  }
}

function playTrackFromLastTime() {
  const link = localStorage.getItem(`LastPlayed: ${MAIN_TITLE}`);

  if (link) {
    console.log("Played from Last Session");
    tracksPlayed.push(TRACK_LINKS.indexOf(link));
    currentTrackPointer = tracksPlayed.length - 1;
    playTrack(link);
  }
  else {
    console.log("Could not get link from last session!");
    playNextTrack();
  }
}

function searchForShabad(e) {
  const searchVal = e;
  const ol = document.getElementById("searchResults");

  const allLinksWithWordInds = [];

  const searchWordsLst = searchVal.toLowerCase().split(' ')
  TRACK_LINKS.forEach((link, index) => {
    /* const trackName = getNameOfTrack(link) */
    const trackName = link.toLowerCase()
    let allWordsInTrackName = true
    for (const word of searchWordsLst) {
      if (!trackName.includes(word)) {
        allWordsInTrackName = false;
        break
      }
    }
    if (allWordsInTrackName) {
      allLinksWithWordInds.push(index);
    }
  });

  ol.innerHTML = `<p>${allLinksWithWordInds.length} Results Found</p>`;
  if (searchVal === "") {
    ol.innerHTML = "";
    return;
  };

  for (const index of allLinksWithWordInds) {
    li = document.createElement("li");
    /* console.log(TRACK_LINKS[index]) */
    li.innerHTML = `<button onclick="playTrackForSearchedTrack(${index})">${getNameOfTrack(TRACK_LINKS[index])}</button>`;
    ol.appendChild(li);
  }
}


function navigatorStuff() {
  navigator.mediaSession.setActionHandler('previoustrack', () => playPreviousTrack())
  navigator.mediaSession.setActionHandler('nexttrack', () => playNextTrack())
  navigator.mediaSession.setActionHandler('play', () => {
    const theAudioPlayer = document.getElementsByTagName('audio')[0]
    console.log("Played");
    theAudioPlayer.play()
  })
  navigator.mediaSession.setActionHandler('pause', () => {
    const theAudioPlayer = document.getElementsByTagName('audio')[0]
    console.log("Paused");
    theAudioPlayer.pause()
  })
}

function getNameOfTrack(link) { return link.split('/').slice(-1)[0] }

function activateModal() {
  let modal = document.getElementById("myModal");
  let btn = document.getElementById("saveTrackBtn");
  let span = document.getElementsByClassName("close")[0];
  btn.onclick = function() { modal.style.display = "block"; };
  span.onclick = function() { modal.style.display = "none"; };
  window.onclick = function(event) {
    if (event.target == modal) { modal.style.display = "none"; }
  };
}

function toggleShowingTracks() {
  const theDiv = document.getElementById("showAllTracks")
  if (theDiv.innerHTML === "") {
    theDiv.innerHTML = `<h5>There are ${TRACK_LINKS.length} tracks</h5>`
    const ol = document.createElement('ol')
    for (const link of TRACK_LINKS) {
      const li = document.createElement('li')
      li.innerHTML += `<a href='${link}'>${getNameOfTrack(link)}</a>`
      ol.appendChild(li)
    }
    theDiv.appendChild(ol)
  } else {
    theDiv.innerHTML = ''
  }
}

function playTrackForSearchedTrack(ind){
  playTrack(TRACK_LINKS[ind]);
  tracksPlayed.push(ind);
  currentTrackPointer = tracksPlayed.length-1;
}
