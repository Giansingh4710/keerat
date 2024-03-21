import ALL_THEMES from '@/utils/themes'
import { Modal } from '@mui/material'
import { useEffect, useState } from 'react'

import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import DeleteIcon from '@mui/icons-material/Delete'
import { getNameOfTrack } from '@/utils/helper_funcs'

function putTrackInLocalStorage(link, note, localStorageKey) {
  let savedItems = localStorage.getItem(localStorageKey)
  if (!savedItems) {
    savedItems = {}
  } else {
    savedItems = JSON.parse(savedItems)
  }

  savedItems[link] = note
  localStorage.setItem(localStorageKey, JSON.stringify(savedItems))
}

const styles = {
  main_buttons: {
    paddingBottom: '2em',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  btn: {
    // fontWeight: 'bold',
    borderRadius: '15px',
    color: ALL_THEMES.theme1.text2,
    backgroundColor: ALL_THEMES.theme1.third,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5em',
  },
  btnTxt: {
    fontSize: '0.6rem',
    flex: 6,
  },
  icon: {
    fontSize: '1rem',
    flex: 1,
  },
}

const modalStyles = {
  modalDiv: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    // padding: '20px',
    backgroundColor: ALL_THEMES.theme1.primary,

    border: `2px solid ${ALL_THEMES.theme1.text2}`,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  modalDivClose: {
    // fontSize: '28px',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    flex: 1,
    height: '1.5em',
    color: ALL_THEMES.theme1.text1,
  },
  heading: {
    flex: 10,
    fontWeight: 'bold',
    color: ALL_THEMES.theme1.text2,
  },
  textArea: {
    color: ALL_THEMES.theme1.text1,
  },
}

function DisplayTracks({
  showTracks,
  playSpecificTrack,
  localStorageKey,
  modalOpen,
}) {
  const [savedTracks, setSavedTracks] = useState({})

  useEffect(() => {
    setSavedTracks(JSON.parse(localStorage.getItem(localStorageKey)))
  }, [showTracks, modalOpen])

  if (!showTracks) return <></>

  const listStyles = {
    cont: {
      color: ALL_THEMES.theme1.text2,
      overflow: 'auto',
    },
    ol: {
      height: '10em',
      border: '1px solid white',
      borderRadius: '5px',
      overflow: 'scroll',
      paddingBottom: '1em',
    },
    li: {
      // display: 'flex',
      // justifyContent: 'space-between',
      // padding: '0.5em',
      // borderBottom: '1px solid white',
    },
    p: {
      display: 'inline-block',
      paddingRight: '1em',
    },
    btn: {},
  }

  const listItems = []
  for (const link in savedTracks) {
    const trkMsg = savedTracks[link].replaceAll('\n', ' ')
    const trackName = getNameOfTrack(link)
    listItems.push(
      <li key={link} style={listStyles.li}>
        <p style={listStyles.p}>{trkMsg}</p>
        <button style={listStyles.btn} onClick={() => playSpecificTrack(link)}>
          {trackName}
        </button>
        <button
          style={listStyles.btn}
          onClick={() => {
            setSavedTracks((prevSaved) => {
              delete prevSaved[link]
              localStorage.setItem(localStorageKey, JSON.stringify(prevSaved))
              return { ...prevSaved }
            })
          }}
        >
          <DeleteIcon style={styles.icon} />
        </button>
      </li>,
    )
  }

  return (
    <div style={listStyles.cont}>
      <p>{listItems.length}: Saved Tracks</p>
      <ol style={listStyles.ol}>{listItems}</ol>
    </div>
  )
}

export default function SaveTrackModal({
  localStorageKey,
  link,
  playSpecificTrack,
}) {
  const [note, setNote] = useState('')
  const [modalOpen, setModal] = useState(false)
  const [showTracks, setShowing] = useState(false)

  return (
    <div>
      <div style={styles.main_buttons}>
        <button style={styles.btn} onClick={() => setShowing(!showTracks)}>
          <FormatListNumberedIcon style={styles.icon} />
          <p style={styles.btnTxt}>
            {showTracks ? 'Hide Saved Tracks' : 'Show Saved Tracks'}
          </p>
        </button>
        <button style={styles.btn} onClick={() => setModal(true)}>
          <BookmarkAddedIcon style={styles.icon} />
          <p style={styles.btnTxt}>Save Current Track</p>
        </button>
      </div>

      <DisplayTracks
        showTracks={showTracks}
        localStorageKey={localStorageKey}
        playSpecificTrack={playSpecificTrack}
        modalOpen={modalOpen}
      />

      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div style={modalStyles.modalDiv}>
          <div style={modalStyles.topRow}>
            <p style={modalStyles.heading}>
              Enter a note if you would like (Optional):
            </p>
            <button
              style={modalStyles.modalDivClose}
              onClick={() => setModal(false)}
            >
              &times;
            </button>
          </div>
          <div>
            <textarea
              placeholder='ex: Amazing Bani at 10:00'
              style={modalStyles.textArea}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              style={modalStyles.btn}
              onClick={() => {
                putTrackInLocalStorage(link, note, localStorageKey)
                setModal(false)
                setNote('')
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
