'use client'

import ALL_THEMES from '@/utils/themes.js'
import { Modal } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import SearchIcon from '@mui/icons-material/Search'
import { useStore } from '@/utils/store.js'

export default function IndexTrackBtnAndModal({ audioRef, saveTimeLocalStorage}) {
  const [modalOpen, setModal] = useState(false)
  const [description, setDescription] = useState('')
  const [shabadId, setShabadId] = useState('')
  const [shabads, setShabads] = useState([])
  const [currShabad, setCurrShabad] = useState({})
  const [lineClicked, setLineClicked] = useState('')
  const [theTrackType, setTrackType] = useState('')
  const formData = useRef(null)

  const history = useStore((state) => state.history)
  const hstIdx = useStore((state) => state.hstIdx)
  const artist = history[hstIdx]?.artist
  const link = history[hstIdx]?.link

  const [timestamp, setTimestamp] = useState({
    hours: '',
    minutes: '',
    seconds: '',
  })

  useEffect(() => {
    function getTrackType() {
      const trackType = localStorage.getItem('IndexTrack trackType')
      if (trackType === null) {
        return 'random'
      }
      return trackType
    }

    setTrackType(getTrackType())
  }, [])

  function formValidation(e) {
    e.preventDefault()

    const canPostDataToTrackIndex =
      localStorage.getItem('canPostDataToTrackIndex') === 'true' ? true : false
    if (!canPostDataToTrackIndex) {
      alert('You are not allowed to post data to the track index')
      const password = prompt('Enter password if you to save data?')
      if (password === 'gaa') {
        localStorage.setItem('canPostDataToTrackIndex', 'true')
        alert('Correct password!!')
      } else {
        alert('Wrong password')
      }
      return
    }

    function add_to_form_to_send_to_server(name, value) {
      const additionalField = document.createElement('input')
      additionalField.name = name
      additionalField.value = value
      formData.current.appendChild(additionalField)
    }

    if (description === '') {
      alert('Description cannot be empty')
      return
    }

    add_to_form_to_send_to_server('linkToGoTo', window.location.href) //come back to this page
    add_to_form_to_send_to_server('artist', artist)
    add_to_form_to_send_to_server('link', link)

    saveTimeLocalStorage()
    formData.current.submit()
  }

  function ShowShabads() {
    const listStyles = {
      container: {
        display: 'flex',
        flexDirection: 'column',
        height: '20vh',
        overflowY: 'auto',
      },
      btn: {
        color: 'black',
      },
    }

    function SbdDetails() {
      if (shabads.length === 0) return <></>
      return (
        <div>
          <button
            variant='contained'
            onClick={(e) => {
              e.preventDefault()
              console.log(currShabad)
              setDescription(lineClicked)
              setShabadId('')
            }}
          >
            {lineClicked}
          </button>
          <details>
            <summary>{shabadId}</summary>
            <ShabadDetails shabadArray={currShabad.shabadArray} />
          </details>
        </div>
      )
    }

    return (
      <div style={listStyles.container}>
        <SbdDetails />
        {shabads.map((sbd, ind) => {
          const { shabadId, lineInd, shabadArray } = sbd
          const line = shabadArray[lineInd]

          return (
            <button
              style={listStyles.btn}
              key={shabadId}
              onClick={(e) => {
                e.preventDefault()
                setCurrShabad(sbd)

                setLineClicked(line)
                setShabadId(shabadId)
                setDescription(shabadArray[lineInd + 1])
              }}
            >
              {line}
            </button>
          )
        })}
      </div>
    )
  }

  function TrackOptions() {
    const trackTypes = [
      'random',
      'SDO_MGA_1',
      'HeeraRattan',
      'ikirtan_SDO',
      'GianiSherS',
    ]

    return (
      <div>
        <label style={styles.label} htmlFor='trackType'>
          Type of Track:
        </label>
        <select
          name='trackType'
          id='trackType'
          value={theTrackType}
          defaultValue={theTrackType}
          onChange={(e) => {
            localStorage.setItem('IndexTrack trackType', e.target.value)
            setTrackType(e.target.value)
          }}
        >
          {trackTypes.map((trackType) => {
            return (
              <option key={trackType} value={trackType}>
                {trackType}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  return (
    <div>
      <button style={styles.main_btn} onClick={() => setModal(true)}>
        Index Track
      </button>
      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div>
          <form
            ref={formData}
            style={styles.cont}
            onSubmit={(event) => formValidation(event)}
            method='post'
            action='http://45.76.2.28/trackIndex/util/addData.php'
          >
            <div style={styles.userInputItem}>
              <label style={styles.label} htmlFor='userDesc'>
                Description:
              </label>
              <input
                style={styles.userDesc}
                name='description'
                placeholder='bin ek naam ik chit leen'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              ></input>
              <CancelIcon onClick={() => setDescription('')} />
            </div>
            <div style={styles.userInputItem}>
              <label style={styles.label} htmlFor='usedShabadId'>
                Shabad ID:
              </label>
              <input
                style={styles.userDesc}
                name='shabadId'
                placeholder='ਤਕਮਲ'
                value={shabadId}
                onChange={async (event) => {
                  const newInput = convertToGurmukhi(event.target.value)
                  setShabadId(newInput)
                }}
              ></input>
              <SearchIcon
                onClick={async () => {
                  const sbds = await getTheShabads(shabadId)
                  if (sbds.length === 0) {
                    alert('0 Shabads found')
                  }
                  setShabads(sbds)
                }}
              />
              <CancelIcon onClick={() => setShabadId('')} />
            </div>
            <ShowShabads />
            <div style={styles.userInputItem}>
              <label style={styles.label} htmlFor='userTimestamp'>
                Timestamp:
              </label>
              <div style={styles.userDesc}>
                <input
                  name='hours'
                  type='number'
                  min='0'
                  max='59'
                  inputMode='numeric'
                  placeholder='00'
                  style={styles.timeInput}
                  value={timestamp.hours}
                  onChange={(event) =>
                    setTimestamp({ ...timestamp, hours: event.target.value })
                  }
                ></input>
                :
                <input
                  name='mins'
                  type='number'
                  min='0'
                  max='59'
                  inputMode='numeric'
                  placeholder='00'
                  style={styles.timeInput}
                  value={timestamp.minutes}
                  onChange={(event) =>
                    setTimestamp({ ...timestamp, minutes: event.target.value })
                  }
                ></input>
                :
                <input
                  name='secs'
                  type='number'
                  min='0'
                  max='59'
                  inputMode='numeric'
                  placeholder='00'
                  style={styles.timeInput}
                  value={timestamp.seconds}
                  onChange={(event) =>
                    setTimestamp({ ...timestamp, seconds: event.target.value })
                  }
                ></input>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  const currTime = audioRef.current.currentTime
                  const hours = Math.floor(currTime / 3600)
                  const minutes = Math.floor((currTime % 3600) / 60)
                  const seconds = Math.floor(currTime % 60)
                  setTimestamp({
                    hours: hours.toString(),
                    minutes: minutes.toString(),
                    seconds: seconds.toString(),
                  })
                }}
              >
                now
              </button>

              <CancelIcon
                onClick={() =>
                  setTimestamp({
                    hours: '',
                    minutes: '',
                    seconds: '',
                  })
                }
              />
            </div>
            <TrackOptions />
            <button onClick={() => setModal(false)}>Close</button>
            <button type='submit'>Add</button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

function ShabadDetails({ shabadArray }) {
  const gurbaniStyle = {
    gurmukhi: {
      fontSize: '1rem',
      padding: '0',
      margin: '0',
    },
    roman: {
      fontSize: '0.5rem',
      padding: '0',
      margin: '0',
    },
    trans: {
      fontSize: '0.7rem',
      padding: '0',
      margin: '0',
    },
  }

  if (!shabadArray) return <></>
  if (shabadArray.length === 0) return <></>
  return shabadArray.map((line, ind) => {
    let style
    if (ind % 3 == 0) {
      style = gurbaniStyle.gurmukhi
    } else if (ind % 3 == 1) {
      style = gurbaniStyle.roman
    } else {
      style = gurbaniStyle.trans
    }
    return (
      <p style={style} key={ind}>
        {line}
      </p>
    )
  })
}

async function getTheShabads(input) {
  if (input.length < 3) {
    alert('Input should be at least 3 characters long')
    return []
  }
  const res = await fetch(
    'https://www.getshabads.xyz/getShabads?input=' + input,
  )
  const { results } = await res.json()
  return results
}

function convertToGurmukhi(input) {
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
  const gurmukhi_input = input
    .split('')
    .map((char) => mapping[char] || char)
    .join('')
  return gurmukhi_input
}

const styles = {
  main_btn: {
    margin: '2em',
    borderRadius: '10px',
    color: ALL_THEMES.theme1.text2,
    backgroundColor: ALL_THEMES.theme1.third,
  },
  cont: {
    padding: '2em',
    borderRadius: '1em',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    backgroundColor: '#ff7f50',
    color: ALL_THEMES.theme1.text1,
  },
  closeModalBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '31px',
    fontWeight: 'bold',
    margin: '-1em',
    color: ALL_THEMES.theme1.text2,
  },
  userInputItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    marginBottom: '5px',
    padding: '5px',
    backgroundColor: '#0077be',
  },
  label: {
    flex: 0.5,
    fontWeight: 500,
    letterSpacing: 0.2,
    fontSize: '0.75rem',
  },
  userDesc: {
    flex: 1,
    display: 'flex',
  },
  timeInput: {
    flex: 0.5,
    // width: '2em',
    color: ALL_THEMES.theme1.text1,
  },
}
