export function randItemFromArr(arr) {
  return arr.splice((Math.random() * arr.length) | 0, 1)[0]
}

export function loopIncrement(arr, currentIdx) {
  return (currentIdx + 1) % arr.length
}

export function randIdx(arr) {
  return Math.floor(Math.random() * arr.length)
}

export function getRandomKey(obj) {
  return Object.keys(obj)[(Math.random() * Object.keys(obj).length) | 0]
}

export function getNameOfTrack(link) {
  console.log('link:', link)
  const title = link.split('/').slice(-1)[0]
  return decodeURIComponent(decodeURIComponent(title))
}

export function getTrackLinks(allOpts) {
  const links = []
  Object.keys(allOpts).forEach((artist) => {
    if (allOpts[artist].checked) {
      links.push(...allOpts[artist].trackLinks)
    }
  })
  return links
}

export function formatTime(timeInSeconds) {
  if (!timeInSeconds) return ''
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  let hours = Math.floor(timeInSeconds / 3600)
  let minutes = Math.floor((timeInSeconds % 3600) / 60)
  let seconds = Math.floor(timeInSeconds % 60)

  hours = str_pad_left(hours, '0', 2)
  minutes = str_pad_left(minutes, '0', 2)
  seconds = str_pad_left(seconds, '0', 2)

  let formattedTime = ''
  if (hours === '00') {
    formattedTime = `${minutes}:${seconds}`
  } else {
    formattedTime = `${hours}:${minutes}:${seconds}`
  }

  return formattedTime
}

export function containsOnlyDigits(str) {
  return /^\d+$/.test(str)
}

export function addCheckedKey(allOpts, checked = true) {
  for (const artist in allOpts) {
    // console.log('artist:', artist)
    for (const obj of allOpts[artist]) {
      obj.checked = checked
    }
  }
  return allOpts
}

export function trackCount(allOpts) {
  let count = 0
  for (const artist in allOpts) {
    for (const obj of allOpts[artist]) {
      if (obj.checked) count += obj.links.length
    }
  }
  return count
}
