import * as React from 'react'
import { formatTime } from '@/utils/helper_funcs'

export default function AudioPlayer({
  link,
  audioRef,
  setPaused,
  timeToGoTo,
  playbackSpeed,
  nextTrack,
  toast,
}) {
  const [buffered, setBuffered] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)

  const handleBufferProgress = (e) => {
    const audio = e.currentTarget
    const dur = audio.duration
    setCurrentTime(audio.currentTime)
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i,
          )
          setBuffered(bufferedLength)
          break
        }
      }
    }
  }

  const audioComponent = React.useMemo(() => {
    return (
      <audio
        ref={audioRef}
        key={link}
        autoPlay={true}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onTimeUpdate={handleBufferProgress}
        onProgress={handleBufferProgress}
        onEnded={() => nextTrack()}
        onError={() => alert('Error loading audio')}
        onLoadedData={() => {
          audioRef.current.currentTime = timeToGoTo.current
          timeToGoTo.current = 0
          audioRef.current.playbackRate = playbackSpeed.current
          setPaused(audioRef.current.paused) // for initial load. Browser blocks autoplay
          toast.success('Audio Loaded')
        }}
        onSeeking={() => {}}
      >
        <source type='audio/mpeg' src={link} />
      </audio>
    )
  }, [link, audioRef])

  return (
    <div
      style={{
        width: '100%',
        paddingTop: '1em',
        paddingBottom: '1em',
      }}
    >
      {audioComponent}
      <AudioProgressBar
        audioRef={audioRef}
        buffered={buffered}
        currentTime={currentTime}
      />
    </div>
  )
}

function AudioProgressBar({ audioRef, buffered, currentTime }) {
  // const currentTime = audioRef?.current?.currentTime || 0
  const duration = audioRef?.current?.duration || 0
  const bufferedWidth = isNaN(buffered / duration)
    ? 0
    : (buffered / duration) * 100

  const handleChange = (event) => {
    const newValue = event.target.value
    audioRef.current.currentTime = newValue
  }

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'black',
        padding: '5px',
        borderRadius: '5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <input
          type='range'
          className='slider'
          style={{
            width: '100%',
            background: `linear-gradient(to right, grey ${bufferedWidth}%, #f0f0f0 ${bufferedWidth}% 100%)`,
            // opacity: 0.7,

            WebkitAppearance: 'none',
            WebkitTransition: '0.2s',

            height: '15px',
            borderRadius: '5px',
            outline: 'none',
            transition: 'opacity 0.2s',
          }}
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleChange}
        />
        <span>{formatTime(duration)}</span>
      </div>
      <style jsx>
        {`
          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 10px;
            height: 25px;
            border-radius: 10px;
            background: #ff8100;
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            width: 10px;
            height: 25px;
            border-radius: 10px;
            background: #04aa6d;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  )
}
