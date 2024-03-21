import ALL_THEMES from '@/utils/themes'
import { useMemo, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

import { IconButton } from '@mui/material'
import { getNameOfTrack } from '@/utils/helper_funcs'

export default function SearchTracks({
  track_links,
  playSpecificTrack,
  searchInput,
  setSearchInput,
}) {
  const urlParams = new URLSearchParams(window.location.search)
  const urlSearch = urlParams.get('search')

  function ShowingOfTracks() {
    if (searchInput === '') {
      return <></>
    }
    const searchWordsLst = searchInput.toLowerCase().split(' ')
    const allLinksWithWord = []
    track_links.forEach((link, index) => {
      const trackName = link.toLowerCase()
      let allWordsInTrackName = true
      for (const word of searchWordsLst) {
        if (!trackName.includes(word)) {
          allWordsInTrackName = false
          break
        }
      }
      if (allWordsInTrackName) {
        allLinksWithWord.push(link)
      }
    })

    if (allLinksWithWord.length === 1 && urlSearch === searchInput) {
      playSpecificTrack(allLinksWithWord[0])
    }

    return (
      <div style={styles.results}>
        <p>{allLinksWithWord.length} Results Found</p>
        <ol style={styles.ol}>
          {allLinksWithWord.map((link, index) => {
            return (
              <li key={index}>
                <button
                  style={styles.btn}
                  onClick={() => {
                    playSpecificTrack(link)
                  }}
                >
                  {getNameOfTrack(link)}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  const showTracks = useMemo(() => <ShowingOfTracks />, [searchInput])

  return (
    <div style={styles.cont}>
      <div style={styles.topRow}>
        <input
          placeholder='Search for Track:'
          style={styles.searchInput}
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        <IconButton style={styles.xIcon} onClick={() => setSearchInput('')}>
          <HighlightOffIcon />
        </IconButton>
      </div>
      {showTracks}
    </div>
  )
}

const styles = {
  cont: {
    padding: '1em',
  },
  topRow: {
    paddingBottom: '0.5em',
    display: 'flex',
    justifyContent: 'center',
  },
  searchInput: {
    width: '26.5rem',
    borderRadius: '0.5em',
    fontSize: '1.5em',
    color: ALL_THEMES.theme1.text2,
    paddingLeft: '1em',
    // background: 'url("https://static.thenounproject.com/png/101791-200.png") no-repeat left',
    // backgroundSize: '20px',
    backgroundColor: ALL_THEMES.theme1.text1,
  },
  xIcon: {
    color: ALL_THEMES.theme1.text2,
  },
  ol: {
    color: ALL_THEMES.theme1.text2,
  },
  results: {
    color: ALL_THEMES.theme1.text2,
    height: '200px',
    overflow: 'scroll',
    border: '1px solid white',
    borderRadius: '5px',
  },
  btn: {
    fontSize: '0.5em',
  },
}
