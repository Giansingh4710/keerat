import ALL_THEMES from '@/utils/themes.js'
import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import { Modal } from '@mui/material'

export default function ChangeColorsModal() {
  const [modalOpen, setModal] = useState(false)
  const [colors, setColors] = useState({
    primary: '#ff0000',
    secondary: '#00ff00',
    tertiary: '#0000ff',
  })

  const handleChangeComplete = (color, colorType) => {
    setColors((prevColors) => ({
      ...prevColors,
      [colorType]: color.hex,
    }))
  }

  return (
    <>
      <button style={styles.main_btn} onClick={() => setModal(true)}>
        Change Color
      </button>
      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div>
          <div>
            <h2>Select Primary Color</h2>
            <SketchPicker
              color={colors.primary}
              onChangeComplete={(color) =>
                handleChangeComplete(color, 'primary')
              }
            />
          </div>
        </div>
      </Modal>
    </>
  )
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
