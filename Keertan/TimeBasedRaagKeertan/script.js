const tracksPlayed = [];
let currentTrackPointer = -1;
const keertani = document.getElementById("MainTitle").innerText;
playTrackFromLastTime()

function playNextTrack() {
  document.getElementById("playNext").innerHTML = "Next &rarr;";
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

function playTrack(trkInd, pushToLst = false, showMsg = false) {
  const h4 = document.getElementById("trackMsg");
  h4.innerText = "";

  if (pushToLst) {
    tracksPlayed.push(trkInd);
    currentTrackPointer = tracksPlayed.length - 1;
    if (showMsg) {
      h4.innerText = showMsg;
    }
  }

  const trackPlaying = document.getElementById("trackPlaying");
  const theLinkOfTrack = TRACK_LINKS[trkInd];
  const theNameOfTrack = getNameOfTrack(theLinkOfTrack)
  trackPlaying.innerHTML = `
    <h3>
        <a 
          href=${theLinkOfTrack.replaceAll(" ", "%20")} 
          target="_blank"
          rel="noopener noreferrer"
        >
            ${theNameOfTrack}
        </a>
    </h3>`

  trackPlaying.innerHTML += `
    <audio onended="playNextTrack()" onerror="" controls autoPlay={true} src='${theLinkOfTrack}' >
      your browers doesn't support this file or the the file is corrupted
    </audio>`

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: theNameOfTrack,
      artist: keertani,
      album: 'Vaheguru Jio'
    })
  }
  localStorage.setItem("LastPlayed: " + keertani, trkInd)
}

function playTrackFromLastTime() {
  let trackInd = localStorage.getItem("LastPlayed: " + keertani);
  if (trackInd)
    playTrack(trackInd, true);
  else
    console.log("Could not get link from last session!")
}

function getNameOfTrack(link){return link.split('/').slice(-1)[0]}


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
