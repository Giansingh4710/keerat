import ALL_THEMES from '@/utils/themes'

import { getTrackLinks, isChecked, trackCount } from '@/utils/helper_funcs'
import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { Button } from 'flowbite-react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton } from '@mui/material'
import { useStore } from '@/utils/store.js'
import { List } from 'flowbite-react'
import { ArtistOptBar } from './artistOptBar'

export default function ArtistsOptions() {
  const allOpts = useStore((state) => state.allOptsTracks)
  const setCheckedArtist = useStore((state) => state.setCheckedArtist)
  const setCheckedForAllArtists = useStore(
    (state) => state.setCheckedForAllArtists,
  )

  const numOfTracks = trackCount(allOpts)
  const [showOpts, setShowOpts] = useState(true)

  const optionsDivRef = useRef(null)
  const scrollTo = useRef(0)

  useEffect(() => {
    if (scrollTo.current !== 0 && optionsDivRef.current) {
      optionsDivRef.current.scrollTop = scrollTo.current
    }

    toast.success(`Total Tracks in Queue: ${numOfTracks}`, {
      duration: 1000,
    })
  }, [allOpts])

  function TheButon({ text, onClick }) {
    return (
      <div className='flex place-content-center'>
        <Button className='max-w-48 p-0' onClick={onClick}>
          <p className='text-white text-xs'>{text}</p>
        </Button>
      </div>
    )
  }

  if (!showOpts) {
    return (
      <TheButon text='Show Track Options' onClick={() => setShowOpts(true)} />
    )
  }

  return (
    <>
      <TheButon text='Close Track Options' onClick={() => setShowOpts(false)} />
      <div style={styles.container}>
        <div className='flex-1 flex gap-1'>
          <p className='flex-1 align-baseline text-lg'>
            Total Tracks in Queue: {numOfTracks}
          </p>
          <div className='flex-5'>
            <IconButton onClick={() => setShowOpts(false)}>
              <HighlightOffIcon />
            </IconButton>
          </div>
        </div>

        <List ref={optionsDivRef}>
          {Object.keys(allOpts).map((artist) => {
            const checked = isChecked(allOpts, artist)
            return (
              <ArtistOptBar
                artist={artist}
                checked={checked}
                onClick={() => {
                  setCheckedArtist(artist, !checked)
                }}
              />
            )
          })}
        </List>

        <div style={styles.checkBtnsRow}>
          <button
            style={styles.checkOptsBtns}
            onClick={() => setCheckedForAllArtists(true)}
          >
            Select All
          </button>
          <button
            style={styles.checkOptsBtns}
            onClick={() => setCheckedForAllArtists(false)}
          >
            Unselect All
          </button>
          <button
            style={styles.checkOptsBtns}
            onClick={() => setShowOpts(false)}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    margin: '2em',
    borderRadius: '1em',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.5em',
    padding: '0.5em',
    color: ALL_THEMES.theme1.text1,
    backgroundColor: ALL_THEMES.theme1.third,
  },
  mainBtn: {
    fontSize: '0.5em',
    borderRadius: '1em',
    height: '2em',
  },
  checkBtnsRow: {
    display: 'flex',
    marginTop: '0.5em',
  },
  checkOptsBtns: {
    // fontSize: '0.8em',
    // fontWeight: 'bold',
    // margin: '0rem',
    margin: '0.5em',
    marginLeft: '0.5em',
    fontSize: '1.5em',
    borderRadius: '5px',
    // border: 'none',
    cursor: 'pointer',
  },
  optionsDiv: {
    fontSize: '0.5em',
    fontWeight: 500,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1em',
    overflow: 'scroll',
    border: '1px solid black',
    height: '20em',
  },
}
