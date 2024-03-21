import ALL_THEMES from '@/utils/themes.js'
import { Button, Modal } from '@mui/material'
import { useRef, useState } from 'react'
import { ALL_SHABADS } from './allShabads.js'
import CancelIcon from '@mui/icons-material/Cancel'
import {containsOnlyDigits} from '@/utils/helper_funcs.js'

export default function IndexTrackBtnAndModal({ artist, link }) {
  const [modalOpen, setModal] = useState(false)
  const [description, setDescription] = useState('')
  const [shabadId, setShabadId] = useState('')
  const [shabads, setShabads] = useState([])
  const [lineClicked, setLineClicked] = useState('')
  const [submitFormBtnDisabled, setSubmitFormBtnDisabled] = useState(false)
  const formData = useRef(null)
  

  const [timestamp, setTimestamp] = useState({
    hours: '',
    minutes: '',
    seconds: '',
  })

  function formValidation(e) {
    e.preventDefault()

    const canPostDataToTrackIndex = localStorage.getItem('canPostDataToTrackIndex') === 'true' ? true : false
    if (!canPostDataToTrackIndex){
      alert('You are not allowed to post data to the track index')
      const password = prompt('Enter password if you to save data?')
      if (password === 'gaa') {
        localStorage.setItem('canPostDataToTrackIndex', 'true')
        alert('Correct password!!')
      }else{
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

    if (containsOnlyDigits(timestamp.hours) && containsOnlyDigits(timestamp.minutes) && containsOnlyDigits(timestamp.seconds)) {
      alert('Timestamp cannot be empty')
      return
    }

    add_to_form_to_send_to_server('linkToGoTo', window.location.href) //come back to this page
    add_to_form_to_send_to_server('keertani', artist)
    add_to_form_to_send_to_server('link', link)

    formData.current.submit()
    setSubmitFormBtnDisabled(true)
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
      if (shabads.length === 0 || !(shabadId in ALL_SHABADS)) return <></>
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
      return (
        <div>
          <Button
            variant='contained'
            onClick={() => {
              setDescription(lineClicked)
              setShabadId('')
            }}
          >
            {lineClicked}
          </Button>
          <details>
            <summary>{shabadId}</summary>
            {ALL_SHABADS[shabadId].map((line, ind) => {
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
            })}
          </details>
        </div>
      )
    }

    return (
      <div style={listStyles.container}>
        <SbdDetails />
        {shabads.map((sbd, ind) => {
          const line = ALL_SHABADS[sbd.shabadId][sbd.lineInd]
          return (
            <button
              style={listStyles.btn}
              key={sbd.shabadId}
              onClick={(e) => {
                e.preventDefault()
                setLineClicked(line)
                setShabadId(sbd.shabadId)
                setDescription(ALL_SHABADS[sbd.shabadId][sbd.lineInd + 1])
              }}
            >
              {line}
            </button>
          )
        })}
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
                onChange={(event) => {
                  const newInput = convertToGurmukhi(event.target.value)
                  setShabadId(newInput)
                  if (newInput.length > 2) {
                    const shabads = get_sbds_first_letters(newInput)
                    setShabads(shabads)
                  }
                }}
              ></input>
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
            <button onClick={() => setModal(false)}>Close</button>
            <button type='submit' disabled={submitFormBtnDisabled}>
              Add
            </button>
          </form>
        </div>
      </Modal>
    </div>
  )
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

function get_sbds_first_letters(gurmukhi_input) {
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

  for (let i = 0; i < gurmukhi_input.length; i++) {
    const char = gurmukhi_input[i]
    if (char >= '0' && char <= '9') {
      console.log('num in search input')
      return []
    }
  }

  const all_matched_shabad_keys = []
  for (const key in ALL_SHABADS) {
    const shabadArray = ALL_SHABADS[key]

    for (let pu_ln_idx = 0; pu_ln_idx < shabadArray.length; pu_ln_idx += 3) {
      const line = shabadArray[pu_ln_idx]
      const first_letters = first_letters_gurmukhi(line)

      let line_matched = true
      for (let i = 0; i < gurmukhi_input.length; i++) {
        if (
          first_letters.length === i ||
          first_letters[i] !== gurmukhi_input[i]
        ) {
          line_matched = false
          break
        }
      }

      if (line_matched) {
        all_matched_shabad_keys.push({
          shabadId: key,
          lineInd: pu_ln_idx,
        })
        break
      }
    }
  }
  return all_matched_shabad_keys
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
    padding: '10px',
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
  },
  timeInput: {
    width: '3em',
    color: ALL_THEMES.theme1.text1,
  },
}
