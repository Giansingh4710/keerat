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
  showSavedTracks()
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

function showSavedTracks() {
  const searchDiv = document.getElementById('searchResults')
  const ptag = searchDiv.getElementsByTagName('p')[0]
  const ol = searchDiv.getElementsByTagName('ol')[0]
  const button = document.getElementById('showSavedTrksBtn')

  clearSearch()
  searchDiv.style.display = 'block'
  /* if (ptag.innerHTML !== '') {
    clearSearch()
    button.innerText = 'Show Saved Tracks'
    return
  } */

  let savedTracks = localStorage.getItem(`SavedTracks: ${MAIN_TITLE}`)
  savedTracks = JSON.parse(savedTracks)

  const numOfTracks = savedTracks ? Object.keys(savedTracks).length : 0
  for (const link in savedTracks) {
    const theNameOfTrack = getNameOfTrack(link)
    const trkMsg = savedTracks[link].replaceAll('\n', ' ')
    li = document.createElement('li')
    li.innerHTML = `${trkMsg}<button onclick="playTrack('${link}')" > ${theNameOfTrack}</button><button onclick="deleteSavedTrack('${link}')" >DELETE</button>`
    ol.appendChild(li)
  }

  ptag.innerText = `${numOfTracks} Tracks Saved`
  // button.innerText = 'Hide Saved Tracks'
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

function searchForShabad(searchVal) {
  const searchDiv = document.getElementById('searchResults')
  const ol = searchDiv.getElementsByTagName('ol')[0]
  const ptag = document.getElementById('resultsFound')

  searchDiv.style.display = 'block'
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

  if (searchVal === '') {
    clearSearch()
    return
  }

  ol.innerHTML = ''
  ptag.innerText = `${allLinksWithWordInds.length} Results Found`

  for (const index of allLinksWithWordInds) {
    li = document.createElement('li')
    li.innerHTML = `<button onclick="playTrackForSearchedTrack(${index})">${getNameOfTrack(
      TRACK_LINKS[index]
    )}</button>`
    ol.appendChild(li)
  }
  return allLinksWithWordInds
}

function clearSearch() {
  const searchDiv = document.getElementById('searchResults')
  const ol = searchDiv.getElementsByTagName('ol')[0]
  const ptag = document.getElementById('resultsFound')

  document.getElementById('searchInput').value = ''
  ptag.innerText = ''
  ol.innerHTML = ''
  searchDiv.style.display = 'none'
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
    function play_track(link, the_time) {
      currentTrackPointer = 0
      tracksPlayed.push(TRACK_LINKS.indexOf(link))
      playTrack(link)

      if (!the_time) return
      let seconds = the_time

      if (the_time.includes(':')) {
        const timeLst = the_time.split(':')
        let totalSeconds = 0
        let muliplier = 1
        for (let i = timeLst.length - 1; i > -1; i--) {
          totalSeconds += muliplier * parseInt(timeLst[i])
          muliplier *= 60
        }
        seconds = totalSeconds
      }
      theAudioPlayer.currentTime = seconds
    }

    const urlParams = new URLSearchParams(window.location.search)
    const urlInd = parseInt(urlParams.get('trackIndex'))
    const urlArtist = urlParams.get('artist')
    const urlTime = urlParams.get('time')
    const urlSearch = urlParams.get('search')
    // console.log(urlInd, urlArtist, urlTime, urlSearch)

    if (urlArtist) {
      document.getElementById(urlArtist).checked = true
      excludeOrIncludeTracks()
    }

    if (urlInd > -1) {
      const the_link = ALL_OPTS[urlArtist].trackLinks[urlInd]
      play_track(the_link, urlTime)
      return
    } else if (urlSearch) {
      document.getElementById('searchInput').value = urlSearch
      const tracks = searchForShabad(urlSearch)
      if (tracks.length === 1) {
        const the_link = TRACK_LINKS[tracks[0]]
        play_track(the_link, urlTime)
        // clearSearch()
        return
      }
    }

    const the_link = localStorage.getItem(`LastPlayed: ${MAIN_TITLE}`)
    if (the_link) {
      const the_time = localStorage.getItem(lastTimeStampKey)
      play_track(the_link, the_time)
      return
    }

    playRandTrack()
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
  const sbdId_input_tag = document.getElementById('usedShabadId')
  const decs_input = document.getElementById('userDesc')
  const user_input = sbdId_input_tag.value
  const list_opts = document.getElementById('shabadId_list_opts')

  const sbdDetails = document.getElementById('sbdDetails')
  const summaryTag = sbdDetails.getElementsByTagName('summary')[0]
  const fullSbdDiv = sbdDetails.getElementsByTagName('div')[0]

  const gurbaniLineDiv = document.getElementById('gurbani_line')
  // const show_line_p = gurbaniLineDiv.getElementsByTagName('div')[0]
  const only_do_line_btn = gurbaniLineDiv.getElementsByTagName('button')[0]

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
  sbdId_input_tag.value = gurmukhi_input

  const keyObj = findShabadsKey(gurmukhi_input)
  for (let shabad_key in keyObj) {
    const line_ind = keyObj[shabad_key]
    const sbd = ALL_SHABADS[shabad_key]
    const opt = document.createElement('button')

    opt.classList.add('shabad_opt_from_userinput')
    opt.onclick = (e) => {
      e.preventDefault() //to not submit form
      sbdDetails.style.display = 'block'
      summaryTag.textContent = shabad_key
      fullSbdDiv.innerHTML = ALL_SHABADS[shabad_key].join('<br>')
      sbdId_input_tag.value = shabad_key
      decs_input.value = sbd[line_ind + 1] // the english transliteration

      gurbaniLineDiv.style.display = 'block'
      only_do_line_btn.textContent = sbd[line_ind]
      only_do_line_btn.onclick = (ev) => {
        ev.preventDefault()
        decs_input.value = sbd[line_ind]
        sbdId_input_tag.value = ''
      }
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

function findShabadsKey(search_input) {
  if (search_input.length < 3) return {}
  const all_matched_shabad_keys = {}
  for (const key in ALL_SHABADS) {
    const shabadArray = ALL_SHABADS[key]

    for (let pu_ln_idx = 0; pu_ln_idx < shabadArray.length; pu_ln_idx += 3) {
      const line = shabadArray[pu_ln_idx]
      // for (const line of shabadArray) {
      const first_letters = first_letters_gurmukhi(line)

      let line_matched = true
      for (let i = 0; i < search_input.length; i++) {
        if (!line_matched) break
        if (
          first_letters.length === i ||
          first_letters[i] !== search_input[i]
        ) {
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
  function get_ind_from_artist_tracks(the_link) {
    const allLinks = ALL_OPTS[currentArtist].trackLinks
    for (let link of allLinks) {
      if (link === the_link) return allLinks.indexOf(link)
    }
    return -1
  }

  url.searchParams.append('time', parseInt(theAudioPlayer.currentTime))
  url.searchParams.append('artist', currentArtist)
  url.searchParams.append('trackIndex', get_ind_from_artist_tracks(currentLink))
  navigator.clipboard.writeText(url.href)
}
