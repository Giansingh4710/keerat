const tracksPlayed = []
let TRACK_LINKS = []
let currentTrackPointer = -1
let skipByInterval = "10";

const MAIN_TITLE = document.getElementsByTagName('title')[0].innerHTML
document.getElementById('MainTitle').innerText = MAIN_TITLE


const savedTracksKey = `SavedTracks: ${MAIN_TITLE}` //for localStorage
const checkedOptsKey = `CheckedOptions: ${MAIN_TITLE}`
const skipByKey =`Skip By Interval: ${MAIN_TITLE}`

put_options()
get_last_track_and_checked()
navigatorStuff()
activateModal()

function playNextTrack() {
  if (tracksPlayed.length === 0) {
    playRandTrack()
    return
  }

  let newTrackInd

  if (tracksPlayed.length - 1 === currentTrackPointer) {
    newTrackInd = tracksPlayed[currentTrackPointer] + 1
    newTrackInd = newTrackInd > TRACK_LINKS.length - 1 ? 0 : newTrackInd
    tracksPlayed.push(newTrackInd)
    currentTrackPointer += 1
  } else {
    currentTrackPointer += 1
    newTrackInd = tracksPlayed[currentTrackPointer]
  }
  playTrack(TRACK_LINKS[newTrackInd])
}

function playPreviousTrack() {
  let newTrackInd
  if (currentTrackPointer === 0) {
    newTrackInd = tracksPlayed[currentTrackPointer] - 1
    newTrackInd = newTrackInd === -1 ? TRACK_LINKS.length - 1 : newTrackInd
    tracksPlayed.unshift(newTrackInd)
  } else {
    currentTrackPointer -= 1
    newTrackInd = tracksPlayed[currentTrackPointer]
  }

  if (TRACK_LINKS[newTrackInd] === undefined) {
    playRandTrack()
  } else {
    playTrack(TRACK_LINKS[newTrackInd])
  }
}

function playRandTrack() {
  const randNum = Math.floor(Math.random() * TRACK_LINKS.length)
  tracksPlayed.push(randNum)
  currentTrackPointer = tracksPlayed.length - 1
  playTrack(TRACK_LINKS[randNum])
}

function playTrack(theLinkOfTrack) {
  const artist = getTypeOfTrack(theLinkOfTrack)
  /* console.log(tracksPlayed, currentTrackPointer, theLinkOfTrack,artist) */
  console.log(tracksPlayed, `CurrentTrackPointer Index: ${currentTrackPointer}`)
  const theNameOfTrack = getNameOfTrack(theLinkOfTrack)
  const aTag = document.getElementById('trackNameAtag')
  const audioTag = document.getElementsByTagName('audio')[0]

  aTag.innerText = theNameOfTrack
  aTag.href = theLinkOfTrack
  audioTag.src = theLinkOfTrack

  document.getElementById('trackPlaying').style.display = 'block'
  document.getElementById('trackFromWhichOpt').innerText = artist

  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: theNameOfTrack,
      artist: artist,
      album: MAIN_TITLE,
    })
  }
  localStorage.setItem(`LastPlayed: ${MAIN_TITLE}`, theLinkOfTrack)
}

function saveTrack() {
  const note = document.getElementById('noteForSavedTrack')
  putTrackInLocalStorage(
    TRACK_LINKS[tracksPlayed[currentTrackPointer]],
    note.value
  )
  note.value = ''
  let modal = document.getElementById('myModal')
  modal.style.display = 'none'
}

function deleteSavedTrack(link) {
  let savedTracks = localStorage.getItem(savedTracksKey)
  savedTracks = JSON.parse(savedTracks)
  delete savedTracks[link]
  localStorage.setItem(savedTracksKey, JSON.stringify(savedTracks))
  toggleSavedTracks()
  toggleSavedTracks()
}

function putTrackInLocalStorage(link, note) {
  let savedItems = localStorage.getItem(savedTracksKey)
  if (!savedItems) {
    savedItems = {}
  } else {
    savedItems = JSON.parse(savedItems)
  }

  savedItems[link] = note
  localStorage.setItem(savedTracksKey, JSON.stringify(savedItems))
}

function toggleSavedTracks() {
  const ol = document.getElementById('savedShabads')
  ol.style.display = 'block'
  if (ol.innerHTML !== '') {
    ol.innerHTML = ''
    ol.style.display = 'none'
    ol.style.display = 'none'
    return
  }

  let savedTracks = localStorage.getItem(`SavedTracks: ${MAIN_TITLE}`)
  savedTracks = JSON.parse(savedTracks)
  /* console.log(savedTracks) */

  for (const link in savedTracks) {
    const theNameOfTrack = getNameOfTrack(link)
    const trkMsg = savedTracks[link].replaceAll('\n', ' ')
    li = document.createElement('li')
    li.innerHTML = `${trkMsg}<button onclick="playTrack('${link}')" > ${theNameOfTrack}</button><button onclick="deleteSavedTrack('${link}')" >DELETE</button>`
    ol.appendChild(li)
    /* console.log(theNameOfTrack, ": ", trkMsg); */
  }
  if (!savedTracks || Object.keys(savedTracks).length === 0) {
    ol.innerText = 'No Saved Tracks. Click the Save button to Save tracks'
  }
}

function toggleShowingTracks() {
  const theDiv = document.getElementById('showAllTracks')
  if (theDiv.innerHTML === '') {
    theDiv.innerHTML = `<h5>There are ${TRACK_LINKS.length} tracks</h5>`
    const ol = document.createElement('ol')
    for (const link of TRACK_LINKS) {
      const li = document.createElement('li')
      li.innerHTML += `<button onclick="playTrack('${link}')">${getNameOfTrack(
        link
      )}</button>`
      ol.appendChild(li)
    }
    theDiv.appendChild(ol)
  } else {
    theDiv.innerHTML = ''
  }
}

function toggleShowingOpts() {
  const theDiv = document.getElementById('tracksOpts')
  const toggleBtn = document.getElementById('toggleShowingOpts')
  if (theDiv.style.display !== 'none') {
    theDiv.style.display = 'none'
    toggleBtn.innerText = 'Show The Options'
  } else {
    theDiv.style.display = 'block'
    toggleBtn.innerText = 'Hide The Options'
  }
}

function searchForShabad(e) {
  const searchVal = e
  const ol = document.getElementById('searchResults')

  const allLinksWithWordInds = []

  const searchWordsLst = searchVal.toLowerCase().split(' ')
  TRACK_LINKS.forEach((link, index) => {
    /* const trackName = getNameOfTrack(link) */
    const trackName = link.toLowerCase()
    let allWordsInTrackName = true
    for (const word of searchWordsLst) {
      if (!trackName.includes(word)) {
        allWordsInTrackName = false
        break
      }
    }
    if (allWordsInTrackName) {
      allLinksWithWordInds.push(index)
    }
  })

  ol.innerHTML = `<p>${allLinksWithWordInds.length} Results Found</p>`
  if (searchVal === '') {
    ol.innerHTML = ''
    return
  }

  for (const index of allLinksWithWordInds) {
    li = document.createElement('li')
    /* console.log(TRACK_LINKS[index]) */
    li.innerHTML = `<button onclick="playTrackForSearchedTrack(${index})">${getNameOfTrack(
      TRACK_LINKS[index]
    )}</button>`
    ol.appendChild(li)
  }
}

function navigatorStuff() {
  const theAudioPlayer = document.getElementsByTagName('audio')[0]
  navigator.mediaSession.setActionHandler('play', () => theAudioPlayer.play())
  navigator.mediaSession.setActionHandler('pause', () => theAudioPlayer.pause())

  navigator.mediaSession.setActionHandler('seekforward', () =>
    skipTrackTime(1)
  )
  navigator.mediaSession.setActionHandler('seekbackward', () =>
    skipTrackTime(-1)
  )
  navigator.mediaSession.setActionHandler('previoustrack', playPreviousTrack)
  navigator.mediaSession.setActionHandler('nexttrack', playNextTrack)

  navigator.mediaSession.setActionHandler('seekto', function (event) {
    theAudioPlayer.currentTime = event.seekTime
  })
}

function getNameOfTrack(link) {
  const title = link.split('/').slice(-1)[0]
  return decodeURIComponent(decodeURIComponent(title))
}

function activateModal() {
  let modal = document.getElementById('myModal')
  let btn = document.getElementById('saveTrackBtn')
  let span = document.getElementsByClassName('close')[0]
  btn.onclick = function () {
    modal.style.display = 'block'
  }
  span.onclick = function () {
    modal.style.display = 'none'
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  }
}

function playTrackForSearchedTrack(ind) {
  playTrack(TRACK_LINKS[ind])
  tracksPlayed.push(ind)
  currentTrackPointer = tracksPlayed.length - 1
}

function excludeOrIncludeTracks() {
  const newLinks = []
  const checkedOpts = {}
  for (const opt in ALL_OPTS) {
    const val = document.getElementById(opt).checked
    ALL_OPTS[opt].checked = val
    if (val) {
      newLinks.push(...ALL_OPTS[opt].trackLinks)
      checkedOpts[opt] = true
    } else {
      checkedOpts[opt] = false
    }
  }
  localStorage.setItem(checkedOptsKey, JSON.stringify(checkedOpts))
  TRACK_LINKS = newLinks
  document.getElementById(
    'tracksData'
  ).innerText = `Total Tracks in Queue: ${TRACK_LINKS.length}`
}

function get_last_track_and_checked() {
  const checkedOpts = JSON.parse(localStorage.getItem(checkedOptsKey)) //{opt:true/false}
  if (checkedOpts) {
    for (const opt in checkedOpts) {
      document.getElementById(opt).checked = checkedOpts[opt]
    }
    excludeOrIncludeTracks() //to change tracks pool
  } else {
    console.log('Could not get Checked Options from last Session')
    document.getElementById(
      'tracksData'
    ).innerText = `Total Tracks in Queue: ${TRACK_LINKS.length}`
  }

  const link = localStorage.getItem(`LastPlayed: ${MAIN_TITLE}`)
  if (link) {
    console.log('Played from Last Session')
    tracksPlayed.push(TRACK_LINKS.indexOf(link))
    currentTrackPointer = tracksPlayed.length - 1
    playTrack(link)
  } else {
    playNextTrack()
  }

  const skipByOpt = JSON.parse(localStorage.getItem(skipByKey)) 
  if (skipByOpt){
    skipByInterval = skipByOpt;
  }
  document.getElementById('pickSkipInterval').value = skipByInterval
}

function getTypeOfTrack(link) {
  let trackType = 'Unable To Get Info'
  const ind = TRACK_LINKS.indexOf(link)
  if (ind > -1) {
    let totalTrack = 0
    for (const opt in ALL_OPTS) {
      if (ALL_OPTS[opt].checked) {
        const len = ALL_OPTS[opt].trackLinks.length
        totalTrack += len
        if (ind <= totalTrack) {
          trackType = opt
          break
        }
      }
    }
  }
  return trackType
}

function toggleDropdown() {
  let x = document.getElementsByClassName('topnav')[0]
  if (x.className === 'topnav') {
    x.className += ' responsive'
  } else {
    x.className = 'topnav'
  }
}

function put_options() {
  const opts = Object.keys(ALL_OPTS)
  const div_to_put_opts = document.getElementById('tracksOpts')
  for (const title of opts) {
    input = document.createElement('input')
    input.checked = ALL_OPTS[title].checked
    input.type = 'checkbox'
    input.id = title
    input.name = title
    input.onclick = () => excludeOrIncludeTracks()

    label = document.createElement('label')
    label.setAttribute('for', title)
    label.innerText = title

    div_to_put_opts.appendChild(input)
    div_to_put_opts.appendChild(label)
    div_to_put_opts.appendChild(document.createElement('br'))

    TRACK_LINKS.push(...ALL_OPTS[title].trackLinks)
  }
}

function togglePausePlayTrack() {
  const audioPlayer = document.getElementsByTagName('audio')[0]
  const btn = document.getElementById('playPauseBtn')
  if (audioPlayer.paused) {
    audioPlayer.play()
    btn.src = '/imgs/pause.png'
  } else {
    audioPlayer.pause()
    btn.src = '/imgs/play.png'
  }
}

function check_uncheck_opts(val = false) {
  const opts = Object.keys(ALL_OPTS)
  for (const title of opts) {
    input = document.getElementById(title)
    input.checked = val
  }
  excludeOrIncludeTracks()
}

function skipTrackTime(direction) {
  document.getElementsByTagName('audio')[0].currentTime += parseInt(skipByInterval) * direction
}


function changeInterval(){
  const chosed_skipByOpt = document.getElementById('pickSkipInterval').value
  skipByInterval = chosed_skipByOpt
  localStorage.setItem(skipByKey, chosed_skipByOpt)

}
