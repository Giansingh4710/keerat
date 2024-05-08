'use client'

import ALL_THEMES from '@/utils/themes'
import NavBar from '../NavBar/index.js'
import ArtistsOptions from './ArtistsOptions/index.js'
import TrackPlayback from './TrackPlayback/index.js'
import SaveTrackModal from './SaveTrackModal/index.js'
import SearchTracks from './SearchTracks/index.js'
import IndexTrackBtnAndModal from './IndexTrackModal/index.js'
import { useEffect, useRef, useState } from 'react'
import { getNameOfTrack } from '@/utils/helper_funcs.js'
import toast, { Toaster } from 'react-hot-toast'
import { useStore } from '@/utils/store.js'

export default function ListenPage({ title, allTheOpts, changesOpts }) {
  const [allOpts, setAllOpts] = useState(() => {
    return {}
    if (changesOpts) changesOpts()
    return allTheOpts
  })
  const setTracks = useStore((state) => state.setTracks)
  const tracks = useStore((state) => state.tracks)
  const prevTrack = useStore((state) => state.prevTrack)
  const nextTrack = useStore((state) => state.nextTrack)
  const setShuffle = useStore((state) => state.setShuffle)
  const history = useStore((state) => state.history)

  const timeToGoTo = useRef(0)
  const audioRef = useRef(null)
  const skipTime = useRef(10)
  const [searchInput, setSearchInput] = useState('')

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

    // getShuffle()
    // if (!urlStuff()) {
    //   if (!getLastPlayedTrackLocalStorage()) {
    //     nextTrack()
    //   }
    // }
    setTracks(allTheOpts)
    nextTrack()
  }, [])

  //to get rid of next.js Hydration error
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) return <body />

  function saveTrackInLocalStorage(link, time = '0') {
    localStorage.setItem(`LastPlayed: ${title}`, link)
    localStorage.setItem(`LastTime: ${title}`, time)
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
        // title: getNameOfTrack(link),
        title: 'bob',
        artist: artist,
        album: title,
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
        // track_links={TRACK_LINKS}
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
        saveTrackLS={() => {
          saveTrackInLocalStorage(history.link, audioRef.current.currentTime)
        }}
      />
    </body>
  )
}
