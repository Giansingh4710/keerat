'use client'

import ALL_THEMES from '@/utils/themes'
import NavBar from '../NavBar/index.js'
import ArtistsOptions from './ArtistsOptions/index.js'
import TrackPlayback from './TrackPlayback/index.js'
import SaveTrackModal from './SaveTrackModal/index.js'
import SearchTracks from './SearchTracks/index.js'
import ChangeColorsModal from './ChangeColorsModal/index.js'
import IndexTrackBtnAndModal from './IndexTrackModal/index.js'
import { Suspense, useEffect, useRef, useState } from 'react'
import { getNameOfTrack, getTrackLinks } from '@/utils/helper_funcs.js'
import toast, { Toaster } from 'react-hot-toast'

export default function ListenPage({ title, tracksObj, changesOpts }) {
  const [allOpts, setAllOpts] = useState(() => {
    if (changesOpts) changesOpts()
    return tracksObj
  })
  const [TRACK_LINKS, setTrackLinks] = useState(getTrackLinks(allOpts))

  const [shuffle, setShuffle] = useState(false) // audio track stuff
  const timeToGoTo = useRef(0)
  const audioRef = useRef(null)
  const skipTime = useRef(10)
  const [searchInput, setSearchInput] = useState('')

  const [tracksHistory, setTracksHistory] = useState({
    curr_ind: -1, //index in links_lst
    links_lst: [], //list of links
    curr_link: '',
    curr_artist: '',
  })

  useEffect(() => {
    function setAudioTime(the_time) {
      if (!the_time) return

      let seconds = parseInt(the_time)
      if (the_time.includes(':')) {
        const timeLst = the_time.split(':')
        let totalSeconds = 0
        let multiplier = 1
        for (let i = timeLst.length - 1; i > -1; i--) {
          totalSeconds += multiplier * parseInt(timeLst[i])
          multiplier *= 60
        }
        seconds = totalSeconds
      }
      timeToGoTo.current = seconds
    }

    function urlStuff() {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.size === 0) return false

      const urlInd = parseInt(urlParams.get('trackIndex'))
      const urlArtist = urlParams.get('artist')
      const urlTime = urlParams.get('time')
      const urlSearch = urlParams.get('search')
      setAudioTime(urlTime)

      if (allOpts[urlArtist]?.checked === false) {
        setAllOpts({
          ...allOpts,
          [urlArtist]: {
            ...allOpts[urlArtist],
            checked: true,
          },
        })
      }

      if (urlSearch) {
        setSearchInput(urlSearch)
        return true
      }

      const the_link = allOpts[urlArtist]?.trackLinks[urlInd]
      if (!the_link) {
        toast.error(
          `TrackIndex: '${urlInd}' or Artist: '${urlArtist}' from URL is not valid`,
        )
        return false
      }
      playSpecificTrack(the_link)
      return true
    }

    function getLastPlayedTrackLocalStorage() {
      const link = localStorage.getItem(`LastPlayed: ${title}`) // localStorage.getItem("LastPlayed: Classic Akhand Keertan")
      if (typeof link != typeof '') return false

      if (link === '[object BeforeUnloadEvent]') {
        toast.error('object BeforeUnloadEvent error')
        return false
      }

      if (!TRACK_LINKS.includes(link)) {
        toast.error('Link in LocalStorage not in Track_LINKS')
        return false
      }

      const localStorageTime = localStorage.getItem(`LastTime: ${title}`)
      setAudioTime(localStorageTime, timeToGoTo.current)
      playSpecificTrack(link)
      return true
    }

    function getShuffle() {
      if (localStorage.getItem('shuffle') === 'true') setShuffle(true)
    }

    getShuffle()
    if (!urlStuff()) {
      if (!getLastPlayedTrackLocalStorage()) {
        nextTrack()
      }
    }
  }, [])

  //to get rid of next.js Hydration error
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) return <body />

  function getLongestTrack() {
    let longestLink = ''
    for (let i = 0; i < TRACK_LINKS.length; i++) {
      const newLink = getNameOfTrack(TRACK_LINKS[i])
      longestLink = newLink.length > longestLink.length ? newLink : longestLink
    }
    console.log('longestLink: ', longestLink)
    return longestLink
  }

  function saveTrackInLocalStorage(link, time = '0') {
    localStorage.setItem(`LastPlayed: ${title}`, link)
    localStorage.setItem(`LastTime: ${title}`, time)
  }

  function getTypeOfTrack(link) {
    let trackType = 'Unable To Get Info'
    const ind = TRACK_LINKS.indexOf(link)
    if (ind > -1) {
      let totalTrack = 0
      for (const opt in allOpts) {
        if (allOpts[opt].checked) {
          const len = allOpts[opt].trackLinks.length
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

  function navigatorStuff(link, artist) {
    navigator.mediaSession.setActionHandler('play', () =>
      audioRef.current.play(),
    )
    navigator.mediaSession.setActionHandler('pause', () =>
      audioRef.current.pause(),
    )

    navigator.mediaSession.setActionHandler('seekforward', () => {
      audioRef.current.currentTime += skipTime.current
    })
    navigator.mediaSession.setActionHandler(
      'seekbackward',
      () => (audioRef.current.currentTime += skipTime.current * -1),
    )
    navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack)

    navigator.mediaSession.setActionHandler('seekto', function (event) {
      audioRef.current.currentTime = event.seekTime
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: getNameOfTrack(link),
        artist: artist,
        album: title,
      })
    }
  }

  function playTrack(curr_ind, curr_link, links_lst) {
    const curr_artist = getTypeOfTrack(curr_link)
    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
      curr_artist,
    })
    navigatorStuff(curr_link, curr_artist)

    // fixes error when trying to play time from localStorage
    const localLink = localStorage.getItem(`LastPlayed: ${title}`)
    if (curr_link !== localLink) {
      saveTrackInLocalStorage(curr_link, '0') //will be updated localLink
    }
  }

  function randTrack() {
    const randNum = Math.floor(Math.random() * TRACK_LINKS.length)
    const curr_link = TRACK_LINKS[randNum]
    const curr_ind = tracksHistory.links_lst.length
    const links_lst = [...tracksHistory.links_lst, curr_link]
    playTrack(curr_ind, curr_link, links_lst)
  }

  function nextTrack() {
    if (TRACK_LINKS.length === 0) {
      toast.error('No Tracks Available. Please select some Options.')
      return
    }

    let curr_ind
    let curr_link
    let links_lst

    if (tracksHistory.curr_ind === tracksHistory.links_lst.length - 1) {
      if (shuffle) {
        randTrack()
        return
      } else {
        const indOfCurrLink = TRACK_LINKS.indexOf(tracksHistory.curr_link)
        let indOfNextLink = indOfCurrLink + 1
        indOfNextLink =
          indOfNextLink > TRACK_LINKS.length - 1 ? 0 : indOfNextLink

        curr_link = TRACK_LINKS[indOfNextLink]
        curr_ind = tracksHistory.curr_ind + 1
        links_lst = [...tracksHistory.links_lst, curr_link]
      }
    } else {
      curr_ind = tracksHistory.curr_ind + 1
      curr_link = tracksHistory.links_lst[curr_ind]
      links_lst = tracksHistory.links_lst
    }

    playTrack(curr_ind, curr_link, links_lst)
  }

  function prevTrack() {
    if (TRACK_LINKS.length === 0) {
      toast.error('No Tracks Available')
      return
    }

    let curr_ind
    let curr_link
    let links_lst

    if (tracksHistory.curr_ind === 0) {
      const indOfCurrLink = TRACK_LINKS.indexOf(tracksHistory.curr_link)
      let indOfNextLink = indOfCurrLink - 1
      indOfNextLink = indOfNextLink < 0 ? TRACK_LINKS.length - 1 : indOfNextLink

      curr_ind = 0
      curr_link = TRACK_LINKS[indOfNextLink]
      links_lst = [curr_link, ...tracksHistory.links_lst]
    } else if (tracksHistory.curr_ind > 0) {
      curr_ind = tracksHistory.curr_ind - 1
      curr_link = tracksHistory.links_lst[curr_ind]
      links_lst = tracksHistory.links_lst
    }

    playTrack(curr_ind, curr_link, links_lst)
  }

  function playSpecificTrack(link) {
    let ind = tracksHistory.curr_ind
    ind = ind === -1 ? 0 : ind

    const linksLst = tracksHistory.links_lst
    const updatedLinksLst = [
      ...linksLst.slice(0, ind),
      link,
      ...linksLst.slice(ind),
    ]

    playTrack(ind, link, updatedLinksLst)
  }

  return (
    <body
      style={{
        backgroundColor: ALL_THEMES.theme1.primary,
      }}
    >
      <Toaster position='top-left' reverseOrder={true} />
      <NavBar title={title} />
      <SearchTracks
        track_links={TRACK_LINKS}
        playSpecificTrack={playSpecificTrack}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <SaveTrackModal
        localStorageKey={`SavedTracks: ${title}`}
        link={tracksHistory.curr_link}
        playSpecificTrack={playSpecificTrack}
      />
      <ArtistsOptions
        allOpts={allOpts}
        setAllOpts={setAllOpts}
        setTrackLinks={setTrackLinks}
        numOfTracks={TRACK_LINKS.length}
      />
      <TrackPlayback
        artist={tracksHistory.curr_artist}
        link={tracksHistory.curr_link}
        allOpts={allOpts}
        shuffle={shuffle}
        setShuffle={setShuffle}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
        timeToGoTo={timeToGoTo}
        audioRef={audioRef}
        skipTime={skipTime}
        toast={toast}
      />
      {/*
        <ChangeColorsModal />
      */}
      <Suspense fallback={<div>Loading...</div>}>
        <IndexTrackBtnAndModal
          artist={tracksHistory.curr_artist}
          link={tracksHistory.curr_link}
          audioRef={audioRef}
          saveTrackLS={() => {
            saveTrackInLocalStorage(
              tracksHistory.curr_link,
              audioRef.current.currentTime,
            )
          }}
        />
      </Suspense>
    </body>
  )
}
