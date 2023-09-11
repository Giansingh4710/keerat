const tracksPlayed = []
let TRACK_LINKS = []
let currentTrackPointer = -1
let skipByInterval = '10'
let shuffle = false

let currentLink // make it easier for sending to database
let currentArtist

const MAIN_TITLE = document.getElementsByTagName('title')[0].innerHTML
const theAudioPlayer = document.getElementsByTagName('audio')[0]
document.getElementById('MainTitle').innerText = MAIN_TITLE

const savedTracksKey = `SavedTracks: ${MAIN_TITLE}` //for localStorage
const checkedOptsKey = `CheckedOptions: ${MAIN_TITLE}`
const skipByKey = `Skip By Interval: ${MAIN_TITLE}`
const lastTimeStampKey = `Last Time Saved Interval: ${MAIN_TITLE}`

get_last_track_reset_stuff()
navigatorStuff()
local_save_track_modal()
global_modal_initialisation()

window.onbeforeunload = () => {
  localStorage.setItem(lastTimeStampKey, theAudioPlayer.currentTime)
  return null
}

function playNextTrack() {
  if (tracksPlayed.length === 0 || shuffle) {
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

function toggleShuffle() {
  shuffle = !shuffle
  document.getElementById('shuffle').innerText = shuffle
    ? 'Shuffle: ON'
    : 'Shuffle: OFF'
  document.getElementById('shuffleBtn').style.backgroundColor = shuffle
    ? '#886BE4'
    : '#FFA500'

  localStorage.setItem('shuffle', shuffle)
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
  currentArtist = artist
  currentLink = theLinkOfTrack

  console.log(tracksPlayed, `CurrentTrackPointer Index: ${currentTrackPointer}`)
  const theNameOfTrack = getNameOfTrack(theLinkOfTrack)
  const aTag = document.getElementById('trackNameAtag')

  aTag.innerText = theNameOfTrack
  aTag.href = theLinkOfTrack
  theAudioPlayer.src = theLinkOfTrack

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
  let modal = document.getElementById('saveTrackLocalModal')
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

  for (const link in savedTracks) {
    const theNameOfTrack = getNameOfTrack(link)
    const trkMsg = savedTracks[link].replaceAll('\n', ' ')
    li = document.createElement('li')
    li.innerHTML = `${trkMsg}<button onclick="playTrack('${link}')" > ${theNameOfTrack}</button><button onclick="deleteSavedTrack('${link}')" >DELETE</button>`
    ol.appendChild(li)
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
    localStorage.setItem('showOpts', false)
  } else {
    theDiv.style.display = 'block'
    toggleBtn.innerText = 'Hide The Options'
    localStorage.setItem('showOpts', true)
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
    li.innerHTML = `<button onclick="playTrackForSearchedTrack(${index})">${getNameOfTrack(
      TRACK_LINKS[index]
    )}</button>`
    ol.appendChild(li)
  }
}

function navigatorStuff() {
  navigator.mediaSession.setActionHandler('play', () => theAudioPlayer.play())
  navigator.mediaSession.setActionHandler('pause', () => theAudioPlayer.pause())

  navigator.mediaSession.setActionHandler('seekforward', () => skipTrackTime(1))
  navigator.mediaSession.setActionHandler('seekbackward', () =>
    skipTrackTime(-1)
  )
  navigator.mediaSession.setActionHandler('previoustrack', playPreviousTrack)
  navigator.mediaSession.setActionHandler('nexttrack', playNextTrack)

  navigator.mediaSession.setActionHandler('seekto', function(event) {
    theAudioPlayer.currentTime = event.seekTime
  })
}

function getNameOfTrack(link) {
  const title = link.split('/').slice(-1)[0]
  return decodeURIComponent(decodeURIComponent(title))
}

function local_save_track_modal() {
  let modal = document.getElementById('saveTrackLocalModal')
  let btn = document.getElementById('saveTrackBtn')
  let span = document.getElementById('saveTrackLocalModalClose')
  btn.onclick = function() {
    modal.style.display = 'block'
  }
  span.onclick = function() {
    modal.style.display = 'none'
  }
  window.onclick = function(event) {
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

function get_last_track_reset_stuff() {
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
  function check_boxes() {
    const checkedOpts = JSON.parse(localStorage.getItem(checkedOptsKey)) //{opt:true/false}
    if (checkedOpts) {
      for (const opt in checkedOpts) {
        document.getElementById(opt).checked = checkedOpts[opt]
      }
      excludeOrIncludeTracks() //to change tracks pool
    } else {
      document.getElementById(
        'tracksData'
      ).innerText = `Total Tracks in Queue: ${TRACK_LINKS.length}`
    }
  }
  function choose_track() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlInd = parseInt(urlParams.get('trackIndex'))
    if (urlInd) {
      tracksPlayed.push(urlInd)
      currentTrackPointer = 0
      playTrack(TRACK_LINKS[urlInd])
      return
    }

    const link = localStorage.getItem(`LastPlayed: ${MAIN_TITLE}`)
    if (link) {
      tracksPlayed.push(TRACK_LINKS.indexOf(link))
      currentTrackPointer = 0
      playTrack(link)
      const timeOfAudio = localStorage.getItem(lastTimeStampKey)
      if (timeOfAudio) {
        theAudioPlayer.currentTime = timeOfAudio
      }
    } else {
      playRandTrack()
    }
  }
  function put_skip_interval() {
    const skipByOpt = JSON.parse(localStorage.getItem(skipByKey))
    if (skipByOpt) {
      skipByInterval = skipByOpt
    }
    document.getElementById('pickSkipInterval').value = skipByInterval
  }

  if (localStorage.getItem('shuffle') === 'true') toggleShuffle()
  if (localStorage.getItem('showOpts') === 'false') toggleShowingOpts()
  put_options()
  check_boxes()
  choose_track()
  put_skip_interval()
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

function togglePausePlayTrack() {
  const btn = document.getElementById('playPauseBtn')
  if (theAudioPlayer.paused) {
    theAudioPlayer.play()
    btn.src = '/imgs/pause.png'
  } else {
    theAudioPlayer.pause()
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
  theAudioPlayer.currentTime += parseInt(skipByInterval) * direction
}

function changeInterval() {
  const chosed_skipByOpt = document.getElementById('pickSkipInterval').value
  skipByInterval = chosed_skipByOpt
  localStorage.setItem(skipByKey, chosed_skipByOpt)
}

function global_modal_initialisation() {
  //logic to show and hide modal
  const dialog = document.getElementById('dialog')
  const closeBtn = document.getElementById('closeModal')
  const openBtn = document.getElementById('openModal')

  const openDialog = () => dialog.classList.add('show-dialog')
  const closeDialog = () => {
    dialog.classList.remove('show-dialog')
    document.getElementsByTagName('details')[0].open = false
  }
  closeBtn.addEventListener('click', closeDialog)
  openBtn.addEventListener('click', openDialog)

  window.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog()
  })
}

function add_shabad_from_user_input() {
  const input_tag = document.getElementById('usedShabadId')
  const decs_input = document.getElementById('userDesc')
  const user_input = input_tag.value
  const list_opts = document.getElementById('shabadId_list_opts')
  list_opts.innerHTML = ''
  if (user_input === '') return

  let max_items_to_show = 10

  const mapping = {
    a: 'ੳ',
    A: 'ਅ',
    s: 'ਸ',
    S: 'ਸ਼',
    d: 'ਦ',
    D: 'ਧ',
    f: 'ਡ',
    F: 'ਢ',
    g: 'ਗ',
    G: 'ਘ',
    h: 'ਹ',
    H: '੍ਹ',
    j: 'ਜ',
    J: 'ਝ',
    k: 'ਕ',
    K: 'ਖ',
    l: 'ਲ',
    L: 'ਲ਼',
    q: 'ਤ',
    Q: 'ਥ',
    w: 'ਾ',
    W: 'ਾਂ',
    e: 'ੲ',
    E: 'ਓ',
    r: 'ਰ',
    R: '੍ਰ',
    '®': '੍ਰ',
    t: 'ਟ',
    T: 'ਠ',
    y: 'ੇ',
    Y: 'ੈ',
    u: 'ੁ',
    ü: 'ੁ',
    U: 'ੂ',
    '¨': 'ੂ',
    i: 'ਿ',
    I: 'ੀ',
    o: 'ੋ',
    O: 'ੌ',
    p: 'ਪ',
    P: 'ਫ',
    z: 'ਜ਼',
    Z: 'ਗ਼',
    x: 'ਣ',
    X: 'ਯ',
    c: 'ਚ',
    C: 'ਛ',
    v: 'ਵ',
    V: 'ੜ',
    b: 'ਬ',
    B: 'ਭ',
    n: 'ਨ',
    ƒ: 'ਨੂੰ',
    N: 'ਂ',
    ˆ: 'ਂ',
    m: 'ਮ',
    M: 'ੰ',
    µ: 'ੰ',
    '`': 'ੱ',
    '~': 'ੱ',
    '¤': 'ੱ',
    Í: '੍ਵ',
    ç: '੍ਚ',
    '†': '੍ਟ',
    œ: '੍ਤ',
    '˜': '੍ਨ',
    '´': 'ੵ',
    Ï: 'ੵ',
    æ: '਼',
    Î: '੍ਯ',
    ì: 'ਯ',
    í: '੍ਯ',
    1: '੧',
    2: '੨',
    3: '੩',
    4: '੪',
    5: '੫',
    6: '੬',
    '^': 'ਖ਼',
    7: '੭',
    '&': 'ਫ਼',
    8: '੮',
    9: '੯',
    0: '੦',
    '\\': 'ਞ',
    '|': 'ਙ',
    '[': '।',
    ']': '॥',
    '<': 'ੴ',
    '¡': 'ੴ',
    Å: 'ੴ',
    Ú: 'ਃ',
    Ç: '☬',
    '@': 'ੑ',
    '‚': '❁',
    '•': '੶',
    ' ': ' ',
  }
  const gurmukhi_input = user_input
    .split('')
    .map((char) => mapping[char] || char)
    .join('')
  input_tag.value = gurmukhi_input
  const keyObj = findShabadsKey(gurmukhi_input)
  for (let shabad_key in keyObj) {
    const line_ind = keyObj[shabad_key]
    const sbd = ALL_SHABADS[shabad_key]
    const opt = document.createElement('p')

    opt.classList.add('shabad_opt_from_userinput')
    opt.onclick = () => {
      list_opts.innerHTML = `<details><summary>${shabad_key}</summary><div id="shabad_details_form">${ALL_SHABADS[shabad_key]}</div></details>`
      input_tag.value = shabad_key
      // if (decs_input.value === '') {}
      decs_input.value = sbd[line_ind + 1]
      document.getElementById('theShabadSelected').textContent = sbd[line_ind]
    }
    opt.innerText = sbd[line_ind]
    list_opts.appendChild(opt)
    max_items_to_show -= 1
    if (max_items_to_show < 0) break
  }
}

function add_to_form_to_send_to_server(name, value) {
  const form = document.querySelector('#modal-content')
  const additionalField = document.createElement('input')
  additionalField.name = name
  additionalField.value = value
  form.appendChild(additionalField)
  return additionalField
}

function formValidation(e) {
  e.preventDefault()
  const form = document.querySelector('#modal-content')

  const desc = document.querySelector('#userDesc')
  const sbd = document.querySelector('#usedShabadId')
  if (sbd.value === '' && desc.value === '') {
    alert('No Shabad or Description')
    return
  }

  // const itm1 = add_to_form_to_send_to_server('linkToGoTo', 'false')
  add_to_form_to_send_to_server('linkToGoTo', window.location.href)
  add_to_form_to_send_to_server('keertani', currentArtist)
  add_to_form_to_send_to_server('link', currentLink)

  localStorage.setItem(lastTimeStampKey, theAudioPlayer.currentTime)
  form.submit()
}

function findShabadsKey(searchInput) {
  if (searchInput.length < 3) return {}
  const all_matched_shabad_keys = {}
  for (const key in ALL_SHABADS) {
    const shabadArray = ALL_SHABADS[key]

    for (let pu_ln_idx = 0; pu_ln_idx < shabadArray.length; pu_ln_idx += 3) {
      const line = shabadArray[pu_ln_idx]
      // for (const line of shabadArray) {
      const first_letters = first_letters_gurmukhi(line)

      let line_matched = true
      for (let i = 0; i < searchInput.length; i++) {
        if (!line_matched) break
        if (first_letters.length === i || first_letters[i] !== searchInput[i]) {
          line_matched = false
        }
      }

      if (line_matched) {
        all_matched_shabad_keys[key] = pu_ln_idx
        break
      }
    }
  }
  return all_matched_shabad_keys
}

function first_letters_gurmukhi(words) {
  if (typeof words !== 'string') return words

  let newWords = words

  const reverseMapping = {
    ਉ: 'ੳ',
    ਊ: 'ੳ',
    ਆ: 'ਅ',
    ਆਂ: 'ਅ',
    ਐ: 'ਅ',
    ਔ: 'ਅ',
    ਇ: 'ੲ',
    ਈ: 'ੲ',
    ਏ: 'ੲ',
    // 'ੋੁ': 'uo',
  }

  const simplifications = [
    ['E', 'a'],
    ['ਓ', 'ੳ'],
    ['L', 'l'],
    ['ਲ਼', 'ਲ'],
    ['S', 's'],
    ['ਸ਼', 'ਸ'],
    ['z', 'j'],
    ['ਜ਼', 'ਜ'],
    ['Z', 'g'],
    ['ਗ਼', 'ਗ'],
    ['\\^', 'K'],
    ['ਖ਼', 'ਖ'],
    ['ƒ', 'n'],
    ['ਨੂੰ', 'ਨ'],
    ['&', 'P'],
    ['ਫ਼', 'ਫ'],
  ]
  simplifications.forEach((e) => {
    newWords = newWords.replace(new RegExp(e[0], 'g'), e[1])
  })

  newWords = newWords
    .replace(/\]/g, '')
    .replace(/\[/g, '')
    .replace(/॥/g, '')
    .replace(/।/g, '')
    .replace(/rhwau dUjw/g, '')
    .replace(/rhwau/g, '')
    .replace(/[0-9]/g, '')
    .replace(/[;,.]/g, '')

  function firstLetter(word) {
    let letter = word[0]
    if (letter in reverseMapping) {
      letter = reverseMapping[letter]
    }
    return letter
  }

  const letters = newWords.split(' ').map(firstLetter).join('')
  return letters
}

function copyLink() {
  const url = new URL(window.location.href.split('?')[0].split('#')[0])
  url.searchParams.append('trackIndex', tracksPlayed[currentTrackPointer]);
  console.log(url.href)
  navigator.clipboard.writeText(url.href)
}
