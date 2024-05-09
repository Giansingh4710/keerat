'use client'

import ALL_THEMES from '@/utils/themes'
import NavBar from '../NavBar/index.js'
import ArtistsOptions from './ArtistsOptions/index.js'
import TrackPlayback from './TrackPlayback/index.js'
import SaveTrackModal from './SaveTrackModal/index.js'
import SearchTracks from './SearchTracks/index.js'
import IndexTrackBtnAndModal from './IndexTrackModal/index.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getLinkFromOldUrlDate,
  getNameOfTrack,
  getObjFromUrl,
  getSecondsFromTimeStamp,
  validTrackObj,
} from '@/utils/helper_funcs.js'
import toast, { Toaster } from 'react-hot-toast'
import { useStore } from '@/utils/store.js'

export default function ListenPage({ title, allTheOpts, changesOpts }) {
  const prevTrack = useStore((state) => state.prevTrack)
  const nextTrack = useStore((state) => state.nextTrack)
  const setShuffle = useStore((state) => state.setShuffle)
  const setHistory = useStore((state) => state.setHistory)
  const history = useStore((state) => state.history)
  const hstIdx = useStore((state) => state.hstIdx)
  const setTracks = useStore((state) => state.setTracks)

  const timeToGoTo = useRef(0)
  const audioRef = useRef(null)
  const skipTime = useRef(10)
  const [searchInput, setSearchInput] = useState('')

  useMemo(() => setTracks(allTheOpts), [])

  useEffect(() => {
    const currTrackData = history[hstIdx]
    if (validTrackObj(currTrackData)) {
      localStorage.setItem(
        `LastPlayed: ${title}`,
        JSON.stringify(currTrackData),
      )
    }
    navigatorStuff()
  }, [hstIdx])

  useEffect(() => {
    function urlStuff() {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.size === 0) return false

      const urlSearch = urlParams.get('search')
      if (urlSearch) {
        setSearchInput(urlSearch)
        return true
      }
      timeToGoTo.current = getSecondsFromTimeStamp(urlParams.get('time'))

      const theUrl = urlParams.get('url')
      const trkObj = getObjFromUrl(theUrl, allTheOpts)
      if (validTrackObj(trkObj)) {
        setHistory([trkObj])
        return true
      } else {
        // for old links that have 'artist','trackIndex'
        const artist = urlParams.get('artist')
        const trackIndex = urlParams.get('trackIndex')
        const url = getLinkFromOldUrlDate(artist, trackIndex, allTheOpts)
        const trkObj = getObjFromUrl(url, allTheOpts)
        if (validTrackObj(trkObj)) {
          toast("Old copied link")
          setHistory([trkObj])
          return true
        }
      }
      // toast.error(`${theUrl}: Not from this page`, { duration: 10000 })
      return false
    }

    function getLastPlayedTrackLocalStorage() {
      const strData = localStorage.getItem(`LastPlayed: ${title}`)
      if (!strData || strData === 'undefined') return false
      const trkObj = JSON.parse(strData)
      if (!validTrackObj(trkObj)) {
        return false
      }
      setHistory([trkObj])

      const localStorageTime = localStorage.getItem(`LastTime: ${title}`)
      timeToGoTo.current = getSecondsFromTimeStamp(localStorageTime)
      return true
    }

    function getShuffle() {
      if (localStorage.getItem('shuffle') === 'true') setShuffle(true)
    }

    getShuffle()
    if (!urlStuff()) {
      if (!getLastPlayedTrackLocalStorage()) {
        // nextTrack()
      }
    }
  }, [])

  //to get rid of next.js Hydration error
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) return <body />

  function navigatorStuff() {
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
        title: getNameOfTrack(history[hstIdx].link),
        artist: history[hstIdx].artist,
        album: history[hstIdx].type,
        // album: title,
      })
    }
  }

  // here

  return (
    <body
      style={{
        backgroundColor: ALL_THEMES.theme1.primary,
      }}
    >
      <Toaster position='top-left' reverseOrder={true} />
      <NavBar title={title} />
      <SearchTracks
        // playSpecificTrack={playSpecificTrack}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <SaveTrackModal
        localStorageKey={`SavedTracks: ${title}`}
        // playSpecificTrack={playSpecificTrack}
      />
      <ArtistsOptions />
      <TrackPlayback
        timeToGoTo={timeToGoTo}
        audioRef={audioRef}
        skipTime={skipTime}
        toast={toast}
      />
      {/*
        <ChangeColorsModal />
      */}
      <IndexTrackBtnAndModal
        audioRef={audioRef}
        saveTimeLocalStorage={() => {
          localStorage.setItem(
            `LastTime: ${title}`,
            audioRef.current.currentTime,
          )
        }}
      />
    </body>
  )
}
