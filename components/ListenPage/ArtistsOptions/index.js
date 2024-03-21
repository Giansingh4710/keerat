import ALL_THEMES from '@/utils/themes'

import { getTrackLinks } from '@/utils/helper_funcs'
import { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton } from '@mui/material'

export default function ArtistsOptions({
  allOpts,
  setAllOpts,
  setTrackLinks,
  numOfTracks,
}) {
  const [showOpts, setShowOpts] = useState(false)

  const optionsDivRef = useRef(null)
  const scrollTo = useRef(0)

  useEffect(() => {
    if (scrollTo.current !== 0 && optionsDivRef.current) {
      optionsDivRef.current.scrollTop = scrollTo.current
    }

    toast(`Total Tracks in Queue: ${numOfTracks}`, {
      duration: 1000,
    })
  }, [allOpts, numOfTracks])

  function TheOptions() {
    const artist_options = Object.keys(allOpts).map((artist) => {
      return (
        <div key={artist} style={styles.artistOption}>
          <input
            checked={allOpts[artist].checked}
            style={styles.checkbox}
            type='checkbox'
            id={artist}
            onChange={() => {
              setAllOpts(() => {
                const newObj = {
                  ...allOpts,
                  [artist]: {
                    trackLinks: allOpts[artist].trackLinks,
                    checked: !allOpts[artist].checked,
                  },
                }
                setTrackLinks(getTrackLinks(newObj))
                return newObj
              })
              scrollTo.current = optionsDivRef.current.scrollTop
            }}
          />
          <label style={styles.label} htmlFor={artist}>
            {artist}
          </label>
        </div>
      )
    })
    return (
      <div ref={optionsDivRef} style={styles.optionsDiv}>
        {artist_options}
      </div>
    )
  }

  if (!showOpts) {
    return (
      <button
        style={styles.mainBtn}
        onClick={() => {
          setShowOpts(true)
        }}
      >
        Track Options
      </button>
    )
  }

  return (
    <>
      <button onClick={() => setShowOpts(false)} style={styles.mainBtn}>
        Close Track Options
      </button>
      <div style={styles.container}>
        <Toaster position='top-left' reverseOrder={true} />
        <div style={styles.topRow}>
          <p style={styles.trackNums}>Total Tracks in Queue: {numOfTracks}</p>
          <IconButton style={styles.xIcon} onClick={() => setShowOpts(false)}>
            <HighlightOffIcon style={styles.xIcon} />
          </IconButton>
        </div>
        <TheOptions />
        <div style={styles.checkBtnsRow}>
          <button
            style={styles.checkOptsBtns}
            onClick={() => {
              setAllOpts((opts) => {
                Object.keys(opts).forEach((artist) => {
                  opts[artist].checked = true
                })
                setTrackLinks(getTrackLinks(opts))
                return opts
              })
            }}
          >
            Select All
          </button>
          <button
            style={styles.checkOptsBtns}
            onClick={() => {
              setAllOpts((opts) => {
                Object.keys(opts).forEach((artist) => {
                  opts[artist].checked = false
                })
                setTrackLinks(getTrackLinks(opts))
                return opts
              })
            }}
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
  topRow: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: '2em',
    // backgroundColor: 'red',
  },
  trackNums: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: '1.5em',
  },
  xIcon: {
    fontSize: '1rem',
    color: ALL_THEMES.theme1.text1,
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
  artistOption: {
    alignItems: 'center',
    display: 'flex',
    margin: '0.25em',
    borderRadius: '15px',
    backgroundColor: ALL_THEMES.theme1.primary,
  },
  checkbox: {
    // flex: 1,
    margin: '0.5em',
  },
  label: {
    color: ALL_THEMES.theme1.text2,
    fontWeight: 500,
    fontSize: '2.5em',
    // flex: 30,
    // overflowWrap: 'break-word',
    // whiteSpace: 'nowrap',
    // overflow: 'scroll',
    // padding: '0.5em',
  },
}
